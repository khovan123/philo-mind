import { apiRequest } from "@/services/api";
import type { ListStoriesFilters, ListStoriesResponse, StorySummary } from "@/types/story";

// ── T-D06: Story API service ──────────────────────────────────

export const storyService = {
  /**
   * List paginated story scenarios with optional filters.
   * Endpoint: GET /api/v1/stories
   *
   * NOTE: The backend uses sendPaginated() which puts the stories array
   * directly in `data` (not nested as `{ stories: [] }`).
   * apiRequest extracts body.data → returns StorySummary[].
   */
  async listStories(filters: ListStoriesFilters = {}): Promise<ListStoriesResponse> {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.set("page", String(filters.page));
    if (filters.limit !== undefined) params.set("limit", String(filters.limit));
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.search) params.set("search", filters.search);
    if (filters.topicId) params.set("topicId", filters.topicId);

    const query = params.toString();
    const path = `/stories${query ? `?${query}` : ""}`;

    // Backend sendPaginated returns: { success: true, data: StorySummary[], meta: {...} }
    // apiRequest unwraps body.data → StorySummary[]
    const data = await apiRequest<StorySummary[] | { stories: StorySummary[]; total: number }>(
      path,
      { method: "GET" },
    );

    // Handle both array (sendPaginated) and object (legacy) response shapes
    if (Array.isArray(data)) {
      return { stories: data, total: data.length };
    }
    return { stories: data?.stories ?? [], total: data?.total ?? 0 };
  },

  /**
   * Get a single story scenario detail.
   * Endpoint: GET /api/v1/stories/:id
   */
  async getStoryDetail(id: string): Promise<StorySummary> {
    return apiRequest<StorySummary>(`/stories/${id}`, { method: "GET" });
  },
};
