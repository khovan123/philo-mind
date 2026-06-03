import type { QuizStatus, QuizSummary } from "./mock";
import { QuizColors } from "./ui";

export function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  if (minutes === 0) {
    return `${remaining}s`;
  }

  return `${minutes}m ${remaining}s`;
}

export function getQuizCta(status: QuizStatus) {
  switch (status) {
    case "not-started":
      return "Start Quiz";
    case "in-progress":
      return "Continue";
    case "completed":
      return "Retake";
    case "locked":
      return "Locked";
  }
}

export function getQuizStatusLabel(quiz: QuizSummary) {
  if (quiz.status === "completed") {
    return `${quiz.score ?? 0}% score`;
  }

  if (quiz.status === "in-progress") {
    return "In Progress";
  }

  if (quiz.status === "locked") {
    return "Locked";
  }

  return "Not Started";
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
