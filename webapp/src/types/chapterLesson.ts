export type ChapterProgressStatus = "locked" | "available" | "done";

export type ChapterLessonStep = -1 | 0 | 1 | 2;

export type ChapterReviewState = {
  hookChoice?: "A" | "B" | null;
  hookDragPlacements?: Record<number, number>;
  quizAnswers?: Record<number, number>;
  debateChoice?: "A" | "B" | null;
};

export type ChapterDraftState = {
  step?: ChapterLessonStep;
  review?: ChapterReviewState;
  theoryIndex?: number;
  quizIndex?: number;
  quizScore?: number;
  quizShowResult?: boolean;
};

export type ChapterProgressItem = {
  status: ChapterProgressStatus;
  score: number | null;
  review?: ChapterReviewState;
  draft?: ChapterDraftState;
};

export type ChapterProgress = Record<string, ChapterProgressItem>;
