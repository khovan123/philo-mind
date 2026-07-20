import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, BookOpen, Search, Sparkles, Play, HelpCircle } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import {
  type ChapterMeta,
  useGetChapterNodesQuery,
  useGetChaptersQuery,
} from "@/services/rtk-api/chapter.api";
import { useSemanticSearchQuery, type SearchResultItem } from "@/services/rtk-api/search.api";
import { Pressable, ScrollView, TextInput, View } from "@/tw";

const CHAPTER_ID = "1";
const MIN_FEATURED_COUNT = 3;

const Colors = {
  locked: "#52525B",
  primaryLight: "#FFB77D",
  primaryText: "#0C0C0E",
};

type ChapterTheoryCard = {
  id: string;
  icon?: string;
  title?: string;
  body: string;
};

type ChapterNodeForExplore = {
  chuong?: number;
  muc: string;
  title: string;
  order: number;
  hookType?: "choice" | "drag";
  theoryCards?: ChapterTheoryCard[];
  completedCount?: number;
};

type ExploreTheoryLesson = {
  chapter: string;
  muc: string;
  title: string;
  order: number;
  completedCount: number;
  theoryCards: ChapterTheoryCard[];
};

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function toSearchText(lesson: ExploreTheoryLesson) {
  return [
    lesson.muc,
    lesson.title,
    ...lesson.theoryCards.map((card) => `${card.icon ?? ""} ${card.title ?? ""} ${card.body}`),
  ]
    .join(" ")
    .toLowerCase();
}

function truncateText(text: string, limit = 120) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function getLessonKey(lesson: ExploreTheoryLesson) {
  return `${lesson.chapter}-${lesson.muc}`;
}

function getProgressWidthClass(progress: number) {
  const progressMap: Record<number, string> = {
    32: "w-[32%]",
    48: "w-[48%]",
    64: "w-[64%]",
    82: "w-[82%]",
  };

  return progressMap[progress] ?? "w-0";
}

