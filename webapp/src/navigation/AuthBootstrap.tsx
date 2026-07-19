import { useEffect, useRef } from "react";
import { router, usePathname, useSegments } from "expo-router";

import { useLazyCheckAuthQuery } from "@/services/auth/api";
import { selectAccessToken, selectIsAuthenticated } from "@/stores/auth.helpers";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { authFailed, authStateSet, hydrateStarted, loggedOut } from "@/stores/slices/auth.slice";

function getAuthCheckStatus(error: unknown) {
  const status = (error as { status?: unknown })?.status;
  return typeof status === "number" || typeof status === "string" ? status : null;
}

function shouldLogoutForAuthCheck(error: unknown) {
  const status = getAuthCheckStatus(error);
  return status === 401 || status === 403;
}

function getAuthCheckMessage(error: unknown) {
  const data = (error as { data?: unknown; error?: unknown })?.data;

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }

  const directError = (error as { error?: unknown })?.error;
  if (typeof directError === "string") {
    return directError;
  }

  return "Không thể kiểm tra phiên đăng nhập";
}

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
      .catch((error) => {
        console.warn("[AuthBootstrap] checkAuth failed:", error);

        if (shouldLogoutForAuthCheck(error)) {
          dispatch(loggedOut());
          router.replace("/login" as never);
          return;
        }

        checkedRef.current = false;
        dispatch(authFailed(getAuthCheckMessage(error)));
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
