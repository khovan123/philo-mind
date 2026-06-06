import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useLazyCheckAuthQuery } from "@/services/auth/api";
import { useAppDispatch } from "@/stores/hooks";
import { authStateSet, tokenReceived } from "@/stores/slices/auth.slice";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [checkAuth] = useLazyCheckAuthQuery();

  const params = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
  }>();

  useEffect(() => {
    async function completeLogin() {
      const accessToken = Array.isArray(params.accessToken)
        ? params.accessToken[0]
        : params.accessToken;

      const refreshToken = Array.isArray(params.refreshToken)
        ? params.refreshToken[0]
        : params.refreshToken;

      if (!accessToken || !refreshToken) {
        router.replace("/login" as never);
        return;
      }

      try {
        dispatch(
          tokenReceived({
            accessToken,
            refreshToken,
          }),
        );

        const user = await checkAuth().unwrap();

        dispatch(
          authStateSet({
            user,
            accessToken,
            refreshToken,
          }),
        );

        router.replace("/(tabs)" as never);
      } catch (error) {
        console.error("[Auth callback error]:", error);
        router.replace("/login" as never);
      }
    }

    void completeLogin();
  }, [params.accessToken, params.refreshToken, dispatch, checkAuth, router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
