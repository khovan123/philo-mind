import { apiRequest } from "@/services/api";
import type {
  CreateReflectionInput,
  CriticalQuestion,
  ListReflectionsFilters,
  ReflectionEntry,
  UpdateReflectionInput,
} from "@/types/reflection";

export const reflectionService = {
  async listReflections(filters: ListReflectionsFilters = {}): Promise<ReflectionEntry[]> {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.set("page", String(filters.page));
    if (filters.limit !== undefined) params.set("limit", String(filters.limit));
    if (filters.topicId) params.set("topicId", filters.topicId);
    if (filters.questionId) params.set("questionId", filters.questionId);

    const query = params.toString();
    return apiRequest<ReflectionEntry[]>(`/reflections${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  async getReflection(id: string): Promise<ReflectionEntry> {
    return apiRequest<ReflectionEntry>(`/reflections/${id}`, { method: "GET" });
  },

  async createReflection(input: CreateReflectionInput): Promise<ReflectionEntry> {
    return apiRequest<ReflectionEntry>("/reflections", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async updateReflection(id: string, input: UpdateReflectionInput): Promise<ReflectionEntry> {
    return apiRequest<ReflectionEntry>(`/reflections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  async listCriticalQuestions(topicId?: string): Promise<CriticalQuestion[]> {
    const params = new URLSearchParams({ limit: "8" });
    if (topicId) params.set("topicId", topicId);

    return apiRequest<CriticalQuestion[]>(`/critical-questions?${params.toString()}`, {
      method: "GET",
    });
  },
};
