import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "ApiLayerCheck",
    "Auth",
    "User",
    "Bookmark",
    "Mindmap",
    "Minigame",
    "Reflection",
    "Story",
  ],
  endpoints: () => ({}),
});
