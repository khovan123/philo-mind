import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "@/services/api";
import { TopicDTO } from "@philo-mind/shared";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  surfaceSoft: "#18181B",
  input: "#1E1E22",
  chip: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  locked: "#52525B",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  primaryText: "#0C0C0E",
};

const featuredImage =
  "https://lh3.googleusercontent.com/aida/ADBb0uhB-BsNh_Qy7s6akK1COFe_ezvtoKv-rL3DQfw0HQaL96njTcP3KNp2pMCO15nzCnD0Bdkq3XO8B7uxVMIsK4jyNnJTRUnEeiN0BDMnsilmtR5ITDbnHNNgY1VmcZNNeMfHCWnKO10H-r0_bPpCvxFutPxvx7zn_Pxyr6bkr22qEzKFJ52m0XOKIlQqVl2kXiUzOxTREEGwi-z5HVNoGTTJIoNRL0pdLhSQ8tp_Y2rylPldVEoeheiiMfzw";

const filters = ["Tất cả", "Đạo đức", "Lịch sử", "Chính trị", "Xã hội"];

const featuredLessons = [
  {
    title: "Phiên tòa Socrates",
    category: "Đạo đức",
    duration: "8 phút",
    description:
      "Nhập vai Socrates, lựa chọn trước tòa án Athens và khám phá bài học về chính trực đạo đức.",
    image: featuredImage,
    fullRoute: "/trial-of-socrates",
    shortRoute: "/short-lesson",
  },
  {
    title: "Tự do là gì? Góc nhìn của Sartre",
    category: "Hiện sinh",
    duration: "5 phút",
    description:
      "Hành trình tìm kiếm ý nghĩa cá nhân trong một thế giới không có bản thiết kế sẵn.",
    image: featuredImage,
    fullRoute: "/trial-of-socrates",
    shortRoute: "/short-lesson",
  },
  {
    title: "Khế ước xã hội hiện đại",
    category: "Xã hội",
    duration: "8 phút",
    description: "Vì sao con người chấp nhận giới hạn tự do để cùng sống trong trật tự?",
    image: null,
    fullRoute: "/trial-of-socrates",
    shortRoute: "/short-lesson",
  },
];

