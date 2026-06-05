import { baseApi } from "@/services/rtk-api/baseApi";
import { configureStore } from "@reduxjs/toolkit";
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
import { securePersistStorage } from "./persistStorage";
import { authReducer } from "./slices/auth.slice";
import { bookmarkReducer } from "./slices/bookmark.slice";
import { chatReducer } from "./slices/chat.slice";
import { mindmapReducer } from "./slices/mindmap.slice";
import { minigameReducer } from "./slices/minigame.slice";
import { reflectionReducer } from "./slices/reflection.slice";
import { storyReducer } from "./slices/story.slice";
import { debateReducer } from "./slices/debate.slice";
import { scenarioReducer } from "./slices/scenario.slice";
import { badgeReducer } from "./slices/badge.slice";
import { notificationReducer } from "./slices/notification.slice";
import { settingsReducer } from "./slices/settings.slice";

const authPersistConfig = {
  key: "auth",
  storage: securePersistStorage,
  whitelist: ["user", "accessToken", "refreshToken", "status"],
};

const settingsPersistConfig = {
  key: "settings",
  storage: securePersistStorage,
  whitelist: ["language"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedSettingsReducer = persistReducer(settingsPersistConfig, settingsReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    settings: persistedSettingsReducer,
    bookmark: bookmarkReducer,
    mindmap: mindmapReducer,
    minigame: minigameReducer,
    reflection: reflectionReducer,
    story: storyReducer,
    chat: chatReducer,
    debate: debateReducer,
    scenario: scenarioReducer,
    badge: badgeReducer,
    notification: notificationReducer,
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
