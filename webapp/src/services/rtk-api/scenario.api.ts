import { baseApi } from "./baseApi";

// ── T-F03/T-F04: Scenario RTK Query API ─────────────────────────

// ── DTOs ──────────────────────────────────────────────────────────

export interface ScenarioPerspectiveDTO {
  id: string;
  scenarioId: string;
  perspectiveType: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioFrameworkDTO {
  id: string;
  scenarioId: string;
  name: string;
  description: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioResponseDTO {
  id: string;
  scenarioId: string;
  userId: string;
  selectedDecision: string | null;
  reason: string | null;
  initialPosition: string;
  reasoning: string | null;
  revisedPosition: string | null;
  reflection: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioListItemDTO {
  id: string;
  topicId: string;
  title: string;
  situation: string;
  context: string | null;
  createdAt: string;
}

export interface ScenarioDetailDTO extends ScenarioListItemDTO {
  perspectives: ScenarioPerspectiveDTO[];
  frameworks: ScenarioFrameworkDTO[];
  userResponse: ScenarioResponseDTO | null;
}

export interface PerspectiveStatDTO {
  perspectiveType: string;
  count: number;
  percentage: number;
}

export interface RespondScenarioResult {
  response: ScenarioResponseDTO;
  perspectiveStats: PerspectiveStatDTO[];
}

export interface ListScenariosFilters {
  topicId?: string;
  page?: number;
  limit?: number;
}

export interface RespondScenarioInput {
  initialPosition: string;
  reasoning?: string;
}

export interface RethinkScenarioInput {
  revisedPosition: string;
  reflection?: string;
}

// ── API Endpoints ────────────────────────────────────────────────

export const scenarioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listScenarios: builder.query<ScenarioListItemDTO[], ListScenariosFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        const f = filters || {};

        if (f.topicId) params.set("topicId", f.topicId);
        if (f.page) params.set("page", String(f.page));
        if (f.limit) params.set("limit", String(f.limit));

        return {
          url: `/scenarios?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Scenario" as const, id })),
              { type: "Scenario", id: "LIST" },
            ]
          : [{ type: "Scenario", id: "LIST" }],
    }),

    getScenarioDetail: builder.query<ScenarioDetailDTO, string>({
      query: (id) => ({
        url: `/scenarios/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Scenario", id }],
    }),

    respondScenario: builder.mutation<
      RespondScenarioResult,
      { scenarioId: string; body: RespondScenarioInput }
    >({
      query: ({ scenarioId, body }) => ({
        url: `/scenarios/${scenarioId}/respond`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { scenarioId }) => [
        { type: "Scenario", id: scenarioId },
        { type: "Scenario", id: "LIST" },
      ],
    }),

    rethinkScenario: builder.mutation<
      ScenarioResponseDTO,
      { scenarioId: string; body: RethinkScenarioInput }
    >({
      query: ({ scenarioId, body }) => ({
        url: `/scenarios/${scenarioId}/rethink`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { scenarioId }) => [
        { type: "Scenario", id: scenarioId },
        { type: "Scenario", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListScenariosQuery,
  useGetScenarioDetailQuery,
  useRespondScenarioMutation,
  useRethinkScenarioMutation,
} = scenarioApi;
