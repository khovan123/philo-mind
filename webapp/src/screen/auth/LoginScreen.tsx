import { useState } from "react";
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
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button, Input } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ApiError } from "@/services/api";
import { authService } from "@/services/auth.service";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleLogin() {
    Keyboard.dismiss();
    setErrors({});

    const normalizedEmail = email.trim().toLowerCase();

    const nextErrors: {
      email?: string;
      password?: string;
      general?: string;
    } = {};

    if (!normalizedEmail) {
      nextErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(normalizedEmail)) {
      nextErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!password) {
      setErrors({ password: "Vui lòng nhập mật khẩu" });
      return;
    }

    try {
      setIsLoading(true);

      await authService.login({
        email: normalizedEmail,
        password,
      });

      router.replace("/(tabs)" as never);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ general: error.message });
        return;
      }

      setErrors({ general: "Đăng nhập thất bại, vui lòng thử lại" });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSocialLogin(provider: "Google" | "Apple") {
    Alert.alert("Chưa hỗ trợ", `Hiện tại chưa có đăng nhập bằng ${provider}.`);
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
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
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
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
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
              disabled={isLoading}
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
              onPress={() => handleSocialLogin("Google")}
              style={({ pressed }) => [
                styles.socialButton,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.surfaceElevated,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <ThemedText type="smallBold">Tiếp tục với Google</ThemedText>
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
