import type { CreateReflectionInput, ListReflectionsFilters } from "@/types/reflection";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  clearSelection as clearSelectionAction,
  createNewReflection,
  fetchQuestions,
  fetchReflections,
  getReflectionDetail,
  selectReflectionById,
} from "./slices/reflection.slice";

export function useReflectionStore() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.reflection);

  return {
    ...state,
    loadReflections: async (filters?: ListReflectionsFilters) => {
      await dispatch(fetchReflections(filters)).unwrap();
    },
    loadQuestions: async (topicId?: string) => {
      await dispatch(fetchQuestions(topicId)).unwrap();
    },
    selectReflection: async (reflectionId: string) => {
      const existing = state.reflections.find((r) => r.id === reflectionId);
      if (existing) {
        dispatch(selectReflectionById(reflectionId));
        return;
      }
      await dispatch(getReflectionDetail(reflectionId)).unwrap();
    },
    clearSelection: () => {
      dispatch(clearSelectionAction());
    },
    createReflection: async (input: CreateReflectionInput) => {
      return await dispatch(createNewReflection(input)).unwrap();
    },
  };
}
