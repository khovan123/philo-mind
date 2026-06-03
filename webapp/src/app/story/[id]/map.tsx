import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Compass } from "lucide-react-native";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function ExplorationMapPlaceholderScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(`/story/${storyId}/role-intro` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Bản đồ khám phá</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 5/7 • Tiến trình câu chuyện
          </ThemedText>
        </View>
      </View>

      {/* Main Container */}
      <View style={styles.container}>
        <Card style={[styles.infoCard, { borderColor: theme.border }]}>
          <View style={[styles.iconWrapper, { backgroundColor: "rgba(217, 119, 6, 0.1)" }]}>
            <Compass color={theme.primary} size={48} />
          </View>

          <ThemedText type="subtitle" style={styles.title}>
            Bản Đồ Khám Phá
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            Bạn đã thiết lập thành công hồ sơ nhân vật. Đây là bản đồ tương tác để bạn khám phá các
            tình huống quyết định đạo đức (Step 5).
          </ThemedText>

          <View
            style={[
              styles.metaBox,
              { backgroundColor: "rgba(255, 255, 255, 0.02)", borderColor: theme.border },
            ]}
          >
            <ThemedText type="label" themeColor="textSecondary">
              Kịch bản ID:
            </ThemedText>
            <ThemedText type="code" style={{ color: theme.primaryLight, fontSize: 13 }}>
              {storyId}
            </ThemedText>
          </View>

          <Button
            title="Quay lại hồ sơ nhân vật"
            onPress={() => router.replace(`/story/${storyId}/role-intro` as never)}
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
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  title: {
    fontWeight: "900",
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
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.one,
  },
});
