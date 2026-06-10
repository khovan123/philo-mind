import { useEffect, useRef } from "react";
import { router, usePathname, useSegments } from "expo-router";

import { useLazyCheckAuthQuery } from "@/services/auth/api";
import { selectAccessToken, selectIsAuthenticated } from "@/stores/auth.helpers";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { authStateSet, hydrateStarted, loggedOut } from "@/stores/slices/auth.slice";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const pathname = usePathname();

  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [checkAuth] = useLazyCheckAuthQuery();

  const checkedRef = useRef(false);
  const isAuthCallback = pathname === "/auth-callback";

  useEffect(() => {
    if (isAuthCallback) {
      return;
    }

    if (!accessToken) {
      checkedRef.current = false;
      return;
    }

    if (checkedRef.current) return;

    checkedRef.current = true;
    dispatch(hydrateStarted());

    checkAuth()
      .unwrap()
      .then((user) => {
        dispatch(authStateSet({ user }));
      })
      .catch(() => {
        dispatch(loggedOut());
        router.replace("/login" as never);
      });
  }, [accessToken, checkAuth, dispatch, isAuthCallback]);

  useEffect(() => {
    if (isAuthCallback) {
      return;
    }

    const rootSegment = segments[0];

    const isAuthRoute = rootSegment === "(auth)";
    const isProtectedRoute = rootSegment === "(tabs)";

    if (isAuthenticated && isAuthRoute) {
      router.replace("/(tabs)" as never);
      return;
    }

    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/login" as never);
    }
  }, [isAuthenticated, segments, isAuthCallback]);

  return null;
}
