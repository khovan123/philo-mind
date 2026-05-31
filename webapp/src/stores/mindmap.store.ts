import { create } from "zustand";

import { mindmapService } from "@/services/mindmap.service";
import type { MindmapGraph, MindmapNode, TopicSummary } from "@/types/mindmap";

type MindmapState = {
  topics: TopicSummary[];
  selectedTopicId: string | null;
  graph: MindmapGraph | null;
  selectedNode: MindmapNode | null;
  loadingTopics: boolean;
  loadingGraph: boolean;
  error: string | null;
  successMessage: string | null;
  loadTopics: () => Promise<void>;
  selectTopic: (topicId: string) => Promise<void>;
  selectNode: (node: MindmapNode | null) => void;
  retry: () => Promise<void>;
};

export const useMindmapStore = create<MindmapState>((set, get) => ({
  topics: [],
  selectedTopicId: null,
  graph: null,
  selectedNode: null,
  loadingTopics: false,
  loadingGraph: false,
  error: null,
  successMessage: null,

  async loadTopics() {
    set({ loadingTopics: true, error: null, successMessage: null });

    try {
      const topics = await mindmapService.listTopics();
      const firstTopicId = topics[0]?.id ?? null;

      set({
        topics,
        selectedTopicId: firstTopicId,
        loadingTopics: false,
      });

      if (firstTopicId) {
        await get().selectTopic(firstTopicId);
      } else {
        set({ graph: null, successMessage: "Không có chủ đề để hiển thị mindmap" });
      }
    } catch (err) {
      set({
        loadingTopics: false,
        error: err instanceof Error ? err.message : "Không thể tải danh sách chủ đề",
      });
    }
  },

  async selectTopic(topicId) {
    set({
      selectedTopicId: topicId,
      selectedNode: null,
      loadingGraph: true,
      error: null,
      successMessage: null,
    });

    try {
      const graph = await mindmapService.getGraphByTopic(topicId);
      set({
        graph,
        loadingGraph: false,
        successMessage:
          graph.nodes.length > 0
            ? `Đã tải ${graph.nodes.length} node và ${graph.edges.length} liên kết`
            : "Chủ đề này chưa có mindmap",
      });
    } catch (err) {
      set({
        graph: null,
        loadingGraph: false,
        error: err instanceof Error ? err.message : "Không thể tải mindmap",
      });
    }
  },

  selectNode(node) {
    set({ selectedNode: node });
  },

  async retry() {
    const selectedTopicId = get().selectedTopicId;
    if (selectedTopicId) {
      await get().selectTopic(selectedTopicId);
      return;
    }
    await get().loadTopics();
  },
}));
