import type { QuizStatus, QuizSummary } from "./types";
import { QuizColors } from "./ui";

export function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function formatDuration(
  seconds: number,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  if (minutes === 0) {
    return t("quiz.duration_seconds", { seconds: remaining });
  }

  return t("quiz.duration_minutes_seconds", { minutes, seconds: remaining });
}

export function getQuizCta(status: QuizStatus, t: (key: string) => string) {
  switch (status) {
    case "not-started":
      return t("quiz.cta_start");
    case "in-progress":
      return t("quiz.cta_continue");
    case "completed":
      return t("quiz.cta_retake");
    case "locked":
      return t("quiz.cta_locked");
  }
}

export function getQuizStatusLabel(
  quiz: QuizSummary,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (quiz.status === "completed") {
    return t("quiz.status_score", { score: quiz.score ?? 0 });
  }

  if (quiz.status === "in-progress") {
    return t("quiz.status_in_progress");
  }

  if (quiz.status === "locked") {
    return t("quiz.status_locked");
  }

  return t("quiz.status_not_started");
}

export function getQuizStatusColor(status: QuizStatus) {
  if (status === "completed" || status === "in-progress") {
    return { color: QuizColors.primaryLight };
  }

  if (status === "locked") {
    return { color: QuizColors.locked };
  }

  return { color: QuizColors.muted };
}
