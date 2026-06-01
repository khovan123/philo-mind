import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { baseApi } from "./baseApi";
import type { ApiLayerCheck, RunApiLayerCheckResult } from "./api-layer.types";

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API !== "false";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockChecks: ApiLayerCheck[] = [
  {
    id: "401-retry-queue",
    title: "401 retry queue",
    description:
      "Nhiều request bị 401 sẽ chờ một refresh request duy nhất, sau đó retry bằng token mới.",
    status: "success",
    ac: "401_RETRY_QUEUE",
    evidence: "Implemented by baseQueryWithReauth + async-mutex.",
  },
  {
    id: "type-safe-methods",
    title: "Type-safe endpoints",
    description: "RTK Query endpoints khai báo rõ response type và argument type.",
    status: "success",
    ac: "TYPE_SAFE_METHODS",
    evidence:
      "builder.query<ApiLayerCheck[], void>, builder.query<ApiLayerCheck, string>, builder.mutation<RunApiLayerCheckResult, void>.",
  },
  {
    id: "base-query-reauth",
    title: "Base query reauth",
    description: "baseQuery tự xử lý refresh token khi backend trả về 401.",
    status: "success",
    ac: "BASE_QUERY_REAUTH",
    evidence: "fetchBaseQuery is wrapped by baseQueryWithReauth.",
  },
  {
    id: "token-persistence",
    title: "Token persistence",
    description: "Auth/session/token state được persist bằng Redux Persist.",
    status: "success",
    ac: "TOKEN_PERSISTENCE",
    evidence: "auth reducer is wrapped by persistReducer using SecureStore storage.",
  },
];

export const apiLayerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApiLayerChecks: builder.query<ApiLayerCheck[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        if (USE_MOCK) {
          await wait(600);
          return { data: mockChecks };
        }

        const result = await baseQuery({
          url: "/api-layer/checks",
          method: "GET",
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as ApiLayerCheck[] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "ApiLayerCheck" as const,
                id: item.id,
              })),
              { type: "ApiLayerCheck", id: "LIST" },
            ]
          : [{ type: "ApiLayerCheck", id: "LIST" }],
    }),

    getApiLayerCheckById: builder.query<ApiLayerCheck, string>({
      async queryFn(id, _api, _extraOptions, baseQuery) {
        if (USE_MOCK) {
          await wait(400);

          const item = mockChecks.find((check) => check.id === id);

          if (!item) {
            return {
              error: {
                status: 404,
                data: { message: "Không tìm thấy API layer check." },
              } as FetchBaseQueryError,
            };
          }

          return { data: item };
        }

        const result = await baseQuery({
          url: `/api-layer/checks/${id}`,
          method: "GET",
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as ApiLayerCheck };
      },
      providesTags: (_result, _error, id) => [{ type: "ApiLayerCheck", id }],
    }),

    runApiLayerCheck: builder.mutation<RunApiLayerCheckResult, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        if (USE_MOCK) {
          await wait(800);

          return {
            data: {
              id: "mock-run-session",
              message:
                "Mock passed: 3 expired requests queued, 1 refresh call, 3 requests retried.",
              queuedRequestCount: 3,
              refreshCallCount: 1,
              retriedRequestCount: 3,
            },
          };
        }

        const result = await baseQuery({
          url: "/api-layer/checks/run",
          method: "POST",
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as RunApiLayerCheckResult };
      },
      invalidatesTags: [{ type: "ApiLayerCheck", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetApiLayerChecksQuery,
  useGetApiLayerCheckByIdQuery,
  useRunApiLayerCheckMutation,
} = apiLayerApi;
