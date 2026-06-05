import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";
import { useListTopicsQuery } from "@/services/rtk-api/topic.api";

type TFunction = (key: string, options?: { count?: number; [key: string]: unknown }) => string;

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

const filterItems = [
  { key: "all", dbValue: "Tất cả", labelKey: "explore.filter_all" },
  { key: "ethics", dbValue: "Đạo đức", labelKey: "explore.filter_ethics" },
  { key: "history", dbValue: "Lịch sử", labelKey: "explore.filter_history" },
  { key: "politics", dbValue: "Chính trị", labelKey: "explore.filter_politics" },
  { key: "society", dbValue: "Xã hội", labelKey: "explore.filter_society" },
];

const getFeaturedLessons = (t: TFunction) => [
  {
    title: t("home.learning_socrates_title"),
    category: t("explore.filter_ethics"),
    duration: t("explore.lessons_suffix", { count: 8 }),
    description: t("explore.fallback_socrates_desc"),
    image: featuredImage,
    fullRoute: "/full-lesson",
    scenarioRoute: "/trial-of-socrates",
    shortRoute: "/short-lesson",
  },
  {
    title: t("explore.fallback_sartre_title"),
    category: t("explore.fallback_sartre_category"),
    duration: t("explore.lessons_suffix", { count: 5 }),
    description: t("explore.fallback_sartre_desc"),
    image: featuredImage,
    fullRoute: "/full-lesson",
    scenarioRoute: "/trial-of-socrates",
    shortRoute: "/short-lesson",
  },
  {
    title: t("explore.fallback_social_contract_title"),
    category: t("explore.fallback_social_contract_category"),
    duration: t("explore.lessons_suffix", { count: 8 }),
    description: t("explore.fallback_social_contract_desc"),
    image: null,
    fullRoute: "/full-lesson",
    scenarioRoute: "/trial-of-socrates",
    shortRoute: "/short-lesson",
  },
];

const getTopicsFallback = (t: TFunction) => [
  {
    title: t("explore.filter_ethics"),
    lessons: t("explore.lessons_suffix", { count: 12 }),
    progress: 34,
    category: "Đạo đức",
  },
  {
    title: t("home.learning_socrates_subtitle"),
    lessons: t("explore.lessons_suffix", { count: 8 }),
    progress: 66,
    category: "Đạo đức",
  },
  {
    title: t("explore.filter_politics"),
    lessons: t("explore.lessons_suffix", { count: 15 }),
    progress: 25,
    category: "Chính trị",
  },
  {
    title: t("explore.fallback_sartre_category"),
    lessons: t("explore.lessons_suffix", { count: 20 }),
    progress: 100,
    category: "Đạo đức",
  },
  {
    title: "Logic",
    lessons: t("explore.lessons_suffix", { count: 10 }),
    progress: 50,
    category: "Đạo đức",
  },
  {
    title: "AI Ethics",
    lessons: t("explore.lessons_suffix", { count: 6 }),
    progress: 12,
    category: "Xã hội",
  },
];

