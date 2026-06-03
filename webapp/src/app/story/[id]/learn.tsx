import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen } from "lucide-react-native";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function StoryLearnPlaceholderScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(`/story/${storyId}/map` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Học khái niệm</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 2 • Thẻ học tập triết học
          </ThemedText>
        </View>
      </View>

      <View style={styles.container}>
        <Card style={[styles.infoCard, { borderColor: theme.border }]}>
          <BookOpen color={theme.primary} size={48} style={{ marginBottom: Spacing.three }} />

          <ThemedText type="subtitle" style={styles.title}>
            Học Khái Niệm Triết Học
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            Đây là không gian hiển thị các Thẻ học tập triết học (Learn Cards) giúp nhân vật thu
            nhận kiến thức trước khi bước vào điểm quyết định.
          </ThemedText>

          <Button
            title="Quay lại Bản đồ khám phá"
            onPress={() => router.replace(`/story/${storyId}/map` as never)}
            variant="outline"
            fullWidth
            style={{ marginTop: Spacing.four }}
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
});
