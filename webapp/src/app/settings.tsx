import { useMemo, useState } from "react";
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
import { ApiError } from "@/services/api";
import { authService } from "@/services/auth.service";
import { getAuthUser } from "@/stores/auth.helpers";

// ── Section header ─────────────────────────────────────────

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
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
      {checks.map((c) => (
        <View
          key={c.key}
          style={[
            strengthStyles.bar,
            { backgroundColor: c.passed ? theme.primary : theme.backgroundSelected },
          ]}
        />
      ))}
    </View>
  );
}

const strengthStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.one, marginTop: Spacing.one },
  bar: { flex: 1, height: 3, borderRadius: Radius.full },
});

// ── Main screen ────────────────────────────────────────────

type SettingsState = "idle" | "loading" | "success" | "error";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const currentUser = getAuthUser();

  // ── Profile section ──────────────────────────────────────
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
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
    const trimmed = fullName.trim();
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
      await authService.updateProfile({ fullName: trimmed });
      setProfileState("success");
      setTimeout(() => setProfileState("idle"), 2000);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Cập nhật thất bại");
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
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordState("success");
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi");
      setTimeout(() => setPasswordState("idle"), 2000);
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Đổi mật khẩu thất bại");
      setPasswordState("error");
    }
  }

  function handleSaveNotifications() {
    Alert.alert("Đã lưu", "Cài đặt thông báo đã được cập nhật");
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
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <SectionHeader
              title="Thông tin cá nhân"
              icon={<User size={16} color={theme.textSecondary} strokeWidth={2} />}
            />

            {/* Avatar */}
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
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
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
              title={profileState === "loading" ? "Đang lưu…" : "Lưu thay đổi"}
              loading={profileState === "loading"}
              disabled={profileState === "loading"}
              onPress={handleSaveProfile}
              fullWidth
              style={styles.actionBtn}
            />
          </View>

          {/* ── Password section ── */}
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <SectionHeader
              title="Đổi mật khẩu"
              icon={<Lock size={16} color={theme.textSecondary} strokeWidth={2} />}
            />
            <Input
              label="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="••••••••"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
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
              onChangeText={setConfirmPassword}
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

            <Button
              title={passwordState === "loading" ? "Đang lưu…" : "Đổi mật khẩu"}
              loading={passwordState === "loading"}
              disabled={passwordState === "loading"}
              onPress={handleChangePassword}
              fullWidth
              style={styles.actionBtn}
            />
          </View>

          {/* ── Notification section ── */}
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
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
              onToggle={() => setNotifLearning((p) => !p)}
            />
            <NotifRow
              label="Streak hàng ngày"
              description="Nhắc nhở duy trì chuỗi học liên tiếp"
              value={notifStreak}
              onToggle={() => setNotifStreak((p) => !p)}
            />
            <NotifRow
              label="Tranh luận mới"
              description="Thông báo khi có debate mới trong chủ đề bạn theo dõi"
              value={notifDebate}
              onToggle={() => setNotifDebate((p) => !p)}
            />

            <Button
              title="Lưu cài đặt thông báo"
              variant="secondary"
              onPress={handleSaveNotifications}
              fullWidth
              style={styles.actionBtn}
            />
          </View>

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

      {/* Toggle */}
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
  safe: { flex: 1 },
  flex: { flex: 1 },

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
