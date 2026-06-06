import { useRouter } from "expo-router";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { cn } from "@/lib/utils";
import { useListTopicsQuery } from "@/services/rtk-api/topic.api";
import { Pressable, ScrollView, TextInput, View } from "@/tw";
import { Image } from "@/tw/image";

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
    <View className={styles.screen}>
      <SafeAreaView edges={["top"]} className={styles.safeArea}>
        <AppHeader />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName={styles.content}>
          <View className={styles.titleBlock}>
            <ThemedText className={styles.title}>{t("explore.title")}</ThemedText>
            <ThemedText className={styles.subtitle}>{t("explore.subtitle")}</ThemedText>
          </View>

          <View className={cn(styles.searchBox, query.length > 0 && styles.searchBoxActive)}>
            <Search color={query.length > 0 ? Colors.primaryLight : Colors.locked} size={18} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("explore.search_placeholder")}
              placeholderTextColor={Colors.locked}
              selectionColor={Colors.primaryLight}
              className={styles.searchInput}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName={styles.filterList}
          >
            {visibleFilters.map((filter) => {
              const active = filter.key === activeFilterKey;

              return (
                <Pressable
                  key={filter.key}
                  accessibilityRole="button"
                  onPress={() => setActiveFilterKey(filter.key)}
                  className={cn(styles.filterChip, active && styles.filterActive)}
                  style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                >
                  <ThemedText className={cn(styles.filterText, active && styles.filterTextActive)}>
                    {filter.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <ThemedText className={styles.sectionTitle}>{t("explore.featured")}</ThemedText>
              <ThemedText className={styles.resultCount}>
                {t("explore.lessons_count", { count: filteredLessons.length })}
              </ThemedText>
            </View>

            {filteredLessons.length === 0 ? (
              <EmptyState />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName={styles.featuredList}
              >
                {filteredLessons.map((lesson, index) => {
                  const lessonKey =
                    "topicId" in lesson && typeof lesson.topicId === "string"
                      ? lesson.topicId
                      : `${lesson.title}-${index}`;

                  return (
                    <View key={lessonKey} className={styles.featuredCard}>
                      {lesson.image ? (
                        <Image
                          source={lesson.image}
                          contentFit="cover"
                          className={styles.featuredImage}
                        />
                      ) : (
                        <View className={styles.featuredFallback}>
                          <BookOpen color={Colors.locked} size={40} />
                        </View>
                      )}

                      <View className={styles.featuredBody}>
                        <View className={styles.featuredMeta}>
                          <ThemedText className={styles.featuredCategory}>
                            {lesson.category}
                          </ThemedText>
                          <View className={styles.metaDot} />
                          <ThemedText className={styles.featuredDuration}>
                            {lesson.duration}
                          </ThemedText>
                        </View>

                        <ThemedText className={styles.featuredTitle}>{lesson.title}</ThemedText>
                        <ThemedText numberOfLines={2} className={styles.featuredDescription}>
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
                          className={styles.startButton}
                          style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                        >
                          <ThemedText className={styles.startButtonText}>
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
                          className={styles.fullLessonButton}
                          style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                        >
                          <BookOpen color={Colors.primaryLight} size={16} />
                          <ThemedText className={styles.fullLessonButtonText}>
                            {t("explore.button_full")}
                          </ThemedText>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => startLesson(lesson.scenarioRoute)}
                          className={styles.scenarioButton}
                          style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                        >
                          <Sparkles color={Colors.primaryLight} size={16} />
                          <ThemedText className={styles.scenarioButtonText}>
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

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <ThemedText className={styles.sectionTitle}>{t("explore.topics_title")}</ThemedText>
              <ThemedText className={styles.resultCount}>
                {t("explore.topics_count", { count: filteredTopics.length })}
              </ThemedText>
            </View>

            <View className={styles.topicGrid}>
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
                  className={styles.topicCard}
                  style={({ pressed }) => (pressed ? pressedStyle : undefined)}
                >
                  <View className={styles.topicCopy}>
                    <ThemedText className={styles.topicTitle}>{topic.title}</ThemedText>
                    <ThemedText className={styles.topicLessons}>{topic.lessons}</ThemedText>
                  </View>

                  <View className={styles.progressTrack}>
                    <View className={styles.progressFill} style={{ width: `${topic.progress}%` }} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View className={styles.quoteCard}>
            <Sparkles color={Colors.primaryLight} size={16} />
            <View className={styles.quoteCopy}>
              <ThemedText className={styles.quoteText}>{t("explore.quote_text")}</ThemedText>
              <ThemedText className={styles.quoteAuthor}>{t("explore.quote_author")}</ThemedText>
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
    <View className={styles.emptyState}>
      <BookOpen color={Colors.locked} size={28} />
      <ThemedText className={styles.emptyTitle}>{t("explore.empty_title")}</ThemedText>
      <ThemedText className={styles.emptyText}>{t("explore.empty_text")}</ThemedText>
    </View>
  );
}

const pressedStyle = { opacity: 0.78, transform: [{ scale: 0.98 }] };

const styles = {
  screen: "flex-1 bg-[#0C0C0E]",
  safeArea: "flex-1",
  content: "w-full max-w-[820px] self-center gap-3 p-3 pb-[220px]",
  titleBlock: "gap-1",
  title: "font-sans text-[24px] font-extrabold leading-[30px] text-[#E5E1E4]",
  subtitle: "text-[13px] font-semibold leading-[19px] text-[#A1A1AA]",
  searchBox:
    "min-h-[46px] flex-row items-center gap-2 rounded-md border border-transparent bg-[#1E1E22] px-3",
  searchBoxActive: "border-[#D97706]",
  searchInput: "min-h-[44px] flex-1 p-0 font-sans text-[14px] font-semibold text-[#E5E1E4]",
  filterList: "gap-2 pr-3",
  filterChip:
    "min-h-[36px] items-center justify-center rounded-full border border-transparent bg-[#1E1E22] px-3",
  filterActive: "border-[#D97706]",
  filterText: "text-[12px] font-extrabold leading-[16px] text-[#A1A1AA]",
  filterTextActive: "text-[#FFB77D]",
  section: "gap-2",
  sectionHeader: "flex-row items-center justify-between",
  sectionTitle: "font-sans text-[20px] font-extrabold leading-[26px] text-[#E5E1E4]",
  resultCount: "text-[12px] font-extrabold leading-[16px] text-[#FFB77D]",
  featuredList: "gap-3 pr-3",
  featuredCard: "w-[300px] overflow-hidden rounded-md border border-[#27272A] bg-[#18181B]",
  featuredImage: "h-[190px] w-full",
  featuredFallback: "h-[190px] w-full items-center justify-center bg-[#1E1E22]",
  featuredBody: "gap-2 p-3",
  featuredMeta: "flex-row items-center gap-2",
  featuredCategory: "text-[10px] font-black uppercase leading-[14px] text-[#FFB77D]",
  metaDot: "h-1 w-1 rounded-full bg-[#52525B]",
  featuredDuration: "text-[10px] font-bold leading-[14px] text-[#A1A1AA]",
  featuredTitle: "font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]",
  featuredDescription: "text-[13px] font-semibold leading-[19px] text-[#A1A1AA]",
  startButton: "min-h-[42px] flex-row items-center justify-center gap-2 rounded-sm bg-[#D97706]",
  startButtonText: "text-[14px] font-black leading-[18px] text-[#0C0C0E]",
  fullLessonButton:
    "min-h-[42px] flex-row items-center justify-center gap-2 rounded-sm border border-[#D97706]",
  fullLessonButtonText: "text-[14px] font-black leading-[18px] text-[#FFB77D]",
  scenarioButton:
    "min-h-[42px] flex-row items-center justify-center gap-2 rounded-sm border border-[#27272A] bg-[#1E1E22]",
  scenarioButtonText: "text-[14px] font-black leading-[18px] text-[#FFB77D]",
  topicGrid: "flex-row flex-wrap gap-2",
  topicCard:
    "min-h-[128px] w-[48%] justify-between rounded-md border border-[#27272A] bg-[#161618] p-3",
  topicCopy: "gap-0.5",
  topicTitle: "font-sans text-[16px] font-extrabold leading-[21px] text-[#E5E1E4]",
  topicLessons: "text-[12px] font-bold leading-[16px] text-[#A1A1AA]",
  progressTrack: "h-1 overflow-hidden rounded-full bg-[#1E1E22]",
  progressFill: "h-full rounded-full bg-[#D97706]",
  emptyState:
    "min-h-[180px] items-center justify-center gap-1 rounded-md border border-[#27272A] bg-[#161618]",
  emptyTitle: "text-[15px] font-extrabold leading-[20px] text-[#E5E1E4]",
  emptyText: "text-[13px] font-semibold leading-[18px] text-[#A1A1AA]",
  quoteCard: "flex-row gap-2 border-t border-[#27272A] pt-3",
  quoteCopy: "flex-1 gap-1 border-l-2 border-[#D97706] pl-2",
  quoteText: "text-[14px] font-semibold italic leading-[21px] text-[#A1A1AA]",
  quoteAuthor: "text-[12px] font-extrabold uppercase leading-[16px] text-[#FFB77D]",
};
