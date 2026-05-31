export const bookmarkTargetTypes = ["LESSON", "SHORT_LESSON", "STORY", "DEBATE", "TOPIC"] as const;

export type BookmarkTargetType = (typeof bookmarkTargetTypes)[number];

export type BookmarkItem = {
  id: string;
  userId: string;
  targetType: BookmarkTargetType;
  targetId: string;
  createdAt: string;
};

export type BookmarkStatus = {
  bookmarked: boolean;
  bookmark: BookmarkItem | null;
};

export type BookmarkTarget = {
  targetType: BookmarkTargetType;
  targetId: string;
};
