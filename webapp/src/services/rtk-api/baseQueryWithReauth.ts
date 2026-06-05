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

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  DEFAULT_API_URL ||
  "http://localhost:3001/api/v1"
).replace(/\/$/, "");

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

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

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
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const response = unwrapApiData<RefreshResponse>(refreshResult.data);

        api.dispatch(tokenReceived(response.tokens));

        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(loggedOut());
      }
    } finally {
      release();
    }
  } else {
    await mutex.waitForUnlock();
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return normalizeResult(result);
};
