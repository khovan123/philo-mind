import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Lock, User } from "lucide-react-native";

import { Avatar, Button, Input, ThemedText } from "@/components/ui";
import { BottomTabInset, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useChangePasswordMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} from "@/services/auth/api";
import { baseApi } from "@/services/rtk-api/baseApi";
import { selectAuthUser } from "@/stores/auth.helpers";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { authStateSet, loggedOut } from "@/stores/slices/auth.slice";

// ── Helpers ────────────────────────────────────────────────

function getApiErrorMessage(error: unknown, fallback: string) {
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

  if (typeof error === "object" && error !== null && "error" in error) {
    return String((error as { error?: string }).error ?? fallback);
  }

  return fallback;
}

// ── Section header ─────────────────────────────────────────

function SectionHeader({ title, icon }: { title: string; icon: ReactNode }) {
  const theme = useTheme();

  return (
    <View style={sectionStyles.row}>
      {icon}

      <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
        {title}
      </ThemedText>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
});

// ── Password strength indicator ────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const theme = useTheme();

  const checks = useMemo(
    () => [
      { key: "upper", passed: /[A-Z]/.test(password) },
      { key: "lower", passed: /[a-z]/.test(password) },
      { key: "digit", passed: /[0-9]/.test(password) },
      { key: "special", passed: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  );

  if (!password) return null;

  return (
    <View style={strengthStyles.row}>
      {checks.map((check) => (
        <View
          key={check.key}
          style={[
            strengthStyles.bar,
            {
              backgroundColor: check.passed ? theme.primary : theme.backgroundSelected,
            },
          ]}
        />
      ))}
    </View>
  );
}

const strengthStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.one,
    marginTop: Spacing.one,
  },

  bar: {
    flex: 1,
    height: 3,
    borderRadius: Radius.full,
  },
});

// ── Main screen ────────────────────────────────────────────

