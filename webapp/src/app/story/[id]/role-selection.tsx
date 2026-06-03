import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Award } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function RoleSelectionStubScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(`/story/${storyId}` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Vai trò nhân vật</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 3: Chọn vai trò câu chuyện
          </ThemedText>
        </View>
      </View>

      {/* Main Container */}
      <View style={styles.container}>
        <Card style={styles.infoCard}>
          <Award color={theme.primary} size={48} style={styles.icon} />
          <ThemedText type="subtitle" style={styles.title}>
            Chọn Vai Trò
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            Đây là màn hình chọn vai trò nhập vai cho kịch bản học tập. Tính năng chọn nhân vật này
            nằm trong phạm vi phát triển của task tiếp theo (T-D09).
          </ThemedText>

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <ThemedText type="label" themeColor="textSecondary">
                Kịch bản ID:{" "}
              </ThemedText>
              <ThemedText type="code" style={{ color: theme.primaryLight }}>
                {storyId}
              </ThemedText>
            </View>
          </View>

          <Button
            title="Quay lại chi tiết"
            onPress={() => router.replace(`/story/${storyId}` as never)}
            variant="outline"
            fullWidth
            style={{ marginTop: Spacing.four }}
          />

          <Button
            title="Về danh sách kịch bản"
            onPress={() => router.replace("/story" as never)}
            variant="ghost"
            fullWidth
            style={{ marginTop: Spacing.two }}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#353437",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    padding: Spacing.five,
  },
  icon: {
    marginBottom: Spacing.three,
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  description: {
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.four,
  },
  metaBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
