import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/services/rtk-api/baseApi";
import { authReducer } from "./slices/auth.slice";
import { bookmarkReducer } from "./slices/bookmark.slice";
import { mindmapReducer } from "./slices/mindmap.slice";
import { minigameReducer } from "./slices/minigame.slice";
import { reflectionReducer } from "./slices/reflection.slice";
import { storyReducer } from "./slices/story.slice";
import { securePersistStorage } from "./persistStorage";

const authPersistConfig = {
  key: "auth",
  storage: securePersistStorage,
  whitelist: ["user", "accessToken", "refreshToken", "status"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    bookmark: bookmarkReducer,
    mindmap: mindmapReducer,
    minigame: minigameReducer,
    reflection: reflectionReducer,
    story: storyReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
