export type LessonCardType = "hook" | "insight" | "conflict" | "vote";

export type VoteOption = {
  id: string;
  label: string;
  percent: number;
  explanation: string;
};

export type ShortLessonCard = {
  id: string;
  type: LessonCardType;
  eyebrow: string;
  title: string;
  body: string;
  concept: string;
  conceptLabel?: string;
  image: string;
};

export type ScreenState = "loading" | "empty" | "error" | "ready" | "finished";

export const lessonTitle = "Short Lesson";

export const lessonCards: ShortLessonCard[] = [
  {
    id: "hook",
    type: "hook",
    eyebrow: "HOOK",
    title: "Can money really buy happiness?",
    body: 'Explore the intersection of Stoic temperance and modern consumerism. Is financial stability a "preferred indifferent" or a modern necessity for a flourishing life?',
    concept: "Ethics",
    image:
      "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "insight",
    type: "insight",
    eyebrow: "INSIGHT",
    title: "Aristotle believed happiness is not pleasure or wealth.",
    body: "True happiness comes from living with virtue, purpose, and repeated choices that shape character.",
    concept: "Eudaimonia",
    conceptLabel: "Core Concept",
    image:
      "https://images.unsplash.com/photo-1618609255910-1950ba0de780?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "conflict",
    type: "conflict",
    eyebrow: "CONFLICT",
    title: "Modern life treats money as proof of a life well lived.",
    body: "The tension begins when comfort becomes identity. Wealth can support freedom, but it can also replace virtue with comparison.",
    concept: "Temperance",
    conceptLabel: "Tension",
    image:
      "https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "vote",
    type: "vote",
    eyebrow: "VOTE",
    title: "What do you think?",
    body: "Choose the claim that best matches your current view.",
    concept: "Virtue Ethics",
    image:
      "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=900&q=80",
  },
];

export const voteImage =
  "https://images.unsplash.com/photo-1590071089568-f826c3fc3f1b?auto=format&fit=crop&w=900&q=80";

export const voteOptions: VoteOption[] = [
  {
    id: "wealth",
    label: "Yes, wealth can create happiness",
    percent: 18,
    explanation:
      "This view treats happiness as security and comfort, but classical virtue ethics asks whether comfort alone can form a good life.",
  },
  {
    id: "virtue",
    label: "No, happiness requires virtue",
    percent: 20,
    explanation:
      "This matches Aristotle more directly: happiness is the activity of the soul in accordance with virtue.",
  },
  {
    id: "depends",
    label: "It depends on how wealth is used",
    percent: 62,
    explanation:
      "This reflects the idea that wealth is only meaningful when guided by virtue, responsibility, and purpose.",
  },
];