const getCategoryTranslation = (cat: string, t: TFunction) => {
  const normalized = cat.toLowerCase();
  switch (normalized) {
    case "đạo đức":
    case "ethics":
      return t("explore.filter_ethics");
    case "lịch sử":
    case "history":
      return t("explore.filter_history");
    case "chính trị":
    case "politics":
      return t("explore.filter_politics");
    case "xã hội":
    case "society":
      return t("explore.filter_society");
    case "tất cả":
    case "all":
      return t("explore.filter_all");
    default:
      return cat;
  }
};

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Set up visible filters dynamically
  const { data: allTopics = [] } = useListTopicsQuery({ limit: 100 });
  const visibleFilters = useMemo(() => {
    const categories = Array.from(
      new Set(allTopics.map((topic) => topic.category).filter(Boolean) as string[]),
    );

    // Ensure default dbValues are mapped or added if they aren't in database
    const baseItems = filterItems.map((item) => ({
      key: item.key,
      dbValue: item.dbValue,
      label: t(item.labelKey),
    }));

    // Add any categories from db not in the default items
    categories.forEach((cat) => {
      if (!baseItems.some((item) => item.dbValue === cat)) {
        baseItems.push({
          key: cat,
          dbValue: cat,
          label: getCategoryTranslation(cat, t),
        });
      }
    });

    return baseItems;
  }, [allTopics, t]);

  const [activeFilterKey, setActiveFilterKey] = useState("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const activeFilterItem = useMemo(() => {
    return (
      visibleFilters.find((f) => f.key === activeFilterKey) ||
      visibleFilters[0] || { key: "all", dbValue: "Tất cả", label: t("explore.filter_all") }
    );
  }, [activeFilterKey, visibleFilters, t]);

  const topicCategory = activeFilterItem.key === "all" ? undefined : activeFilterItem.dbValue;
  const { data: dbTopics = [] } = useListTopicsQuery({
    search: debouncedQuery || undefined,
    category: topicCategory,
    limit: 30,
  });

  const normalizedQuery = query.trim().toLowerCase();

  const featuredLessonsToUse = useMemo(() => {
    if (dbTopics.length === 0) {
      return getFeaturedLessons(t);
    }

    return dbTopics.slice(0, 6).map((topic) => ({
      topicId: topic.id,
      title: topic.title,
      category: getCategoryTranslation(topic.category ?? "Triết học", t),
      duration: t("explore.lessons_suffix", { count: topic._count?.lessons ?? 0 }),
      description: topic.description ?? t("explore.empty_text"),
      image: featuredImage,
      fullRoute: "/full-lesson",
      scenarioRoute: "/trial-of-socrates",
      shortRoute: "/short-lesson",
    }));
  }, [dbTopics, t]);

  const filteredLessons = useMemo(
    () =>
      featuredLessonsToUse.filter((lesson) => {
        const matchesFilter =
          activeFilterItem.key === "all" ||
          lesson.category === activeFilterItem.label ||
          lesson.category === activeFilterItem.dbValue;
        const matchesQuery =
          !normalizedQuery ||
          `${lesson.title} ${lesson.category} ${lesson.description}`
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesFilter && matchesQuery;
      }),
    [activeFilterItem, featuredLessonsToUse, normalizedQuery],
  );

  const topicsToUse = useMemo(() => {
    if (dbTopics && dbTopics.length > 0) {
      return dbTopics.map((tItem, index) => ({
        id: tItem.id,
        title: tItem.title,
        lessons: t("explore.lessons_suffix", { count: tItem._count?.lessons ?? 0 }),
        progress: Math.min(100, index === 0 ? 34 : 18 + index * 12),
        category: tItem.category ?? "Đạo đức",
      }));
    }
    return getTopicsFallback(t).map((tItem) => ({ ...tItem, id: undefined as string | undefined }));
  }, [dbTopics, t]);

  const filteredTopics = useMemo(
    () =>
      topicsToUse.filter((topic) => {
        const matchesFilter =
          activeFilterItem.key === "all" ||
          topic.category === activeFilterItem.dbValue ||
          getCategoryTranslation(topic.category, t) === activeFilterItem.label;
        const matchesQuery =
          !normalizedQuery ||
          `${topic.title} ${topic.lessons} ${topic.category}`
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesFilter && matchesQuery;
      }),
    [activeFilterItem, normalizedQuery, topicsToUse, t],
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
            <ThemedText style={styles.title}>{t("explore.title")}</ThemedText>
            <ThemedText style={styles.subtitle}>{t("explore.subtitle")}</ThemedText>
          </View>

          <View style={[styles.searchBox, query.length > 0 && styles.searchBoxActive]}>
            <Search color={query.length > 0 ? Colors.primaryLight : Colors.locked} size={18} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("explore.search_placeholder")}
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
            {visibleFilters.map((filter) => {
              const active = filter.key === activeFilterKey;

              return (
                <Pressable
                  key={filter.key}
                  accessibilityRole="button"
                  onPress={() => setActiveFilterKey(filter.key)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    active && styles.filterActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText style={[styles.filterText, active && styles.filterTextActive]}>
                    {filter.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>{t("explore.featured")}</ThemedText>
              <ThemedText style={styles.resultCount}>
                {t("explore.lessons_count", { count: filteredLessons.length })}
              </ThemedText>
            </View>

            {filteredLessons.length === 0 ? (
              <EmptyState />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
              >
                {filteredLessons.map((lesson, index) => {
                  const lessonKey =
                    "topicId" in lesson && typeof lesson.topicId === "string"
                      ? lesson.topicId
                      : `${lesson.title}-${index}`;

                  return (
                    <View key={lessonKey} style={styles.featuredCard}>
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
                          onPress={() => {
                            const topicId =
                              "topicId" in lesson && typeof lesson.topicId === "string"
                                ? lesson.topicId
                                : null;

                            if (topicId) {
                              router.push({
                                pathname: "/short-lesson" as never,
                                params: { topicId },
                              });
                            } else {
                              startLesson(lesson.shortRoute);
                            }
                          }}
                          style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
                        >
                          <ThemedText style={styles.startButtonText}>
                            {t("explore.button_short")}
                          </ThemedText>
                          <ArrowRight color={Colors.primaryText} size={16} />
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            const topicId =
                              "topicId" in lesson && typeof lesson.topicId === "string"
                                ? lesson.topicId
                                : null;

                            if (topicId) {
                              router.push({
                                pathname: "/topic-lessons" as never,
                                params: { topicId, topicTitle: lesson.title },
                              });
                            } else {
                              startLesson(lesson.fullRoute);
                            }
                          }}
                          style={({ pressed }) => [
                            styles.fullLessonButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <BookOpen color={Colors.primaryLight} size={16} />
                          <ThemedText style={styles.fullLessonButtonText}>
                            {t("explore.button_full")}
                          </ThemedText>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => startLesson(lesson.scenarioRoute)}
                          style={({ pressed }) => [
                            styles.scenarioButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Sparkles color={Colors.primaryLight} size={16} />
                          <ThemedText style={styles.scenarioButtonText}>
                            {t("explore.button_scenario")}
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>{t("explore.topics_title")}</ThemedText>
              <ThemedText style={styles.resultCount}>
                {t("explore.topics_count", { count: filteredTopics.length })}
              </ThemedText>
            </View>

            <View style={styles.topicGrid}>
              {filteredTopics.map((topic) => (
                <Pressable
                  key={topic.id ?? topic.title}
                  accessibilityRole="button"
                  onPress={() => {
                    if (topic.id) {
                      router.push({
                        pathname: "/topic-lessons" as never,
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
              <ThemedText style={styles.quoteText}>{t("explore.quote_text")}</ThemedText>
              <ThemedText style={styles.quoteAuthor}>{t("explore.quote_author")}</ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyState}>
      <BookOpen color={Colors.locked} size={28} />
      <ThemedText style={styles.emptyTitle}>{t("explore.empty_title")}</ThemedText>
      <ThemedText style={styles.emptyText}>{t("explore.empty_text")}</ThemedText>
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
  scenarioButton: {
    minHeight: 42,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.chip,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    backgroundColor: Colors.input,
  },
  scenarioButtonText: {
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
