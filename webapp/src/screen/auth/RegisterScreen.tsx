import { Button, Input, ThemedText, ThemedView } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRegisterMutation } from "@/services/auth/api";
import { useAppDispatch } from "@/stores/hooks";
import { authFailed } from "@/stores/slices/auth.slice";
import { registerSchema } from "@philo-mind/shared";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RegisterFieldErrors = Partial<{
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: string;
  form: string;
}>;

function FieldError({ message }: { message?: string }) {
  const theme = useTheme();

  if (!message) return null;

  return (
    <ThemedText type="label" style={[styles.fieldError, { color: theme.danger }]}>
      {message}
    </ThemedText>
  );
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const rtkError = error as {
    status?: number | string;
    error?: string;
    data?: unknown;
  };

  if (typeof rtkError.error === "string") {
    return rtkError.error;
  }

  const data = rtkError.data;

  if (typeof data === "string") {
    return data;
  }

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

  return fallback;
}

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const submittingRef = useRef(false);

  const passwordChecks = useMemo(
    () => [
      {
        key: "uppercase",
        passed: /[A-Z]/.test(password),
      },
      {
        key: "lowercase",
        passed: /[a-z]/.test(password),
      },
      {
        key: "number",
        passed: /[0-9]/.test(password),
      },
      {
        key: "special",
        passed: /[^A-Za-z0-9]/.test(password),
      },
    ],
    [password],
  );

  const passwordScore = passwordChecks.filter((check) => check.passed).length;

  function clearFieldError(field: keyof RegisterFieldErrors) {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  }

  async function handleRegister() {
    if (submittingRef.current || isLoading) return;

    submittingRef.current = true;

    try {
      Keyboard.dismiss();

      const normalizedFullName = fullName.trim();
      const normalizedEmail = email.trim().toLowerCase();

      const nextErrors: RegisterFieldErrors = {};

      const validationResult = registerSchema.safeParse({
        body: {
          fullName: normalizedFullName,
          email: normalizedEmail,
          password,
        },
      });

      if (!validationResult.success) {
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path;
          if (path[0] === "body" && path[1]) {
            const field = path[1] as "fullName" | "email" | "password";
            nextErrors[field] = issue.message;
          }
        });
      }

      if (!nextErrors.password && passwordScore < 4) {
        nextErrors.password = "Mật khẩu cần có chữ hoa, chữ thường, số và ký tự đặc biệt";
      }

      if (confirmPassword.length === 0) {
        nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      } else if (password !== confirmPassword) {
        nextErrors.confirmPassword = "Xác nhận mật khẩu không khớp";
      }

      if (!acceptedTerms) {
        nextErrors.acceptedTerms = "Bạn cần đồng ý với điều khoản sử dụng";
      }

      if (Object.keys(nextErrors).length > 0) {
        if (mountedRef.current) {
          setFieldErrors(nextErrors);
        }

        return;
      }

      if (mountedRef.current) {
        setFieldErrors({});
      }

      await register({
        fullName: normalizedFullName,
        email: normalizedEmail,
        password,
      }).unwrap();

      if (!mountedRef.current) return;

      router.replace("/login" as never);
    } catch (error) {
      const message = getApiErrorMessage(error, "Đăng ký thất bại. Vui lòng thử lại.");

      if (!mountedRef.current) return;

      dispatch(authFailed(message));
      setFieldErrors({ form: message });
    } finally {
      submittingRef.current = false;
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
          <View style={styles.content}>
            <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
              <ThemedText type="subtitle" themeColor="textSecondary" style={styles.backIcon}>
                ←
              </ThemedText>
            </Pressable>

            <View style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                Tạo tài khoản
              </ThemedText>

              <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                Bắt đầu hành trình tư duy
              </ThemedText>
            </View>

            <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
              <Input
                label="Tên hiển thị"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  clearFieldError("fullName");
                }}
                placeholder="Nhập tên của bạn"
                autoCapitalize="words"
                autoCorrect={false}
              />
              <FieldError message={fieldErrors.fullName} />

              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearFieldError("email");
                }}
                placeholder="example@philo.mind"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.field}
              />
              <FieldError message={fieldErrors.email} />

              <Input
                label="Mật khẩu"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearFieldError("password");
                }}
                placeholder="••••••••"
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.field}
              />
              <FieldError message={fieldErrors.password} />

              <View style={styles.strengthRow}>
                {passwordChecks.map((check) => (
                  <View
                    key={check.key}
                    style={[
                      styles.strengthItem,
                      {
                        backgroundColor: check.passed ? theme.primary : theme.backgroundSelected,
                      },
                    ]}
                  />
                ))}
              </View>

              <Input
                label="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearFieldError("confirmPassword");
                }}
                placeholder="••••••••"
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.field}
                onSubmitEditing={handleRegister}
              />
              <FieldError message={fieldErrors.confirmPassword} />

              <Pressable
                style={styles.termsRow}
                onPress={() => {
                  setAcceptedTerms((prev) => !prev);
                  clearFieldError("acceptedTerms");
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: acceptedTerms ? theme.primary : theme.border,
                      backgroundColor: acceptedTerms ? theme.primary : theme.surfaceElevated,
                    },
                  ]}
                >
                  {acceptedTerms ? (
                    <ThemedText style={[styles.checkMark, { color: theme.buttonText }]}>
                      ✓
                    </ThemedText>
                  ) : null}
                </View>

                <ThemedText type="label" themeColor="textSecondary">
                  Tôi đồng ý với{" "}
                </ThemedText>

                <ThemedText type="label" style={{ color: theme.primary }}>
                  Điều khoản sử dụng
                </ThemedText>
              </Pressable>
              <FieldError message={fieldErrors.acceptedTerms} />

              <FieldError message={fieldErrors.form} />

              <Button
                title="Đăng ký"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                onPress={handleRegister}
                style={[styles.registerButton, { backgroundColor: theme.primary }]}
              />
            </ThemedView>

            <View style={styles.loginRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Đã có tài khoản?{" "}
              </ThemedText>

              <Pressable onPress={() => router.replace("/login" as never)}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Đăng nhập
                </ThemedText>
              </Pressable>
            </View>

            <View style={[styles.loginRow, { marginTop: Spacing.two }]}>
              <Pressable onPress={() => router.push("/(auth)/forgot-password" as never)}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Quên mật khẩu?
                </ThemedText>
              </Pressable>
            </View>
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
  },

  content: {
    width: "100%",
    flex: 1,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 24,
    lineHeight: 32,
  },

  header: {
    alignItems: "center",
    marginTop: Spacing.five,
    marginBottom: Spacing.four,
  },

  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    marginTop: Spacing.one,
    textAlign: "center",
  },

  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },

  field: {
    marginTop: Spacing.three,
  },

  fieldError: {
    marginTop: Spacing.one,
    textAlign: "left",
  },

  eyeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  strengthRow: {
    flexDirection: "row",
    gap: Spacing.one,
    marginTop: Spacing.one,
  },

  strengthItem: {
    flex: 1,
    height: 3,
    borderRadius: Radius.full,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.three,
    flexWrap: "wrap",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginRight: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
  },

  checkMark: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "800",
  },

  registerButton: {
    marginTop: Spacing.three,
    height: 40,
    borderRadius: Radius.md,
  },

  loginRow: {
    marginTop: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
