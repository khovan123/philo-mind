import { useLocalSearchParams, useRouter } from "expo-router";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  RotateCcw,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Animated, PanResponder } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Pressable, ScrollView, View } from "@/tw";

import {
  lessonCards,
  lessonTitle,
  voteOptions,
  type ScreenState,
  type ShortLessonCard,
  type VoteOption,
} from "@/features/lesson/short/data";
import { FinishedActions } from "@/features/lesson/short/FinishedActions";
import { LessonSwipeCard } from "@/features/lesson/short/LessonSwipeCard";
import { ShortLessonHeader } from "@/features/lesson/short/ShortLessonHeader";
import { StateScaffold } from "@/features/lesson/short/StateScaffold";
import { Colors } from "@/features/lesson/short/ui";
import { VoteCard } from "@/features/lesson/short/VoteCard";
import { FinishedResult, VoteResult } from "@/features/lesson/short/VoteResult";
import {
  useGetShortLessonByIdQuery,
  useListShortLessonsQuery,
} from "@/services/rtk-api/shortLesson.api";
import type { ShortLessonDTO } from "@/types/learning";

export default function ShortLessonScreen() {
  const router = useRouter();
  const { shortLessonId, topicId } = useLocalSearchParams<{
    shortLessonId?: string;
    topicId?: string;
  }>();
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [submittedVoteId, setSubmittedVoteId] = useState<string | null>(null);
  const [translateX] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  const {
    data: shortLessons = [],
    isLoading: isListLoading,
    isError: isListError,
  } = useListShortLessonsQuery({ topicId, limit: 1 }, { skip: !!shortLessonId || !topicId });
  const resolvedShortLessonId = shortLessonId ?? shortLessons[0]?.id;
  const {
    data: apiShortLesson,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch,
  } = useGetShortLessonByIdQuery(resolvedShortLessonId ?? "", { skip: !resolvedShortLessonId });

  const dbLesson = apiShortLesson ?? shortLessons[0] ?? null;
  const mappedCards = useMemo(
    () => (dbLesson ? buildShortLessonCards(dbLesson) : lessonCards),
    [dbLesson],
  );
  const mappedVoteOptions = useMemo(
    () => (dbLesson ? buildVoteOptions(dbLesson) : voteOptions),
    [dbLesson],
  );
  const resolvedTitle = dbLesson?.title ?? lessonTitle;

  const hasCards = mappedCards.length > 0;
  const currentCard = mappedCards[cardIndex];
  const progress = hasCards ? (cardIndex + 1) / mappedCards.length : 0;
  const isVoteCard = currentCard?.type === "vote";
  const submittedOption = useMemo(
    () => mappedVoteOptions.find((option) => option.id === submittedVoteId) ?? null,
    [mappedVoteOptions, submittedVoteId],
  );
  const fallbackOption = submittedOption ?? mappedVoteOptions[0];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isListError || isDetailError) {
        setScreenState("error");
      } else if (isListLoading || isDetailLoading) {
        setScreenState("loading");
      } else {
        setScreenState(dbLesson && hasCards ? "ready" : "empty");
      }
    }, 420);

    return () => clearTimeout(timeout);
  }, [dbLesson, hasCards, isDetailError, isDetailLoading, isListError, isListLoading]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderMove: Animated.event([null, { dx: translateX }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -60) {
            goNext();
            return;
          }

          if (gesture.dx > 60) {
            goPrevious();
            return;
          }

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardIndex, screenState, submittedVoteId, translateX],
  );

  function animateCardChange(nextIndex: number) {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0.4,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: nextIndex > cardIndex ? -24 : 24,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCardIndex(nextIndex);
      translateX.setValue(nextIndex > cardIndex ? 24 : -24);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function goNext() {
    if (screenState !== "ready") {
      return;
    }

    if (isVoteCard && submittedVoteId) {
      setScreenState("finished");
      return;
    }

    if (cardIndex < mappedCards.length - 1) {
      animateCardChange(cardIndex + 1);
    }
  }

  function goPrevious() {
    if (screenState !== "ready") {
      return;
    }

    if (cardIndex === 0) {
      router.back();
      return;
    }

    animateCardChange(cardIndex - 1);
  }

  function submitVote() {
    if (selectedVoteId) {
      setSubmittedVoteId(selectedVoteId);
    }
  }

  function retry() {
    setScreenState("loading");
    void refetch();
    setTimeout(() => setScreenState(dbLesson && hasCards ? "ready" : "empty"), 320);
  }

  function restartLesson() {
    setCardIndex(0);
    setSelectedVoteId(null);
    setSubmittedVoteId(null);
    setScreenState("ready");
  }

  if (screenState === "loading") {
    return (
      <StateScaffold title={lessonTitle}>
        <ActivityIndicator color={Colors.primaryLight} size="large" />
        <ThemedText className={tw.stateTitle}>Đang tải bài học ngắn</ThemedText>
        <ThemedText className={tw.stateText}>
          Đang lấy thẻ bài học và lựa chọn biểu quyết từ cơ sở dữ liệu.
        </ThemedText>
      </StateScaffold>
    );
  }

  if (screenState === "empty") {
    return (
      <StateScaffold title={resolvedTitle}>
        <BookOpen color={Colors.mutedText} size={34} />
        <ThemedText className={tw.stateTitle}>Chưa có bài học ngắn</ThemedText>
        <ThemedText className={tw.stateText}>Chủ đề này chưa có dữ liệu short lesson.</ThemedText>
        <Button title="Quay lại Khám phá" onPress={() => router.push("/(tabs)/explore")} />
      </StateScaffold>
    );
  }

  if (screenState === "error") {
    return (
      <StateScaffold title={resolvedTitle}>
        <RefreshCcw color={Colors.danger} size={34} />
        <ThemedText className={tw.stateTitle}>Không tải được bài học</ThemedText>
        <ThemedText className={tw.stateText}>Thử lại request hoặc quay về Khám phá.</ThemedText>
        <Button title="Thử lại" onPress={retry} />
      </StateScaffold>
    );
  }

  if (screenState === "finished") {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
        <View className={tw.screen}>
          <ShortLessonHeader
            countLabel="4/4 (Done)"
            progress={1}
            title={resolvedTitle}
            onBack={() => setScreenState("ready")}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName={tw.content}>
            <FinishedResult option={fallbackOption} />
            <FinishedActions />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#0C0C0E" }}>
      <View className={tw.screen}>
        <ShortLessonHeader
          countLabel={`${cardIndex + 1}/${mappedCards.length}`}
          progress={progress}
          title={resolvedTitle}
          onBack={goPrevious}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName={tw.content}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              { minHeight: 520 },
              {
                opacity: fade,
                transform: [{ translateX }],
              },
            ]}
          >
            {isVoteCard ? (
              <VoteCard
                voteOptions={mappedVoteOptions}
                selectedVoteId={selectedVoteId}
                submittedVoteId={submittedVoteId}
                onSelect={setSelectedVoteId}
              />
            ) : (
              <LessonSwipeCard card={currentCard} />
            )}
          </Animated.View>

          {submittedVoteId ? <VoteResult option={fallbackOption} /> : null}

          <View className={tw.navigationRow}>
            <Pressable
              accessibilityRole="button"
              onPress={goPrevious}
              className={tw.outlineAction}
              style={({ pressed }) => (pressed ? pressedStyle : undefined)}
            >
              <ChevronLeft color={Colors.secondaryText} size={16} />
              <ThemedText className={tw.outlineActionText}>Trước</ThemedText>
            </Pressable>

            {isVoteCard ? (
              <Pressable
                accessibilityRole="button"
                disabled={!selectedVoteId || !!submittedVoteId}
                onPress={submitVote}
                className={cn(
                  tw.primaryAction,
                  (!selectedVoteId || !!submittedVoteId) && "opacity-45",
                )}
                style={({ pressed }) => (pressed ? pressedStyle : undefined)}
              >
                <ThemedText className={tw.primaryActionText}>
                  {submittedVoteId ? "Đã gửi lựa chọn" : "Gửi lựa chọn"}
                </ThemedText>
                <BarChart3 color={Colors.buttonText} size={16} />
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={goNext}
                className={tw.primaryAction}
                style={({ pressed }) => (pressed ? pressedStyle : undefined)}
              >
                <ThemedText className={tw.primaryActionText}>Tiếp</ThemedText>
                <ChevronRight color={Colors.buttonText} size={16} />
              </Pressable>
            )}
          </View>

          {submittedVoteId ? (
            <View className={tw.navigationRow}>
              <Pressable
                accessibilityRole="button"
                onPress={restartLesson}
                className={tw.outlineAction}
                style={({ pressed }) => (pressed ? pressedStyle : undefined)}
              >
                <RotateCcw color={Colors.secondaryText} size={16} />
                <ThemedText className={tw.outlineActionText}>Xem lại</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setScreenState("finished")}
                className={tw.primaryAction}
                style={({ pressed }) => (pressed ? pressedStyle : undefined)}
              >
                <ThemedText className={tw.primaryActionText}>Hành động tiếp</ThemedText>
                <ChevronRight color={Colors.buttonText} size={16} />
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const pressedStyle = { opacity: 0.78, transform: [{ scale: 0.98 }] };

const tw = {
  safeArea: "flex-1 bg-[#0C0C0E]",
  screen: "flex-1 bg-[#0C0C0E]",
  content: "w-full max-w-[520px] flex-grow self-center gap-3 p-3 pb-[150px]",
  navigationRow: "flex-row gap-2",
  outlineAction:
    "min-h-[54px] flex-1 flex-row items-center justify-center gap-1 rounded-md border border-[#3A3028]",
  outlineActionText: "text-[13px] font-black leading-[18px] text-[#E4E4E7]",
  primaryAction:
    "min-h-[54px] flex-[1.2] flex-row items-center justify-center gap-2 rounded-md bg-[#FFB77D]",
  primaryActionText: "text-[13px] font-black leading-[18px] text-[#0C0C0E]",
  stateTitle: "text-[18px] font-black leading-[24px] text-[#E4E4E7]",
  stateText: "max-w-[300px] text-center text-[14px] font-semibold leading-[20px] text-[#A1A1AA]",
};

const cardImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=900&q=80",
];

