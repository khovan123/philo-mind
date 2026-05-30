export type ProgressTone = "neutral" | "info" | "warning" | "success" | "danger" | "locked";

export type ProgressStatus = "not-started" | "in-progress" | "mastered" | "locked" | "failed";

export const ProgressColors = {
  surface: "#161618",
  surfaceHigh: "#201F21",
  track: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  neutral: "#A1A1AA",
  info: "#3B82F6",
  warning: "#D97706",
  success: "#22C55E",
  danger: "#EF4444",
  locked: "#52525B",
} as const;

export function clampProgress(value: number) {
  "worklet";
  return Math.min(100, Math.max(0, value));
}

export function toneFromProgress(value: number): ProgressTone {
  if (value >= 100) {
    return "success";
  }

  if (value >= 70) {
    return "info";
  }

  if (value > 0) {
    return "warning";
  }

  return "neutral";
}

export function toneFromStatus(status: ProgressStatus): ProgressTone {
  switch (status) {
    case "mastered":
      return "success";

    case "in-progress":
      return "warning";

    case "failed":
      return "danger";

    case "locked":
      return "locked";

    case "not-started":
      return "neutral";
  }
}

export function labelFromStatus(status: ProgressStatus) {
  switch (status) {
    case "mastered":
      return "Đã thành thạo";

    case "in-progress":
      return "Đang học";

    case "failed":
      return "Cần ôn lại";

    case "locked":
      return "Đang khóa";

    case "not-started":
      return "Chưa bắt đầu";
  }
}

export function colorForTone(tone: ProgressTone) {
  return ProgressColors[tone];
}
