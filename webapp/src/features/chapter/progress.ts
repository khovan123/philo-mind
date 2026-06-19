import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { securePersistStorage } from "@/stores/persistStorage";
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

function normalizeProgress(progress: ChapterProgress, order: string[]) {
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
  const [progress, setProgress] = useState<ChapterProgress>(() => createInitialProgress(order));
  const [ready, setReady] = useState(false);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!chapter) {
        const next = createInitialProgress(order);
        progressRef.current = next;
        setProgress(next);
        setReady(true);
        return;
      }

      const raw = await securePersistStorage.getItem(getChapterProgressStorageKey(chapter));
      if (cancelled) return;

      try {
        const parsed = raw ? (JSON.parse(raw) as ChapterProgress) : {};
        const next = normalizeProgress(parsed, order);
        progressRef.current = next;
        setProgress(next);
      } catch {
        const next = createInitialProgress(order);
        progressRef.current = next;
        setProgress(next);
      } finally {
        setReady(true);
      }
    }

    setReady(false);
    void load();

    return () => {
      cancelled = true;
    };
  }, [chapter, order.join("|")]);

  const persist = useCallback(
    async (updater: (current: ChapterProgress) => ChapterProgress) => {
      if (!chapter) return;

      const next = updater(normalizeProgress(progressRef.current, order));
      progressRef.current = next;
      setProgress(next);
      await securePersistStorage.setItem(
        getChapterProgressStorageKey(chapter),
        JSON.stringify(next),
      );
    },
    [chapter, order],
  );

  const saveNodeDraft = useCallback(
    (muc: string, draft: ChapterDraftState) => {
      if (!chapter) return;

      persist((current) => {
        const currentItem = current[muc];

        if (!currentItem || currentItem.status === "locked") {
          return current;
        }

        const nextReview = mergeReview(
          mergeReview(currentItem.review, currentItem.draft?.review),
          draft.review,
        );

        const nextItem: ChapterProgressItem = {
          ...currentItem,
          review: nextReview,
          draft: {
            ...currentItem.draft,
            ...draft,
            review: nextReview,
          },
        };

        return {
          ...current,
          [muc]: nextItem,
        };
      });
    },
    [chapter, persist],
  );

  const completeNode = useCallback(
    async (muc: string, score: number, review?: ChapterReviewState) => {
      if (!chapter) return;

      await persist((current) => {
        const index = order.indexOf(muc);
        const currentItem = current[muc];
        const finalReview = review ?? mergeReview(currentItem?.review, currentItem?.draft?.review);
        const finalDraft: ChapterDraftState = {
          ...(currentItem?.draft ?? {}),
          step: 3,
          review: finalReview,
          quizScore: score,
        };

        const next: ChapterProgress = {
          ...current,
          [muc]: {
            status: "done",
            score,
            review: finalReview,
            draft: finalDraft,
          },
        };

        const nextMuc = order[index + 1];

        if (nextMuc && next[nextMuc]?.status !== "done") {
          next[nextMuc] = {
            status: "available",
            score: next[nextMuc]?.score ?? null,
            review: next[nextMuc]?.review,
            draft: next[nextMuc]?.draft,
          };
        }

        return next;
      });
    },
    [chapter, order, persist],
  );

  const completedCount = useMemo(
    () => order.filter((muc) => progress[muc]?.status === "done").length,
    [order, progress],
  );

  return {
    ready,
    progress,
    completedCount,
    completeNode,
    saveNodeDraft,
  };
}
