import { baseApi } from "./baseApi";

export type ChapterHook =
  | {
      type: "choice";
      situation: string;
      question: string;
      feedbackA: string;
      feedbackB: string;
    }
  | {
      type: "drag";
      items: string[];
      groups: string[];
      answers: { cardIndex: number; groupIndex: number }[];
      bridge: string;
    };

export type ChapterTheoryCard = {
  id: string;
  icon: string;
  body: string;
};

export type ChapterQuizQuestion = {
  id: string;
  type: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type ChapterNodeSummary = {
  chuong: number;
  muc: string;
  title: string;
  order: number;
  hookType: "choice" | "drag";
  steps: ["hook", "theory", "quiz"];
};

export type ChapterNode = Omit<ChapterNodeSummary, "steps"> & {
  hook: ChapterHook;
  theoryCards: ChapterTheoryCard[];
  quiz: ChapterQuizQuestion[];
  debate: {
    perspectiveA: string;
    perspectiveB: string;
    explanationA: string;
    explanationB: string;
    openQuestion: string;
  };
};

export type ChapterMeta = {
  id: string;
  title: string;
  nodeCount: number;
  order: string[];
};

export type ChapterNodesResponse = {
  order: string[];
  nodes: ChapterNodeSummary[];
};

export type MovieResponse = {
  id: string;
  muc: string;
  title: string;
  script: any[]; // VNScriptNode[]
};

export type MovieSessionPayload = {
  thienCam: number;
  uyTin: number;
  correctN: number;
};

export const chapterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query<ChapterMeta[], void>({
      query: () => ({
        url: "/chapters",
        method: "GET",
      }),
      providesTags: [{ type: "Chapter", id: "LIST" }],
    }),

    getChapterNodes: builder.query<ChapterNodesResponse, string>({
      query: (chapter) => ({
        url: `/chapters/${encodeURIComponent(chapter)}/nodes`,
        method: "GET",
      }),
      providesTags: (_result, _error, chapter) => [{ type: "Chapter", id: `NODES-${chapter}` }],
    }),

    getChapterNode: builder.query<ChapterNode, { chapter: string; muc: string }>({
      query: ({ chapter, muc }) => ({
        url: `/chapters/${encodeURIComponent(chapter)}/nodes/${encodeURIComponent(muc)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Chapter", id: `${arg.chapter}-${arg.muc}` },
      ],
    }),

    getMovie: builder.query<MovieResponse, string>({
      query: (muc) => ({
        url: `/movies/${encodeURIComponent(muc)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, muc) => [{ type: "Chapter", id: `MOVIE-${muc}` }],
    }),

    submitMovieSession: builder.mutation<any, { muc: string; session: MovieSessionPayload }>({
      query: ({ muc, session }) => ({
        url: `/movies/${encodeURIComponent(muc)}/sessions`,
        method: "POST",
        body: session,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetChaptersQuery,
  useGetChapterNodesQuery,
  useGetChapterNodeQuery,
  useGetMovieQuery,
  useSubmitMovieSessionMutation,
} = chapterApi;