const topics = [
  { title: "Đạo đức", lessons: "12 bài học", progress: 34, category: "Đạo đức" },
  { title: "Hạnh phúc", lessons: "8 bài học", progress: 66, category: "Đạo đức" },
  { title: "Công bằng", lessons: "15 bài học", progress: 25, category: "Chính trị" },
  { title: "Hiện sinh", lessons: "20 bài học", progress: 100, category: "Đạo đức" },
  { title: "Logic", lessons: "10 bài học", progress: 50, category: "Đạo đức" },
  { title: "AI Ethics", lessons: "6 bài học", progress: 12, category: "Xã hội" },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");
  const [dbTopics, setDbTopics] = useState<TopicDTO[]>([]);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const data = await apiRequest<TopicDTO[]>("/topics");
        setDbTopics(data);
      } catch {
        // Fallback to static topics if request fails
      }
    }
    fetchTopics();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredLessons = useMemo(
    () =>
      featuredLessons.filter((lesson) => {
        const matchesFilter = activeFilter === "Tất cả" || lesson.category === activeFilter;
        const matchesQuery =
          !normalizedQuery ||
          `${lesson.title} ${lesson.category} ${lesson.description}`
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesFilter && matchesQuery;
      }),
    [activeFilter, normalizedQuery],
  );

  const topicsToUse = useMemo(() => {
    if (dbTopics && dbTopics.length > 0) {
      return dbTopics.map((t, index) => ({
        id: t.id,
        title: t.title,
        lessons: "5 bài học",
        progress: index === 0 ? 34 : 66,
        category: t.category ?? "Đạo đức",
      }));
    }
    return topics.map((t) => ({ ...t, id: undefined as string | undefined }));
  }, [dbTopics]);

  const filteredTopics = useMemo(
    () =>
      topicsToUse.filter((topic) => {
        const matchesFilter = activeFilter === "Tất cả" || topic.category === activeFilter;
        const matchesQuery =
          !normalizedQuery ||
          `${topic.title} ${topic.lessons} ${topic.category}`
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesFilter && matchesQuery;
      }),
    [activeFilter, normalizedQuery, topicsToUse],
  );

  function startLesson(route: string) {
    router.push(route as never);
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.titleBlock}>
            <ThemedText style={styles.title}>Khám phá</ThemedText>
            <ThemedText style={styles.subtitle}>
              Tìm chủ đề, bài học và câu hỏi triết học để tiếp tục hành trình.
            </ThemedText>
          </View>

          <View style={[styles.searchBox, query.length > 0 && styles.searchBoxActive]}>
            <Search color={query.length > 0 ? Colors.primaryLight : Colors.locked} size={18} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm chủ đề, triết gia..."
              placeholderTextColor={Colors.locked}
              selectionColor={Colors.primaryLight}
              style={styles.searchInput}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {filters.map((filter) => {
              const active = filter === activeFilter;

              return (
                <Pressable
                  key={filter}
                  accessibilityRole="button"
                  onPress={() => setActiveFilter(filter)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    active && styles.filterActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText style={[styles.filterText, active && styles.filterTextActive]}>
                    {filter}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Nổi bật</ThemedText>
              <ThemedText style={styles.resultCount}>{filteredLessons.length} bài</ThemedText>
            </View>

            {filteredLessons.length === 0 ? (
              <EmptyState />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
              >
                {filteredLessons.map((lesson) => (
                  <View key={lesson.title} style={styles.featuredCard}>
                    {lesson.image ? (
                      <Image
                        source={lesson.image}
                        contentFit="cover"
                        style={styles.featuredImage}
                      />
                    ) : (
                      <View style={styles.featuredFallback}>
                        <BookOpen color={Colors.locked} size={40} />
                      </View>
                    )}

                    <View style={styles.featuredBody}>
                      <View style={styles.featuredMeta}>
                        <ThemedText style={styles.featuredCategory}>{lesson.category}</ThemedText>
                        <View style={styles.metaDot} />
                        <ThemedText style={styles.featuredDuration}>{lesson.duration}</ThemedText>
                      </View>

                      <ThemedText style={styles.featuredTitle}>{lesson.title}</ThemedText>
                      <ThemedText numberOfLines={2} style={styles.featuredDescription}>
                        {lesson.description}
                      </ThemedText>

                      <Pressable
                        accessibilityRole="button"
                        onPress={() => startLesson(lesson.shortRoute)}
                        style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
                      >
                        <ThemedText style={styles.startButtonText}>Short</ThemedText>
                        <ArrowRight color={Colors.primaryText} size={16} />
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => startLesson(lesson.fullRoute)}
                        style={({ pressed }) => [
                          styles.fullLessonButton,
                          pressed && styles.pressed,
                        ]}
                      >
                        <BookOpen color={Colors.primaryLight} size={16} />
                        <ThemedText style={styles.fullLessonButtonText}>Full</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Chủ đề</ThemedText>
              <ThemedText style={styles.resultCount}>{filteredTopics.length} mục</ThemedText>
            </View>

            <View style={styles.topicGrid}>
              {filteredTopics.map((topic) => (
                <Pressable
                  key={topic.title}
                  accessibilityRole="button"
                  onPress={() => {
                    if (topic.id) {
                      router.push({
                        pathname: "/topic-perspectives" as never,
                        params: { topicId: topic.id, topicTitle: topic.title },
                      });
                    } else {
                      setQuery(topic.title);
                    }
                  }}
                  style={({ pressed }) => [styles.topicCard, pressed && styles.pressed]}
                >
                  <View style={styles.topicCopy}>
                    <ThemedText style={styles.topicTitle}>{topic.title}</ThemedText>
                    <ThemedText style={styles.topicLessons}>{topic.lessons}</ThemedText>
                  </View>

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${topic.progress}%` }]} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.quoteCard}>
            <Sparkles color={Colors.primaryLight} size={16} />
            <View style={styles.quoteCopy}>
              <ThemedText style={styles.quoteText}>
                Cuộc đời không được khảo sát thì không đáng sống.
              </ThemedText>
              <ThemedText style={styles.quoteAuthor}>- Socrates</ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <BookOpen color={Colors.locked} size={28} />
      <ThemedText style={styles.emptyTitle}>Không tìm thấy bài học</ThemedText>
      <ThemedText style={styles.emptyText}>Thử đổi bộ lọc hoặc nhập từ khóa ngắn hơn.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + 120,
    gap: Spacing.three,
    maxWidth: 820,
    width: "100%",
    alignSelf: "center",
  },
  titleBlock: {
    gap: Spacing.one,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  searchBox: {
    minHeight: 46,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.input,
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchBoxActive: {
    borderColor: Colors.primary,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    color: Colors.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: "600",
    padding: 0,
  },
  filterList: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  filterChip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: Colors.input,
  },
  filterActive: {
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  filterTextActive: {
    color: Colors.primaryLight,
  },
  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
  },
  resultCount: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  featuredList: {
    gap: Spacing.three,
    paddingRight: Spacing.three,
  },
  featuredCard: {
    width: Platform.select({ web: 360, default: 300 }),
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surfaceSoft,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: 190,
  },
  featuredFallback: {
    width: "100%",
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.input,
  },
  featuredBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  featuredCategory: {
    color: Colors.primaryLight,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.locked,
  },
  featuredDuration: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
  },
  featuredTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  featuredDescription: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  startButton: {
    minHeight: 42,
    borderRadius: Radius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    backgroundColor: Colors.primary,
  },
  startButtonText: {
    color: Colors.primaryText,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  fullLessonButton: {
    minHeight: 42,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    backgroundColor: "transparent",
  },
  fullLessonButtonText: {
    color: Colors.primaryLight,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  topicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  topicCard: {
    width: "48%",
    minHeight: 128,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    padding: Spacing.three,
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
  },
  topicCopy: {
    gap: Spacing.half,
  },
  topicTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  topicLessons: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  progressTrack: {
    height: 4,
    borderRadius: Radius.full,
    overflow: "hidden",
    backgroundColor: Colors.input,
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  emptyState: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surface,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  quoteCard: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Colors.chip,
  },
  quoteCopy: {
    flex: 1,
    paddingLeft: Spacing.two,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    gap: Spacing.one,
  },
  quoteText: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    fontWeight: "600",
  },
  quoteAuthor: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