function buildShortLessonCards(lesson: ShortLessonDTO): ShortLessonCard[] {
  return [
    {
      id: `${lesson.id}-hook`,
      type: "hook",
      eyebrow: "MỞ ĐẦU",
      title: lesson.title,
      body: lesson.hook,
      concept: "Hook",
      image: cardImages[0],
    },
    {
      id: `${lesson.id}-insight`,
      type: "insight",
      eyebrow: "NHẬN THỨC",
      title: "Điểm chính",
      body: lesson.insight,
      concept: "Khái niệm",
      conceptLabel: "Nội dung cốt lõi",
      image: cardImages[1],
    },
    {
      id: `${lesson.id}-conflict`,
      type: "conflict",
      eyebrow: "MÂU THUẪN",
      title: "Vấn đề cần suy nghĩ",
      body: lesson.conflict,
      concept: "Tranh luận",
      conceptLabel: "Điểm căng thẳng",
      image: cardImages[2],
    },
    {
      id: `${lesson.id}-vote`,
      type: "vote",
      eyebrow: "BÌNH CHỌN",
      title: "Bạn nghiêng về quan điểm nào?",
      body: "Chọn lập trường phù hợp nhất với suy nghĩ hiện tại của bạn.",
      concept: "Phản tư",
      image: cardImages[3],
    },
  ];
}

function buildVoteOptions(lesson: ShortLessonDTO): VoteOption[] {
  const stanceACount = lesson.stats?.stanceACount ?? 0;
  const stanceBCount = lesson.stats?.stanceBCount ?? 0;
  const total = Math.max(stanceACount + stanceBCount, 1);
  const percentA = Math.round((stanceACount / total) * 100);
  const percentB = Math.max(0, 100 - percentA);

  return [
    {
      id: "STANCE_A",
      label: lesson.stanceA,
      percent: percentA,
      explanation: "Quan điểm này nhấn mạnh khả năng chủ động định hình thế giới quan.",
    },
    {
      id: "STANCE_B",
      label: lesson.stanceB,
      percent: percentB,
      explanation: "Quan điểm này nhấn mạnh ảnh hưởng của hoàn cảnh, lịch sử và xã hội.",
    },
  ];
}
