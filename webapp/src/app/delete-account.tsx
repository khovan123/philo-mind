import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui";
import { AppHeader } from "@/components/app-header";
import { authService } from "@/services/auth.service";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function confirmDelete() {
    Alert.alert(
      "Xác nhận xóa tài khoản",
      "Tài khoản của bạn sẽ bị vô hiệu hóa ngay lập tức và dữ liệu sẽ được giữ trong 30 ngày. Sau thời gian này, tài khoản có thể bị xóa vĩnh viễn.",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa tài khoản", style: "destructive", onPress: handleDeleteAccount },
      ],
    );
  }

  async function handleDeleteAccount() {
    setError(null);
    setIsLoading(true);

    try {
      await authService.deleteAccount();
      Alert.alert(
        "Yêu cầu đã được ghi nhận",
        "Tài khoản của bạn đã được ghi nhận xóa và sẽ được giữ trong 30 ngày.",
      );
      router.replace("/(auth)/register" as never);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xảy ra lỗi không xác định";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <AppHeader />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <ThemedText type="subtitle" style={styles.title}>
              Xóa tài khoản
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
              Khi bạn xóa tài khoản, tất cả dữ liệu sẽ được giữ trong 30 ngày trước khi xóa vĩnh
              viễn. Trong thời gian này, bạn không thể đăng nhập lại.
            </ThemedText>

            <View style={styles.warningBox}>
              <ThemedText type="label" themeColor="danger">
                Lưu ý: hành động này không thể hoàn tác từ phía ứng dụng sau khi yêu cầu được gửi.
              </ThemedText>
            </View>

            {error ? (
              <ThemedText type="label" themeColor="danger" style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            <Button
              title="Xóa tài khoản"
              variant="danger"
              loading={isLoading}
              onPress={confirmDelete}
              fullWidth
            />

            <Pressable style={styles.secondaryAction} onPress={() => router.back()}>
              <ThemedText type="label" themeColor="textSecondary">
                Quay lại
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.one,
  },
  description: {
    lineHeight: 22,
  },
  warningBox: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255, 69, 58, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.16)",
  },
  errorText: {
    marginBottom: Spacing.two,
  },
  secondaryAction: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
});
