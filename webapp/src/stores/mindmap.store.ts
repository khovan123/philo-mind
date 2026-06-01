import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchTopics,
  fetchGraphByTopic,
  selectNode as selectNodeAction,
  setSelectedTopicId,
} from "./slices/mindmap.slice";
import type { MindmapNode } from "@/types/mindmap";

export function useMindmapStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.mindmap);

  return {
    ...state,
    loadTopics: async () => {
      await dispatch(fetchTopics()).unwrap();
    },
    selectTopic: async (topicId: string) => {
      dispatch(setSelectedTopicId(topicId));
      await dispatch(fetchGraphByTopic(topicId)).unwrap();
    },
    selectNode: (node: MindmapNode | null) => {
      dispatch(selectNodeAction(node));
    },
    retry: async () => {
      if (state.selectedTopicId) {
        await dispatch(fetchGraphByTopic(state.selectedTopicId)).unwrap();
      } else {
        await dispatch(fetchTopics()).unwrap();
      }
    },
  };
}