type SettingsState = "idle" | "loading" | "success" | "error";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectAuthUser);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const mountedRef = useRef(false);
  const profileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (profileTimerRef.current) {
        clearTimeout(profileTimerRef.current);
      }

      if (passwordTimerRef.current) {
        clearTimeout(passwordTimerRef.current);
      }
    };
  }, []);

  // ── Profile section ──────────────────────────────────────

  const [fullName, setFullName] = useState<string | null>(null);
  const profileFullName = fullName ?? currentUser?.fullName ?? "";

  const [profileState, setProfileState] = useState<SettingsState>("idle");
  const [profileError, setProfileError] = useState<string | null>(null);

  // ── Password section ─────────────────────────────────────

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordState, setPasswordState] = useState<SettingsState>("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ── Notification section ─────────────────────────────────

  const [notifLearning, setNotifLearning] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifDebate, setNotifDebate] = useState(false);

  // ── Handlers ─────────────────────────────────────────────

  async function handleSaveProfile() {
    const trimmed = profileFullName.trim();

    if (trimmed.length < 2) {
      setProfileError("Tên tối thiểu 2 ký tự");
      return;
    }

    if (trimmed === currentUser?.fullName) {
      setProfileError("Tên chưa thay đổi");
      return;
    }

    setProfileError(null);
    setProfileState("loading");

    try {
      const updatedUser = await updateProfile({ fullName: trimmed }).unwrap();

      dispatch(
        authStateSet({
          user: updatedUser,
        }),
      );

      if (!mountedRef.current) return;

      setFullName(null);
      setProfileState("success");

      if (profileTimerRef.current) {
        clearTimeout(profileTimerRef.current);
      }

      profileTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setProfileState("idle");
        }
      }, 2000);
    } catch (error) {
      if (!mountedRef.current) return;

      setProfileError(getApiErrorMessage(error, "Cập nhật thất bại"));
      setProfileState("error");
    }
  }

  async function handleChangePassword() {
    if (!currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Mật khẩu mới tối thiểu 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Xác nhận mật khẩu không khớp");
      return;
    }

    setPasswordError(null);
    setPasswordState("loading");

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      if (!mountedRef.current) return;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordState("success");

      Alert.alert("Thành công", "Mật khẩu đã được thay đổi");

      if (passwordTimerRef.current) {
        clearTimeout(passwordTimerRef.current);
      }

      passwordTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setPasswordState("idle");
        }
      }, 2000);
    } catch (error) {
      if (!mountedRef.current) return;

      setPasswordError(getApiErrorMessage(error, "Đổi mật khẩu thất bại"));
      setPasswordState("error");
    }
  }

  function handleSaveNotifications() {
    Alert.alert("Đã lưu", "Cài đặt thông báo đã được cập nhật");
  }

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // Nếu API logout lỗi, vẫn clear local session để user thoát app.
    } finally {
      dispatch(loggedOut());
      dispatch(baseApi.util.resetApiState());
      router.replace("/(auth)/login" as never);
    }
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color={theme.text} strokeWidth={2.5} />
          </Pressable>

          <ThemedText type="smallBold" style={styles.headerTitle}>
            Cài đặt
          </ThemedText>

          <View style={styles.backBtn} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {/* ── Profile section ── */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <SectionHeader
              title="Thông tin cá nhân"
              icon={<User size={16} color={theme.textSecondary} strokeWidth={2} />}
            />

            <View style={styles.avatarRow}>
              <Avatar uri={currentUser?.avatarUrl} name={currentUser?.fullName} size={64} />

              <View style={styles.avatarInfo}>
                <ThemedText type="smallBold">{currentUser?.fullName ?? "—"}</ThemedText>

                <ThemedText type="label" themeColor="textSecondary">
                  {currentUser?.email ?? "—"}
                </ThemedText>
              </View>
            </View>

            <Input
              label="Tên hiển thị"
              value={profileFullName}
              onChangeText={(text) => {
                setFullName(text);
                setProfileError(null);
                setProfileState("idle");
              }}
              placeholder="Nhập tên của bạn"
              autoCapitalize="words"
              autoCorrect={false}
              containerStyle={styles.field}
            />

            {profileError ? (
              <ThemedText type="label" style={[styles.errorText, { color: theme.danger }]}>
                {profileError}
              </ThemedText>
            ) : null}

            {profileState === "success" ? (
              <ThemedText type="label" style={[styles.errorText, { color: theme.success }]}>
                ✓ Đã cập nhật
              </ThemedText>
            ) : null}

            <Button
              title={isUpdatingProfile ? "Đang lưu…" : "Lưu thay đổi"}
              loading={isUpdatingProfile}
              disabled={isUpdatingProfile}
              onPress={handleSaveProfile}
              fullWidth
              style={styles.actionBtn}
            />
          </View>

          {/* ── Password section ── */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <SectionHeader
              title="Đổi mật khẩu"
              icon={<Lock size={16} color={theme.textSecondary} strokeWidth={2} />}
            />

            <Input
              label="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                setPasswordError(null);
                setPasswordState("idle");
              }}
              placeholder="••••••••"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError(null);
                setPasswordState("idle");
              }}
              placeholder="••••••••"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.field}
            />

            <PasswordStrength password={newPassword} />

            <Input
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError(null);
                setPasswordState("idle");
              }}
              placeholder="••••••••"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.field}
            />

            {passwordError ? (
              <ThemedText type="label" style={[styles.errorText, { color: theme.danger }]}>
                {passwordError}
              </ThemedText>
            ) : null}

            {passwordState === "success" ? (
              <ThemedText type="label" style={[styles.errorText, { color: theme.success }]}>
                ✓ Đã đổi mật khẩu
              </ThemedText>
            ) : null}

            <Button
              title={isChangingPassword ? "Đang lưu…" : "Đổi mật khẩu"}
              loading={isChangingPassword}
              disabled={isChangingPassword}
              onPress={handleChangePassword}
              fullWidth
              style={styles.actionBtn}
            />
          </View>

          {/* ── Notification section ── */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <SectionHeader
              title="Thông báo"
              icon={
                <ThemedText type="label" themeColor="textSecondary">
                  🔔
                </ThemedText>
              }
            />

            <NotifRow
              label="Nhắc nhở học tập"
              description="Nhận thông báo khi có bài học mới"
              value={notifLearning}
              onToggle={() => setNotifLearning((prev) => !prev)}
            />

            <NotifRow
              label="Chuỗi ngày"
              description="Nhắc nhở duy trì chuỗi học liên tiếp"
              value={notifStreak}
              onToggle={() => setNotifStreak((prev) => !prev)}
            />

            <NotifRow
              label="Tranh luận mới"
              description="Thông báo khi có debate mới trong chủ đề bạn theo dõi"
              value={notifDebate}
              onToggle={() => setNotifDebate((prev) => !prev)}
            />

            <Button
              title="Lưu cài đặt thông báo"
              variant="secondary"
              onPress={handleSaveNotifications}
              fullWidth
              style={styles.actionBtn}
            />
          </View>

          <Button
            title={isLoggingOut ? "Đang đăng xuất…" : "Đăng xuất"}
            variant="secondary"
            loading={isLoggingOut}
            disabled={isLoggingOut}
            onPress={handleLogout}
            fullWidth
          />

          <View style={{ height: BottomTabInset }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Notification toggle row ────────────────────────────────

function NotifRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable onPress={onToggle} style={[styles.notifRow, { borderBottomColor: theme.border }]}>
      <View style={styles.notifText}>
        <ThemedText type="smallBold">{label}</ThemedText>

        <ThemedText type="label" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>

      <View
        style={[
          styles.toggle,
          {
            backgroundColor: value ? theme.primary : theme.backgroundElement,
            borderColor: value ? theme.primary : theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: "#fff",
              transform: [{ translateX: value ? 18 : 2 }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

// ── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  header: {
    height: 56,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 16,
    lineHeight: 22,
  },

  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    maxWidth: 820,
    width: "100%",
    alignSelf: "center",
  },

  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },

  avatarInfo: {
    flex: 1,
    gap: Spacing.one,
  },

  field: {
    marginTop: Spacing.three,
  },

  errorText: {
    marginTop: Spacing.one,
  },

  actionBtn: {
    marginTop: Spacing.three,
  },

  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },

  notifText: {
    flex: 1,
    gap: Spacing.one,
  },

  toggle: {
    width: 42,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 1,
    justifyContent: "center",
  },

  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});