export default function ExploreScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"discovery" | "chapters">("discovery");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "lesson" | "video" | "quiz">("all");
  const [selectedLessonKey, setSelectedLessonKey] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const isSearching = debouncedQuery.length > 0;

  const {
    data: searchResults = [],
    isFetching: isSearchingApi,
    isError: isSearchError,
  } = useSemanticSearchQuery(
    { q: debouncedQuery, type: searchFilter },
    { skip: !isSearching },
  );

  const {
    data: chapterData,
    isLoading: isLoadingChapterNodes,
    isError: isChapterNodesError,
    refetch: refetchChapterNodes,
  } = useGetChapterNodesQuery(CHAPTER_ID);

  const {
    data: chapters = [],
    isLoading: isLoadingChapters,
    isError: isChaptersError,
    refetch: refetchChapters,
  } = useGetChaptersQuery();

  const theoryLessons = useMemo<ExploreTheoryLesson[]>(() => {
    const nodes = ((chapterData?.nodes ?? []) as ChapterNodeForExplore[])
      .filter((node) => node.muc && node.title)
      .sort((a, b) => a.order - b.order);

    return nodes
      .map((node) => ({
        chapter: CHAPTER_ID,
        muc: node.muc,
        title: node.title,
        order: node.order,
        completedCount: node.completedCount ?? 0,
        theoryCards: node.theoryCards ?? [],
      }))
      .filter((lesson) => lesson.theoryCards.length > 0);
  }, [chapterData?.nodes]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTheoryLessons = useMemo(() => {
    if (!normalizedQuery) return theoryLessons;

    return theoryLessons.filter((lesson) => toSearchText(lesson).includes(normalizedQuery));
  }, [normalizedQuery, theoryLessons]);

  const featuredLessons = useMemo(() => {
    return theoryLessons
      .filter((lesson) => lesson.completedCount > 0)
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 3);
  }, [theoryLessons]);

  const shouldShowFeatured = featuredLessons.length >= MIN_FEATURED_COUNT;

  const selectedLesson = useMemo(() => {
    if (!selectedLessonKey) return null;

    return theoryLessons.find((lesson) => getLessonKey(lesson) === selectedLessonKey) ?? null;
  }, [selectedLessonKey, theoryLessons]);

  function openLessonDetail(lesson: ExploreTheoryLesson) {
    setSelectedLessonKey(getLessonKey(lesson));
  }

  function openLearnLesson(lesson: ExploreTheoryLesson) {
    router.push({
      pathname: "/chapter/[chapter]/[muc]" as never,
      params: {
        chapter: lesson.chapter,
        muc: lesson.muc,
      },
    });
  }

  function openChapter(chapter: ChapterMeta) {
    router.push({
      pathname: "/(tabs)/learn" as never,
      params: {
        chapter: chapter.id,
      },
    });
  }

  function openSearchResult(item: SearchResultItem) {
    if (item.type === "lesson") {
      router.push({
        pathname: "/chapter/[chapter]/[muc]" as never,
        params: {
          chapter: item.routeParams.chapter,
          muc: item.routeParams.muc,
        },
      });
    } else if (item.type === "video") {
      router.push({
        pathname: "/chapter/[chapter]/[muc]" as never,
        params: {
          chapter: "1",
          muc: item.routeParams.muc,
        },
      });
    } else if (item.type === "quiz") {
      router.push(`/quiz/${item.routeParams.lessonId}` as never);
    }
  }

  if (selectedLesson) {
    return (
      <TheoryDetailScreen
        lesson={selectedLesson}
        onBack={() => setSelectedLessonKey(null)}
        onOpenLesson={() => openLearnLesson(selectedLesson)}
      />
    );
  }

  return (
    <View className="flex-1 bg-[#0C0C0E]">
      <SafeAreaView edges={["top"]} className="flex-1">
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="w-full max-w-[820px] self-center gap-3 p-3 pb-[220px]"
        >
          <View className="gap-1">
            <ThemedText className="font-sans text-[24px] font-extrabold leading-[30px] text-[#E5E1E4]">
              Khám phá
            </ThemedText>

            <ThemedText className="text-[13px] font-semibold leading-[19px] text-[#A1A1AA]">
              Tóm tắt nhanh phần lý thuyết trong từng bài học.
            </ThemedText>
          </View>

          <View
            className={cn(
              "min-h-[46px] flex-row items-center gap-2 rounded-md border border-transparent bg-[#1E1E22] px-3",
              query.length > 0 && "border-[#D97706]",
            )}
          >
            <Search color={query.length > 0 ? Colors.primaryLight : Colors.locked} size={18} />

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm bài học hoặc nội dung lý thuyết..."
              placeholderTextColor={Colors.locked}
              selectionColor={Colors.primaryLight}
              className="min-h-[44px] flex-1 p-0 text-[14px] font-semibold text-[#E5E1E4]"
            />
          </View>

          {isSearching ? (
            <>
              {/* Filter Tabs for Search Results */}
              <View className="flex-row gap-2 my-1">
                {[
                  { label: "Tất cả", value: "all" },
                  { label: "Bài học", value: "lesson" },
                  { label: "Video", value: "video" },
                  { label: "Quiz", value: "quiz" },
                ].map((filter) => (
                  <Pressable
                    key={filter.value}
                    onPress={() => setSearchFilter(filter.value as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border bg-[#1E1E22] border-transparent active:scale-[0.98]",
                      searchFilter === filter.value && "bg-[#D97706]/20 border-[#D97706]",
                    )}
                  >
                    <ThemedText
                      className={cn(
                        "text-[12px] font-bold text-[#A1A1AA]",
                        searchFilter === filter.value && "text-[#FFB77D]",
                      )}
                    >
                      {filter.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              <View className="gap-2 mt-2">
                <ThemedText className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]">
                  Kết quả tìm kiếm ngữ nghĩa
                </ThemedText>
                {isSearchingApi ? (
                  <ActivityIndicator color={Colors.primaryLight} className="py-8" />
                ) : isSearchError ? (
                  <View className="items-center justify-center py-12 bg-[#1E1E22] rounded-md">
                    <ThemedText className="text-[14px] font-bold text-[#EF4444]">
                      Đã xảy ra lỗi khi tìm kiếm ngữ nghĩa.
                    </ThemedText>
                  </View>
                ) : searchResults.length === 0 ? (
                  <View className="items-center justify-center py-12 bg-[#1E1E22] rounded-md">
                    <ThemedText className="text-[14px] font-bold text-[#A1A1AA]">
                      Không tìm thấy kết quả phù hợp
                    </ThemedText>
                  </View>
                ) : (
                  <View className="gap-3">
                    {searchResults.map((item) => (
                      <Pressable
                        key={`${item.type}-${item.id}`}
                        onPress={() => openSearchResult(item)}
                        className="flex-row items-center gap-3 bg-[#1E1E22] p-3 rounded-lg border border-transparent active:border-[#D97706]/40"
                      >
                        <View className="h-10 w-10 items-center justify-center rounded-md bg-[#161618]">
                          {item.type === "lesson" && <BookOpen color={Colors.primaryLight} size={20} />}
                          {item.type === "video" && <Play color="#60A5FA" size={20} />}
                          {item.type === "quiz" && <HelpCircle color="#34D399" size={20} />}
                        </View>
                        <View className="flex-1 gap-0.5">
                          <View className="flex-row items-center justify-between">
                            <ThemedText className="text-[14px] font-extrabold text-[#E5E1E4] max-w-[80%]" numberOfLines={1}>
                              {item.title}
                            </ThemedText>
                            <ThemedText className="text-[10px] font-extrabold text-[#FFB77D] bg-[#D97706]/10 px-1.5 py-0.5 rounded">
                              {item.type === "lesson" ? "Bài học" : item.type === "video" ? "Video" : "Trắc nghiệm"}
                            </ThemedText>
                          </View>
                          <ThemedText className="text-[12px] font-bold text-[#A1A1AA]">
                            {item.subtitle}
                          </ThemedText>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <View className="my-1 flex-row rounded-md bg-[#1E1E22] p-1">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setActiveTab("discovery")}
                  className={cn(
                    "flex-1 items-center justify-center rounded-sm py-2 active:scale-[0.98] active:opacity-80",
                    activeTab === "discovery" && "bg-[#161618]",
                  )}
                >
                  <ThemedText
                    className={cn(
                      "text-[14px] font-bold text-[#A1A1AA]",
                      activeTab === "discovery" && "text-[#FFB77D]",
                    )}
                  >
                    Khám phá
                  </ThemedText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setActiveTab("chapters")}
                  className={cn(
                    "flex-1 items-center justify-center rounded-sm py-2 active:scale-[0.98] active:opacity-80",
                    activeTab === "chapters" && "bg-[#161618]",
                  )}
                >
                  <ThemedText
                    className={cn(
                      "text-[14px] font-bold text-[#A1A1AA]",
                      activeTab === "chapters" && "text-[#FFB77D]",
                    )}
                  >
                    Chương
                  </ThemedText>
                </Pressable>
              </View>

              {activeTab === "discovery" ? (
            <>
              {isLoadingChapterNodes ? (
                <LoadingState text="Đang tải nội dung lý thuyết..." />
              ) : null}

              {isChapterNodesError ? (
                <ErrorState
                  title="Không tải được nội dung"
                  text="Chạm để thử lại."
                  onPress={() => refetchChapterNodes()}
                />
              ) : null}

              {!isLoadingChapterNodes && !isChapterNodesError ? (
                <>
                  {shouldShowFeatured ? (
                    <View className="gap-2">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Sparkles color={Colors.primaryLight} size={16} />
                          <ThemedText className="font-sans text-[20px] font-extrabold leading-[26px] text-[#E5E1E4]">
                            Nổi bật
                          </ThemedText>
                        </View>

                        <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                          Top 3 bài học
                        </ThemedText>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerClassName="gap-3 pr-3"
                      >
                        {featuredLessons.map((lesson) => (
                          <LessonSummaryCard
                            key={`featured-${getLessonKey(lesson)}`}
                            lesson={lesson}
                            onPress={() => openLessonDetail(lesson)}
                            onOpenLesson={() => openLearnLesson(lesson)}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  ) : null}

                  <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                      <ThemedText className="font-sans text-[20px] font-extrabold leading-[26px] text-[#E5E1E4]">
                        Lý thuyết
                      </ThemedText>

                      <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                        {filteredTheoryLessons.length} bài
                      </ThemedText>
                    </View>

                    {filteredTheoryLessons.length === 0 ? (
                      <EmptyState />
                    ) : (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerClassName="gap-3 pr-3"
                      >
                        {filteredTheoryLessons.map((lesson) => (
                          <LessonSummaryCard
                            key={getLessonKey(lesson)}
                            lesson={lesson}
                            onPress={() => openLessonDetail(lesson)}
                            onOpenLesson={() => openLearnLesson(lesson)}
                          />
                        ))}
                      </ScrollView>
                    )}
                  </View>
                  {/* 
                  <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                      <ThemedText className="font-sans text-[20px] font-extrabold leading-[26px] text-[#E5E1E4]">
                        Chủ đề
                      </ThemedText>

                      <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                        4 mục
                      </ThemedText>
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                      <TopicCard title="Khái niệm" subtitle="Thẻ 2" progress={32} />
                      <TopicCard title="Phân tích" subtitle="Thẻ 3" progress={48} />
                      <TopicCard title="Ví dụ" subtitle="Thẻ 4" progress={64} />
                      <TopicCard title="Tóm tắt" subtitle="Thẻ 6" progress={82} />
                    </View>
                  </View> */}
                </>
              ) : null}
            </>
          ) : null}

          {activeTab === "chapters" ? (
            <>
              {isLoadingChapters ? <LoadingState text="Đang tải danh sách chương..." /> : null}

              {isChaptersError ? (
                <ErrorState
                  title="Không tải được danh sách chương"
                  text="Chạm để thử lại."
                  onPress={() => refetchChapters()}
                />
              ) : null}

              {!isLoadingChapters && !isChaptersError ? (
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <ThemedText className="font-sans text-[20px] font-extrabold leading-[26px] text-[#E5E1E4]">
                      Chương
                    </ThemedText>

                    <ThemedText className="text-[12px] font-extrabold leading-[16px] text-[#FFB77D]">
                      {chapters.length} chương
                    </ThemedText>
                  </View>

                  {chapters.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <View className="flex-row flex-wrap gap-2">
                      {chapters.map((chapter) => (
                        <ChapterCard
                          key={chapter.id}
                          chapter={chapter}
                          onPress={() => openChapter(chapter)}
                        />
                      ))}
                    </View>
                  )}
                </View>
              ) : null}
            </>
          ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LessonSummaryCard({
  lesson,
  onPress,
  onOpenLesson,
}: {
  lesson: ExploreTheoryLesson;
  onPress: () => void;
  onOpenLesson: () => void;
}) {
  const pinnedCard = lesson.theoryCards[0];
  const totalCards = lesson.theoryCards.length;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="w-[292px] overflow-hidden rounded-md border border-[#27272A] bg-[#161618] active:scale-[0.98] active:opacity-80"
    >
      <View className="h-[170px] w-full items-center justify-center bg-[#18181B]">
        <BookOpen color={Colors.locked} size={44} />
      </View>

      <View className="gap-2 p-3">
        <View className="flex-row items-center gap-2">
          <ThemedText className="text-[10px] font-black uppercase leading-[14px] text-[#FFB77D]">
            Bài {lesson.muc}
          </ThemedText>
        </View>

        <ThemedText
          numberOfLines={2}
          className="font-sans text-[18px] font-extrabold leading-[24px] text-[#E5E1E4]"
        >
          {lesson.title}
        </ThemedText>

        <ThemedText
          numberOfLines={3}
          className="min-h-[54px] text-[13px] font-semibold leading-[18px] text-[#A1A1AA]"
        >
          {truncateText(pinnedCard?.body ?? "Chưa có nội dung tóm tắt.", 130)}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          className="min-h-[42px] flex-row items-center justify-center gap-2 rounded-sm bg-[#D97706] active:scale-[0.98] active:opacity-80"
          onPress={onPress}
        >
          <ThemedText className="text-[14px] font-black leading-[18px] text-[#0C0C0E]">
            Tóm tắt
          </ThemedText>

          <ArrowRight color={Colors.primaryText} size={16} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          className="min-h-[42px] flex-row items-center justify-center gap-2 rounded-sm border border-[#D97706] active:scale-[0.98] active:opacity-80"
          onPress={onOpenLesson}
        >
          <BookOpen color={Colors.primaryLight} size={16} />

          <ThemedText className="text-[14px] font-black leading-[18px] text-[#FFB77D]">
            Chi tiết bài học
          </ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

function TheoryDetailScreen({
  lesson,
  onBack,
  onOpenLesson,
}: {
  lesson: ExploreTheoryLesson;
  onBack: () => void;
  onOpenLesson: () => void;
}) {
  const pinnedCard = lesson.theoryCards[0];
  const switchCards = lesson.theoryCards.slice(1, 6);
  const [index, setIndex] = useState(0);

  const safeIndex = Math.min(Math.max(index, 0), Math.max(switchCards.length - 1, 0));
  const activeCard = switchCards[safeIndex];

  function previousCard() {
    setIndex((current) => Math.max(current - 1, 0));
  }

  function nextCard() {
    setIndex((current) => Math.min(current + 1, Math.max(switchCards.length - 1, 0)));
  }

  return (
    <View className="flex-1 bg-[#0C0C0E]">
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="min-h-[64px] flex-row items-center gap-2 border-b border-[#18181B] bg-[#0C0C0E] px-3">
          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center active:scale-[0.98] active:opacity-80"
            onPress={onBack}
          >
            <ArrowLeft color={Colors.primaryLight} size={22} />
          </Pressable>

          <View className="min-w-0 flex-1">
            <ThemedText className="text-[11px] font-black uppercase leading-[15px] text-[#FFB77D]">
              Tóm tắt lý thuyết
            </ThemedText>

            <ThemedText
              numberOfLines={1}
              className="font-sans text-[17px] font-extrabold leading-[23px] text-[#E5E1E4]"
            >
              {lesson.title}
            </ThemedText>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="w-full max-w-[820px] self-center gap-3 p-3 pb-[220px]"
        >
          <View className="gap-1">
            <ThemedText className="text-[11px] font-black uppercase leading-[15px] text-[#FFB77D]">
              Bài {lesson.muc}
            </ThemedText>

            <ThemedText className="font-sans text-[22px] font-extrabold leading-[29px] text-[#E5E1E4]">
              {lesson.title}
            </ThemedText>
          </View>

          {pinnedCard ? (
            <View className="gap-2 rounded-md border border-[#D97706] bg-[#24160C] p-3">
              <View className="flex-row gap-2">
                <ThemedText className="text-[20px] leading-[26px]">{pinnedCard.icon}</ThemedText>

                <ThemedText className="flex-1 text-[14px] font-bold leading-[20px] text-[#E5E1E4]">
                  {pinnedCard.body}
                </ThemedText>
              </View>
            </View>
          ) : null}

          {activeCard ? (
            <View className="gap-3 rounded-md border border-[#27272A] bg-[#161618] p-4">
              <View className="flex-row items-center justify-between">
                <ThemedText className="text-[12px] font-bold leading-[16px] text-[#A1A1AA]">
                  {safeIndex + 1}/{switchCards.length}
                </ThemedText>
              </View>

              <View className="items-center justify-center py-6">
                <View className="mb-5 h-14 w-14 items-center justify-center rounded-full bg-[#24160C]">
                  <ThemedText className="text-[24px]">{activeCard.icon || "•"}</ThemedText>
                </View>

                <ThemedText className="text-center text-[17px] font-extrabold leading-7 text-[#E5E1E4]">
                  {activeCard.body}
                </ThemedText>
              </View>

              <View className="flex-row justify-center gap-2">
                {switchCards.map((card, dotIndex) => (
                  <Pressable
                    key={card.id ?? `${lesson.muc}-${dotIndex}`}
                    accessibilityRole="button"
                    className={cn(
                      "h-2 w-2 rounded-full active:scale-[0.98] active:opacity-80",
                      dotIndex === safeIndex ? "bg-[#D97706]" : "bg-[#41414D]",
                    )}
                    onPress={() => setIndex(dotIndex)}
                  />
                ))}
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-1 items-start">
                  {safeIndex > 0 ? (
                    <Pressable
                      accessibilityRole="button"
                      className="min-h-11 justify-center active:scale-[0.98] active:opacity-80"
                      onPress={previousCard}
                    >
                      <ThemedText className="text-[15px] font-semibold text-[#A1A1AA]">
                        ←
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </View>

                <View className="flex-1 items-end">
                  {safeIndex < switchCards.length - 1 ? (
                    <Pressable
                      accessibilityRole="button"
                      className="min-h-11 justify-center active:scale-[0.98] active:opacity-80"
                      onPress={nextCard}
                    >
                      <ThemedText className="text-[15px] font-extrabold text-[#FFB77D]">
                        →
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-md bg-[#D97706] active:scale-[0.98] active:opacity-80"
            onPress={onOpenLesson}
          >
            <ThemedText className="text-[15px] font-black text-[#0C0C0E]">
              Vào bài học đầy đủ
            </ThemedText>

            <ArrowRight color={Colors.primaryText} size={16} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ChapterCard({ chapter, onPress }: { chapter: ChapterMeta; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[128px] w-[48%] justify-between rounded-md border border-[#27272A] bg-[#161618] p-3 active:scale-[0.98] active:opacity-80"
      onPress={onPress}
    >
      <View className="gap-1">
        <ThemedText className="text-[11px] font-black uppercase leading-[15px] text-[#FFB77D]">
          Chương {chapter.id}
        </ThemedText>

        <ThemedText
          numberOfLines={2}
          className="font-sans text-[16px] font-extrabold leading-[21px] text-[#E5E1E4]"
        >
          {chapter.title}
        </ThemedText>
      </View>

      <ThemedText className="text-[12px] font-bold leading-[16px] text-[#A1A1AA]">
        {chapter.nodeCount} bài học
      </ThemedText>

      <View className="h-1 overflow-hidden rounded-full bg-[#1E1E22]">
        <View className="h-full w-1/3 rounded-full bg-[#D97706]" />
      </View>
    </Pressable>
  );
}

function TopicCard({
  title,
  subtitle,
  progress,
}: {
  title: string;
  subtitle: string;
  progress: number;
}) {
  return (
    <View className="min-h-[118px] w-[48%] justify-between rounded-md border border-[#27272A] bg-[#161618] p-3">
      <View>
        <ThemedText className="font-sans text-[16px] font-extrabold leading-[21px] text-[#E5E1E4]">
          {title}
        </ThemedText>

        <ThemedText className="text-[12px] font-bold leading-[16px] text-[#A1A1AA]">
          {subtitle}
        </ThemedText>
      </View>

      <View className="h-1 overflow-hidden rounded-full bg-[#1E1E22]">
        <View className={cn("h-full rounded-full bg-[#D97706]", getProgressWidthClass(progress))} />
      </View>
    </View>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <View className="min-h-[180px] items-center justify-center gap-1 rounded-md border border-[#27272A] bg-[#161618] p-4">
      <ActivityIndicator color={Colors.primaryLight} />

      <ThemedText className="text-[15px] font-extrabold leading-[20px] text-[#E5E1E4]">
        {text}
      </ThemedText>
    </View>
  );
}

function ErrorState({
  title,
  text,
  onPress,
}: {
  title: string;
  text: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[180px] items-center justify-center gap-1 rounded-md border border-[#27272A] bg-[#161618] p-4 active:scale-[0.98] active:opacity-80"
      onPress={onPress}
    >
      <BookOpen color={Colors.locked} size={28} />

      <ThemedText className="text-[15px] font-extrabold leading-[20px] text-[#E5E1E4]">
        {title}
      </ThemedText>

      <ThemedText className="text-center text-[13px] font-semibold leading-[18px] text-[#A1A1AA]">
        {text}
      </ThemedText>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="min-h-[180px] items-center justify-center gap-1 rounded-md border border-[#27272A] bg-[#161618] p-4">
      <BookOpen color={Colors.locked} size={28} />

      <ThemedText className="text-[15px] font-extrabold leading-[20px] text-[#E5E1E4]">
        Chưa có nội dung
      </ThemedText>
    </View>
  );
}
