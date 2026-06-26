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
  const orderKey = order.join("|");
  const stableOrder = useMemo(() => (orderKey ? orderKey.split("|") : []), [orderKey]);
  const progressKey = `${chapter ?? ""}:${orderKey}`;
  const [state, setState] = useState(() => ({
    key: progressKey,
    progress: createInitialProgress(stableOrder),
    ready: false,
  }));
  const visibleProgress =
    state.key === progressKey ? state.progress : createInitialProgress(stableOrder);
  const visibleReady = state.key === progressKey && state.ready;
  const progressRef = useRef(visibleProgress);

  if (state.key !== progressKey) {
    setState({
      key: progressKey,
      progress: createInitialProgress(stableOrder),
      ready: false,
    });
  }

  useEffect(() => {
    progressRef.current = visibleProgress;
  }, [visibleProgress]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!chapter) {
        const next = createInitialProgress(stableOrder);
        progressRef.current = next;
        setState((current) =>
          current.key === progressKey ? { key: progressKey, progress: next, ready: true } : current,
        );
        return;
      }

      const raw = await securePersistStorage.getItem(getChapterProgressStorageKey(chapter));
      if (cancelled) return;

      try {
        const parsed = raw ? (JSON.parse(raw) as ChapterProgress) : {};
        const next = normalizeProgress(parsed, stableOrder);
        progressRef.current = next;
        setState((current) =>
          current.key === progressKey ? { key: progressKey, progress: next, ready: true } : current,
        );
      } catch {
        const next = createInitialProgress(stableOrder);
        progressRef.current = next;
        setState((current) =>
          current.key === progressKey ? { key: progressKey, progress: next, ready: true } : current,
        );
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [chapter, progressKey, stableOrder]);

  const persist = useCallback(
    async (updater: (current: ChapterProgress) => ChapterProgress) => {
      if (!chapter) return;

      const next = updater(normalizeProgress(progressRef.current, stableOrder));
      progressRef.current = next;
      setState((current) =>
        current.key === progressKey ? { key: progressKey, progress: next, ready: true } : current,
      );
      await securePersistStorage.setItem(
        getChapterProgressStorageKey(chapter),
        JSON.stringify(next),
      );
    },
    [chapter, progressKey, stableOrder],
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
        const index = stableOrder.indexOf(muc);
        const currentItem = current[muc];
        const finalReview = review ?? mergeReview(currentItem?.review, currentItem?.draft?.review);
        const finalDraft: ChapterDraftState = {
          ...(currentItem?.draft ?? {}),
          step: 2,
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

        const nextMuc = stableOrder[index + 1];

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
    [chapter, persist, stableOrder],
  );

  const completedCount = useMemo(
    () => stableOrder.filter((muc) => visibleProgress[muc]?.status === "done").length,
    [stableOrder, visibleProgress],
  );

  return {
    ready: visibleReady,
    progress: visibleProgress,
    completedCount,
    completeNode,
    saveNodeDraft,
  };
}
