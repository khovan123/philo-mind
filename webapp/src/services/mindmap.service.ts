import { apiRequest } from "@/services/api";
import type { MindmapGraph, TopicSummary } from "@/types/mindmap";

export const mindmapService = {
  async listTopics(): Promise<TopicSummary[]> {
    return apiRequest<TopicSummary[]>("/topics", { method: "GET" });
  },

  async getGraphByTopic(topicId: string): Promise<MindmapGraph> {
    return apiRequest<MindmapGraph>(`/mindmaps/topics/${topicId}`, { method: "GET" });
  },
};
