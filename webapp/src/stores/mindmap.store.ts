import { RootState } from "@/stores";
import type { MindmapNode } from "@/types/mindmap";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchGraphByTopic,
  fetchTopics,
  selectNode as selectNodeAction,
  setSelectedTopicId,
} from "./slices/mindmap.slice";

export function useMindmapStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s: RootState) => s.mindmap);

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
