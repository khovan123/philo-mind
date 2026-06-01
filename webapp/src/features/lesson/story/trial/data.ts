export const Colors = {
  background: "#0C0C0E",
  surface: "#151311",
  surfaceSoft: "#1D1712",
  card: "#211810",
  chip: "#332318",
  border: "#3A2A1F",
  text: "#F4F4F5",
  muted: "#B8A89B",
  mutedStrong: "#D6C2AF",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  primaryText: "#1B0D03",
  danger: "#FCA5A5",
  success: "#86EFAC",
};

export const sceneImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvBOCDhxnNF_jjS3LkdsrVeybeVXQmHkd6wDKaTeqIQNjDylnX07U-s6WBhiA4hQimx-J8OyawwZ_LnPDnLG3X0CN2DyrsnoCL9agMRklU2G-OxkYcaOiaEbEIMVb3nsdNxzirjEnXf_5qaKLyQJHVIP3mLS660MNnZpwL8r5uA1CLLVCWPfjBdADhzCKmIva3qWJBEHHaWeLTQ2J9AOR6_XwzFLQWSQOGyRVpLv8_8u0XV7vcm9oCkxhDN1wmDu1dP4cWhsdzMxo";

export const steps = [
  "Bối cảnh",
  "Nhân vật",
  "Tình huống",
  "Quyết định",
  "Hệ quả",
  "Bài học",
] as const;

export const characters = [
  {
    id: "socrates",
    name: "Socrates",
    role: "Triết gia",
    goal: "Bảo vệ sự thật và tư duy phản biện.",
    cost: "Một bản án có thể khiến ông mất mạng.",
  },
  {
    id: "judge",
    name: "Thẩm phán Athens",
    role: "Đại diện thành bang",
    goal: "Giữ trật tự công cộng và ổn định chính trị.",
    cost: "Sự ổn định có thể bóp nghẹt tự do tư tưởng.",
  },
  {
    id: "student",
    name: "Học trò trẻ",
    role: "Người quan sát",
    goal: "Hiểu liệu triết học có đáng để hy sinh hay không.",
    cost: "Chứng kiến người thầy đối diện hình phạt.",
  },
] as const;

export const decisions = [
  {
    id: "refuse",
    title: "Từ chối xin lỗi",
    principle: "Chân lý quan trọng hơn sinh tồn",
    tag: "Survival",
  },
  {
    id: "apologize",
    title: "Xin lỗi để sống",
    principle: "Tự bảo toàn trước khi tiếp tục ảnh hưởng",
    tag: "Influence",
  },
  {
    id: "escape",
    title: "Rời Athens",
    principle: "Tự do tư tưởng cần không gian sống",
    tag: "Freedom",
  },
] as const;

export const lessonMarkdown = [
  "## Moral Integrity",
  "Socrates' decision shows the meaning of [[moral integrity]]: staying consistent with one's [[principles]], even under pressure.",
  "> An unexamined life is not worth living.",
  "- A person with integrity does not only ask, **What will keep me safe?**",
  "- They also ask, **What kind of person will I become if I betray what I believe?**",
];

export type LessonCharacter = (typeof characters)[number];
export type LessonDecision = (typeof decisions)[number];
