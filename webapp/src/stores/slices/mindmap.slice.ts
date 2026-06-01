import { mindmapService } from "@/services/mindmap.service";
import type { MindmapGraph, MindmapNode, TopicSummary } from "@/types/mindmap";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type MindmapState = {
  topics: TopicSummary[];
  selectedTopicId: string | null;
  graph: MindmapGraph | null;
  selectedNode: MindmapNode | null;
  loadingTopics: boolean;
  loadingGraph: boolean;
  error: string | null;
  successMessage: string | null;
};

const initialState: MindmapState = {
  topics: [],
  selectedTopicId: null,
  graph: null,
  selectedNode: null,
  loadingTopics: false,
  loadingGraph: false,
  error: null,
  successMessage: null,
};

export const fetchTopics = createAsyncThunk<TopicSummary[], void, { rejectValue: string }>(
  "mindmap/fetchTopics",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const topics = await mindmapService.listTopics();
      const firstTopicId = topics[0]?.id ?? null;
      if (firstTopicId) {
        dispatch(fetchGraphByTopic(firstTopicId));
      }
      return topics;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Không thể tải danh sách chủ đề");
    }
  },
);

export const fetchGraphByTopic = createAsyncThunk<MindmapGraph, string, { rejectValue: string }>(
  "mindmap/fetchGraphByTopic",
  async (topicId, { rejectWithValue }) => {
    try {
      return await mindmapService.getGraphByTopic(topicId);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Không thể tải mindmap");
    }
  },
);

const mindmapSlice = createSlice({
  name: "mindmap",
  initialState,
  reducers: {
    selectNode: (state, action: PayloadAction<MindmapNode | null>) => {
      state.selectedNode = action.payload;
    },
    setSelectedTopicId: (state, action: PayloadAction<string | null>) => {
      state.selectedTopicId = action.payload;
      state.selectedNode = null;
    },
    clearMindmapMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Topics
      .addCase(fetchTopics.pending, (state) => {
        state.loadingTopics = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics = action.payload;
        state.selectedTopicId = action.payload[0]?.id ?? null;
        state.loadingTopics = false;
        if (action.payload.length === 0) {
          state.graph = null;
          state.successMessage = "Không có chủ đề để hiển thị mindmap";
        }
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loadingTopics = false;
        state.error = action.payload ?? "Không thể tải danh sách chủ đề";
      })
      // Fetch Graph
      .addCase(fetchGraphByTopic.pending, (state, action) => {
        state.selectedTopicId = action.meta.arg;
        state.selectedNode = null;
        state.loadingGraph = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchGraphByTopic.fulfilled, (state, action) => {
        state.graph = action.payload;
        state.loadingGraph = false;
        state.successMessage =
          action.payload.nodes.length > 0
            ? `Đã tải ${action.payload.nodes.length} node và ${action.payload.edges.length} liên kết`
            : "Chủ đề này chưa có mindmap";
      })
      .addCase(fetchGraphByTopic.rejected, (state, action) => {
        state.graph = null;
        state.loadingGraph = false;
        state.error = action.payload ?? "Không thể tải mindmap";
      });
  },
});

export const { selectNode, setSelectedTopicId, clearMindmapMessages } = mindmapSlice.actions;
export const mindmapReducer = mindmapSlice.reducer;
