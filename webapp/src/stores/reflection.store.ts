import { create } from "zustand";

import { reflectionService } from "@/services/reflection.service";
import type {
  CreateReflectionInput,
  CriticalQuestion,
  ListReflectionsFilters,
  ReflectionEntry,
} from "@/types/reflection";

type ReflectionState = {
  reflections: ReflectionEntry[];
  questions: CriticalQuestion[];
  selectedReflection?: ReflectionEntry;
  loading: boolean;
  questionsLoading: boolean;
  submitting: boolean;
  error?: string;
  successMessage?: string;
  loadReflections: (filters?: ListReflectionsFilters) => Promise<void>;
  loadQuestions: (topicId?: string) => Promise<void>;
  selectReflection: (reflectionId: string) => Promise<void>;
  clearSelection: () => void;
  createReflection: (input: CreateReflectionInput) => Promise<ReflectionEntry>;
};

export const useReflectionStore = create<ReflectionState>((set, get) => ({
  reflections: [],
  questions: [],
  selectedReflection: undefined,
  loading: false,
  questionsLoading: false,
  submitting: false,
  error: undefined,
  successMessage: undefined,

  async loadReflections(filters = {}) {
    set({ loading: true, error: undefined, successMessage: undefined });
    try {
      const reflections = await reflectionService.listReflections(filters);
      set((state) => ({
        reflections,
        loading: false,
        selectedReflection:
          state.selectedReflection &&
          reflections.some((reflection) => reflection.id === state.selectedReflection?.id)
            ? state.selectedReflection
            : reflections[0],
      }));
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  async loadQuestions(topicId) {
    set({ questionsLoading: true });
    try {
      const questions = await reflectionService.listCriticalQuestions(topicId);
      set({ questions, questionsLoading: false });
    } catch {
      set({ questions: [], questionsLoading: false });
    }
  },

  async selectReflection(reflectionId) {
    const existing = get().reflections.find((reflection) => reflection.id === reflectionId);
    if (existing) {
      set({ selectedReflection: existing, error: undefined });
      return;
    }

    set({ loading: true, error: undefined });
    try {
      const selectedReflection = await reflectionService.getReflection(reflectionId);
      set({ selectedReflection, loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  clearSelection() {
    set({ selectedReflection: undefined, successMessage: undefined });
  },

  async createReflection(input) {
    set({ submitting: true, error: undefined, successMessage: undefined });
    try {
      const reflection = await reflectionService.createReflection(input);
      set((state) => ({
        submitting: false,
        successMessage: "Reflection saved",
        selectedReflection: reflection,
        reflections: [reflection, ...state.reflections.filter((item) => item.id !== reflection.id)],
      }));
      return reflection;
    } catch (error) {
      set({ submitting: false, error: getErrorMessage(error) });
      throw error;
    }
  },
}));

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}
