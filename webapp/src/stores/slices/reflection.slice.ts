import { reflectionService } from "@/services/reflection.service";
import type {
  CreateReflectionInput,
  CriticalQuestion,
  ListReflectionsFilters,
  ReflectionEntry,
} from "@/types/reflection";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ReflectionState = {
  reflections: ReflectionEntry[];
  questions: CriticalQuestion[];
  selectedReflection?: ReflectionEntry;
  loading: boolean;
  questionsLoading: boolean;
  submitting: boolean;
  error?: string;
  successMessage?: string;
};

const initialState: ReflectionState = {
  reflections: [],
  questions: [],
  selectedReflection: undefined,
  loading: false,
  questionsLoading: false,
  submitting: false,
  error: undefined,
  successMessage: undefined,
};

export const fetchReflections = createAsyncThunk<
  ReflectionEntry[],
  ListReflectionsFilters | undefined,
  { rejectValue: string }
>("reflection/fetchReflections", async (filters, { rejectWithValue }) => {
  try {
    return await reflectionService.listReflections(filters ?? {});
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Something went wrong");
  }
});

export const fetchQuestions = createAsyncThunk<
  CriticalQuestion[],
  string | undefined,
  { rejectValue: string }
>("reflection/fetchQuestions", async (topicId, { rejectWithValue }) => {
  try {
    return await reflectionService.listCriticalQuestions(topicId);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Something went wrong");
  }
});

export const getReflectionDetail = createAsyncThunk<
  ReflectionEntry,
  string,
  { rejectValue: string }
>("reflection/getReflectionDetail", async (reflectionId, { rejectWithValue }) => {
  try {
    return await reflectionService.getReflection(reflectionId);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Something went wrong");
  }
});

export const createNewReflection = createAsyncThunk<
  ReflectionEntry,
  CreateReflectionInput,
  { rejectValue: string }
>("reflection/createNewReflection", async (input, { rejectWithValue }) => {
  try {
    return await reflectionService.createReflection(input);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Something went wrong");
  }
});

const reflectionSlice = createSlice({
  name: "reflection",
  initialState,
  reducers: {
    selectReflectionById: (state, action: PayloadAction<string>) => {
      const existing = state.reflections.find((r) => r.id === action.payload);
      if (existing) {
        state.selectedReflection = existing;
        state.error = undefined;
      }
    },
    clearSelection: (state) => {
      state.selectedReflection = undefined;
      state.successMessage = undefined;
    },
    clearReflectionMessages: (state) => {
      state.error = undefined;
      state.successMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reflections
      .addCase(fetchReflections.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.successMessage = undefined;
      })
      .addCase(fetchReflections.fulfilled, (state, action) => {
        state.reflections = action.payload;
        state.loading = false;
        state.selectedReflection =
          state.selectedReflection &&
          action.payload.some((r) => r.id === state.selectedReflection?.id)
            ? state.selectedReflection
            : action.payload[0];
      })
      .addCase(fetchReflections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.questionsLoading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.questionsLoading = false;
      })
      .addCase(fetchQuestions.rejected, (state) => {
        state.questions = [];
        state.questionsLoading = false;
      })
      // Get Reflection Detail
      .addCase(getReflectionDetail.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getReflectionDetail.fulfilled, (state, action) => {
        state.selectedReflection = action.payload;
        state.loading = false;
      })
      .addCase(getReflectionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Create Reflection
      .addCase(createNewReflection.pending, (state) => {
        state.submitting = true;
        state.error = undefined;
        state.successMessage = undefined;
      })
      .addCase(createNewReflection.fulfilled, (state, action) => {
        state.submitting = false;
        state.successMessage = "Reflection saved";
        state.selectedReflection = action.payload;
        state.reflections = [
          action.payload,
          ...state.reflections.filter((item) => item.id !== action.payload.id),
        ];
      })
      .addCase(createNewReflection.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { selectReflectionById, clearSelection, clearReflectionMessages } =
  reflectionSlice.actions;
export const reflectionReducer = reflectionSlice.reducer;
