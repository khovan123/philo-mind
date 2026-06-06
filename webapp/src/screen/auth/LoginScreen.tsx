import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button, Input } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useLoginMutation, useLazyCheckAuthQuery } from "@/services/auth/api";
import { useAppDispatch } from "@/stores/hooks";
import {
  authErrorCleared,
  authFailed,
  authStateSet,
  tokenReceived,
} from "@/stores/slices/auth.slice";
import { loginSchema } from "@philo-mind/shared";

function getApiErrorMessage(error: unknown) {
  const data = (error as { data?: unknown })?.data;

  if (typeof data === "object" && data !== null && "message" in data) {
    return String(data.message);
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error
  ) {
    return String(data.error.message);
  }

  return "Đăng nhập thất bại, vui lòng thử lại";
}

const rawUrl = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api/v1")
  .trim()
  .replace(/\/$/, "");
const API_BASE_URL = rawUrl.endsWith("/api/v1") ? rawUrl : `${rawUrl}/api/v1`;

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [checkAuth] = useLazyCheckAuthQuery();
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  async function handleLogin() {
    Keyboard.dismiss();
    setErrors({});
    dispatch(authErrorCleared());

    const normalizedEmail = email.trim().toLowerCase();

    const validationResult = loginSchema.safeParse({
      body: {
        email: normalizedEmail,
        password,
      },
    });

    if (!validationResult.success) {
      const nextErrors: {
        email?: string;
        password?: string;
        general?: string;
      } = {};

      validationResult.error.issues.forEach((issue) => {
        const path = issue.path;
        if (path[0] === "body" && path[1]) {
          const field = path[1] as "email" | "password";
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    try {
      const response = await login({
        email: normalizedEmail,
        password,
      }).unwrap();

      dispatch(
        authStateSet({
          user: response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
        }),
      );

      if (!mountedRef.current) return;

      router.replace("/(tabs)" as never);
    } catch (error) {
      const message = getApiErrorMessage(error);

      if (!mountedRef.current) return;

      dispatch(authFailed(message));
      setErrors({ general: message });
    }
  }

  async function handleSocialLogin(provider: "Google" | "Apple") {
    if (provider === "Apple") {
      Alert.alert("Chưa hỗ trợ", `Hiện tại chưa có đăng nhập bằng ${provider}.`);
      return;
    }

    setIsSocialLoading(true);
    dispatch(authErrorCleared());
    try {
      const redirectUri = Linking.createURL("auth-callback");
      const authUrl = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

      if (Platform.OS === "web") {
        window.location.href = authUrl;
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const accessToken = queryParams?.accessToken;
        const refreshToken = queryParams?.refreshToken;

        if (typeof accessToken === "string" && typeof refreshToken === "string") {
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

          if (mountedRef.current) {
            router.replace("/(tabs)" as never);
          }
        } else {
          throw new Error("Không nhận được token đăng nhập từ máy chủ.");
        }
      }
    } catch (error: any) {
      console.error("[Google Login error]:", error);
      Alert.alert(
        "Đăng nhập thất bại",
        error?.message || "Đã xảy ra lỗi khi đăng nhập bằng Google.",
      );
    } finally {
      setIsSocialLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.logoWrap}>
            <Image
              source={require("@/assets/images/philo-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Đăng nhập
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Chào mừng bạn trở lại
            </ThemedText>
          </View>

          <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
            <Input
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrors((prev) => ({
                  ...prev,
                  email: undefined,
                  general: undefined,
                }));
                dispatch(authErrorCleared());
              }}
              placeholder="example@philomind.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {errors.email ? (
              <ThemedText type="label" style={[styles.inputErrorText, { color: theme.danger }]}>
                {errors.email}
              </ThemedText>
            ) : null}

            <Input
              label="Mật khẩu"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setErrors((prev) => ({
                  ...prev,
                  password: undefined,
                  general: undefined,
                }));
                dispatch(authErrorCleared());
              }}
              placeholder="••••••••"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.field}
              onSubmitEditing={handleLogin}
            />

            {errors.password ? (
              <ThemedText type="label" style={[styles.inputErrorText, { color: theme.danger }]}>
                {errors.password}
              </ThemedText>
            ) : null}

            <Pressable
              style={styles.forgotButton}
              onPress={() => router.push("/forgot-password" as never)}
            >
              <ThemedText type="label" style={{ color: theme.primary }}>
                Quên mật khẩu?
              </ThemedText>
            </Pressable>

            {errors.general ? (
              <ThemedText type="label" style={[styles.errorText, { color: theme.danger }]}>
                {errors.general}
              </ThemedText>
            ) : null}

            <Button
              title="Đăng nhập"
              fullWidth
              loading={isLoading}
              disabled={isLoading || !email.trim() || !password}
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <ThemedText type="label" themeColor="textSecondary" style={styles.dividerText}>
                hoặc
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <Pressable
              disabled={isLoading || isSocialLoading}
              onPress={() => handleSocialLogin("Google")}
              style={({ pressed }) => [
                styles.socialButton,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.surfaceElevated,
                  opacity: pressed || isLoading || isSocialLoading ? 0.6 : 1,
                },
              ]}
            >
              <ThemedText type="smallBold">
                {isSocialLoading ? "Đang xử lý..." : "Tiếp tục với Google"}
              </ThemedText>
            </Pressable>
          </ThemedView>

          <View style={styles.registerRow}>
            <ThemedText type="small" themeColor="textSecondary">
              Chưa có tài khoản?{" "}
            </ThemedText>

            <Pressable onPress={() => router.push("/register" as never)}>
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                Đăng ký
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },

  logoCircle: {
    alignSelf: "center",
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "#D97706",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },

  header: {
    alignItems: "center",
    marginBottom: Spacing.four,
  },

  logoWrap: {
    alignSelf: "center",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },

  logoImage: {
    width: 100,
    height: 100,
  },

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    marginTop: Spacing.one,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
  },

  field: {
    marginTop: Spacing.three,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },

  inputErrorText: {
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },

  errorText: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    textAlign: "center",
  },

  loginButton: {
    borderRadius: Radius.md,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.four,
  },

  dividerLine: {
    flex: 1,
    height: 1,
  },

  dividerText: {
    marginHorizontal: Spacing.three,
  },

  socialButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
  },

  googleText: {
    fontSize: 20,
    letterSpacing: 1,
  },

  registerRow: {
    marginTop: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
