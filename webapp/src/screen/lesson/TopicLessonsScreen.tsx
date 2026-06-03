import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react-native";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";
import { useListLessonsQuery } from "@/services/rtk-api/lesson.api";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  card: "#1E1E21",
  chip: "#27272A",
  border: "#353437",
  text: "#E4E4E7",
  muted: "#A1A1AA",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  buttonText: "#0C0C0E",
};

export default function TopicLessonsScreen() {
  const router = useRouter();
  const { topicId, topicTitle } = useLocalSearchParams<{
    topicId: string;
    topicTitle?: string;
  }>();
  const {
    data: lessons = [],
    isLoading,
    isError,
    refetch,
  } = useListLessonsQuery({ topicId, limit: 50 }, { skip: !topicId });

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={Colors.primaryLight} size={22} />
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText style={styles.eyebrow}>Chủ đề</ThemedText>
            <ThemedText numberOfLines={2} style={styles.title}>
              {topicTitle ?? "Bài học"}
            </ThemedText>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator color={Colors.primaryLight} />
              <ThemedText style={styles.stateText}>Đang tải bài học từ database...</ThemedText>
            </View>
          ) : null}

          {isError ? (
            <View style={styles.stateCard}>
              <ThemedText style={styles.stateTitle}>Không tải được bài học</ThemedText>
              <Pressable onPress={() => refetch()} style={styles.retryButton}>
                <ThemedText style={styles.retryButtonText}>Thử lại</ThemedText>
              </Pressable>
            </View>
          ) : null}

          {!isLoading && !isError && lessons.length === 0 ? (
            <View style={styles.stateCard}>
              <BookOpen color={Colors.muted} size={34} />
              <ThemedText style={styles.stateTitle}>Chưa có bài học trong chủ đề này</ThemedText>
              <ThemedText style={styles.stateText}>
                Kiểm tra lại seed full lessons hoặc chọn chủ đề khác.
              </ThemedText>
            </View>
          ) : null}

          {lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() =>
                router.push({
                  pathname: "/full-lesson" as never,
                  params: { lessonId: lesson.id },
                })
              }
              style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]}
            >
              <View style={styles.lessonIcon}>
                <BookOpen color={Colors.primaryLight} size={18} />
              </View>
              <View style={styles.lessonCopy}>
                <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
                <ThemedText numberOfLines={2} style={styles.lessonDescription}>
                  {lesson.conflict || lesson.realLifeExample || "Đọc full lesson từ database."}
                </ThemedText>
                <View style={styles.metaRow}>
                  <ThemedText style={styles.metaText}>
                    {lesson.estimatedMinutes ?? 8} phút đọc
                  </ThemedText>
                  <ThemedText style={styles.metaText}>{lesson.status}</ThemedText>
                </View>
              </View>
              <ChevronRight color={Colors.muted} size={20} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  eyebrow: {
    color: Colors.primaryLight,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
  },
  content: {
    width: "100%",
    maxWidth: 820,
    alignSelf: "center",
    padding: Spacing.three,
    paddingBottom: BottomTabInset + 80,
    gap: Spacing.two,
  },
  stateCard: {
    minHeight: 180,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
    gap: Spacing.two,
  },
  stateTitle: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  stateText: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    textAlign: "center",
  },
  retryButton: {
    minHeight: 42,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryLight,
  },
  retryButtonText: {
    color: Colors.buttonText,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
  },
  lessonCard: {
    minHeight: 116,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  lessonIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.chip,
  },
  lessonCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  lessonTitle: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
  },
  lessonDescription: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  metaText: {
    color: Colors.primaryLight,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
