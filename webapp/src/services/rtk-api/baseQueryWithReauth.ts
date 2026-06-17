import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { Platform } from "react-native";

import type { RootState } from "@/stores";
import { loggedOut, tokenReceived } from "@/stores/slices/auth.slice";
import type { RefreshResponse } from "@/types/auth";

const mutex = new Mutex();

const DEFAULT_API_URL = Platform.select({
  android: "http://10.0.2.2:3001/api/v1",
  default: "http://localhost:3001/api/v1",
});

const rawUrl = (
  process.env.EXPO_PUBLIC_API_URL ||
  DEFAULT_API_URL ||
  "http://localhost:3001/api/v1"
)
  .trim()
  .replace(/\/$/, "");
const API_BASE_URL = rawUrl.endsWith("/api/v1") ? rawUrl : `${rawUrl}/api/v1`;

function readPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const REQUEST_TIMEOUT_MS = readPositiveNumber(process.env.EXPO_PUBLIC_API_TIMEOUT_MS, 30000);
const SAFE_RETRY_COUNT = readPositiveNumber(process.env.EXPO_PUBLIC_API_RETRY_COUNT, 1);

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: unknown;
};

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return typeof value === "object" && value !== null && "success" in value;
}

function isApiSuccessResponse(value: unknown): value is ApiSuccessResponse<unknown> {
  return isApiResponse(value) && value.success === true;
}

function unwrapApiData<T>(data: unknown): T {
  if (isApiSuccessResponse(data)) {
    return data.data as T;
  }

  return data as T;
}

function normalizeResult(
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
): QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta> {
  if (result.error) {
    return result;
  }

  if (result.data === undefined) {
    return result;
  }

  if (isApiResponse(result.data) && result.data.success === false) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: result.data.error.message,
        data: result.data.error,
      },
      meta: result.meta,
    };
  }

  // Automatically unwrap the data layer for successful responses, while preserving
  // backend meta information on the query's meta object for custom pagination handlers
  if (isApiSuccessResponse(result.data)) {
    return {
      data: result.data.data,
      meta: {
        ...result.meta,
        apiMeta: result.data.meta,
      } as any,
    };
  }

  return {
    data: result.data,
    meta: result.meta,
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Disable caching to avoid 304 Not Modified issues
    headers.set("Cache-Control", "no-cache");

    return headers;
  },
});

function isRetryableError(error: FetchBaseQueryError | undefined) {
  return error?.status === "FETCH_ERROR" || error?.status === "TIMEOUT_ERROR";
}

function isSafeRetryRequest(args: string | FetchArgs) {
  if (typeof args === "string") {
    return true;
  }

  const method = String(args.method ?? "GET").toUpperCase();
  return method === "GET" || method === "HEAD";
}

async function runBaseQueryWithRetry(
  args: string | FetchArgs,
  api: Parameters<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>[1],
  extraOptions: Parameters<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>[2],
) {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (!isSafeRetryRequest(args)) {
    return result;
  }

  for (let attempt = 0; attempt < SAFE_RETRY_COUNT && isRetryableError(result.error); attempt += 1) {
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
}

function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const resolvedArgs =
    typeof args === "string" ? resolveUrl(args) : { ...args, url: resolveUrl(args.url) };

  let result = await runBaseQueryWithRetry(resolvedArgs, api, extraOptions);

  if (result.error?.status !== 401) {
    return normalizeResult(result);
  }

  if (!mutex.isLocked()) {
    const release = await mutex.acquire();

    try {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        api.dispatch(loggedOut());
        return normalizeResult(result);
      }

      const refreshResult = await rawBaseQuery(
        {
          url: resolveUrl("/auth/refresh"),
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const response = unwrapApiData<RefreshResponse>(refreshResult.data);

        api.dispatch(tokenReceived(response.tokens));

        // Re-run the query with the resolvedArgs
        result = await runBaseQueryWithRetry(resolvedArgs, api, extraOptions);
      } else {
        api.dispatch(loggedOut());
      }
    } finally {
      release();
    }
  } else {
    await mutex.waitForUnlock();
    result = await runBaseQueryWithRetry(resolvedArgs, api, extraOptions);
  }

  return normalizeResult(result);
};
