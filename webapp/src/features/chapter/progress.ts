import { useCallback, useMemo } from "react";

import { useGetChapterProgressQuery, useUpsertChapterProgressMutation } from "@/services/rtk-api/chapter.api";
import type { ChapterProgressPayload } from "@/services/rtk-api/chapter.api";
import type {
  ChapterDraftState,
  ChapterProgress,
  ChapterProgressItem,
  ChapterReviewState,
} from "@/types/chapterLesson";

export type {
  ChapterDraftState,
  ChapterLessonStep,
  ChapterProgress,
  ChapterProgressItem,
  ChapterProgressStatus,
  ChapterReviewState,
} from "@/types/chapterLesson";

const STORAGE_PREFIX = "triet_hoc_chapter_progress";

export function getChapterProgressStorageKey(chapter: string) {
  return `${STORAGE_PREFIX}_${chapter}`;
}

function createInitialProgress(order: string[]) {
  return order.reduce<ChapterProgress>((acc, muc, index) => {
    acc[muc] = {
      status: index === 0 ? "available" : "locked",
      score: null,
    };

    return acc;
  }, {});
}

function mergeReview(
  current?: ChapterReviewState,
  next?: ChapterReviewState,
): ChapterReviewState | undefined {
  if (!current && !next) return undefined;

  return {
    ...(current ?? {}),
    ...(next ?? {}),
  };
}

function normalizeProgress(progress: Record<string, ChapterProgressPayload | Partial<ChapterProgressItem>>, order: string[]) {
  const next = createInitialProgress(order);
  let foundAvailable = false;

  for (const muc of order) {
    const existing = progress[muc];

    if (existing?.status === "done") {
      next[muc] = {
        status: "done",
        score: existing.score ?? null,
        review: existing.review,
        draft: existing.draft,
      };
      continue;
    }

    if (!foundAvailable) {
      next[muc] = {
        status: "available",
        score: existing?.score ?? null,
        review: existing?.review,
        draft: existing?.draft,
      };
      foundAvailable = true;
    }
  }

  if (!foundAvailable && order.length > 0) {
    const last = order[order.length - 1];
    next[last] = {
      ...next[last],
      status: "done",
      review: next[last]?.review,
      draft: next[last]?.draft,
    };
  }

  return next;
}

export function useChapterProgress(chapter: string | undefined, order: string[]) {
  const orderKey = order.join("|");
  const stableOrder = useMemo(() => (orderKey ? orderKey.split("|") : []), [orderKey]);

  const { data: serverProgress, isLoading, isSuccess } = useGetChapterProgressQuery(chapter ?? "", {
    skip: !chapter,
  });

  const [upsertProgress] = useUpsertChapterProgressMutation();

  const progress = useMemo(() => {
    if (!chapter || !isSuccess) return createInitialProgress(stableOrder);
    return normalizeProgress(serverProgress ?? {}, stableOrder);
  }, [chapter, isSuccess, serverProgress, stableOrder]);

  const saveNodeDraft = useCallback(
    async (muc: string, draft: ChapterDraftState) => {
      if (!chapter) return;

      const currentItem = progress[muc];
      if (!currentItem || currentItem.status === "locked") return;

      const nextReview = mergeReview(
        mergeReview(currentItem.review, currentItem.draft?.review),
        draft.review,
      );

      const payload = {
        ...currentItem,
        review: nextReview,
        draft: {
          ...currentItem.draft,
          ...draft,
          review: nextReview,
        },
      };

      await upsertProgress({ chapter, muc, payload }).unwrap();
    },
    [chapter, progress, upsertProgress],
  );

  const completeNode = useCallback(
    async (muc: string, score: number, review?: ChapterReviewState) => {
      if (!chapter) return;

      const index = stableOrder.indexOf(muc);
      const currentItem = progress[muc];
      
      const finalReview = review ?? mergeReview(currentItem?.review, currentItem?.draft?.review);
      const finalDraft: ChapterDraftState = {
        ...(currentItem?.draft ?? {}),
        step: 2,
        review: finalReview,
        quizScore: score,
      };

      const payload = {
        status: "done" as const,
        score,
        review: finalReview,
        draft: finalDraft,
      };

      // Call API for current node
      await upsertProgress({ chapter, muc, payload }).unwrap();

      const nextMuc = stableOrder[index + 1];
      if (nextMuc && progress[nextMuc]?.status !== "done") {
        // Unlock next node
        const nextPayload = {
          status: "available" as const,
          score: progress[nextMuc]?.score ?? null,
          review: progress[nextMuc]?.review,
          draft: progress[nextMuc]?.draft,
        };
        await upsertProgress({ chapter, muc: nextMuc, payload: nextPayload }).unwrap();
      }
    },
    [chapter, progress, stableOrder, upsertProgress],
  );

  const completedCount = useMemo(
    () => stableOrder.filter((muc) => progress[muc]?.status === "done").length,
    [stableOrder, progress],
  );

  return {
    ready: isSuccess,
    progress,
    completedCount,
    completeNode,
    saveNodeDraft,
  };
}
