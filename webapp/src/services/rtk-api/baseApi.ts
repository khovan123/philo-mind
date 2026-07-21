import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Bookmark",
    "Mindmap",
    "Minigame",
    "Story",
    "Topic",
    "Lesson",
    "ShortLesson",
    "Quiz",
    "Learning",
    "Profile",
    "Badge",
    "Notification",
    "Chapter",
  ],
  endpoints: () => ({}),
});
