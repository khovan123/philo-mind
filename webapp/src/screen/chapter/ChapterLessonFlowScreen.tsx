import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { StepBar } from "@/components/chapter-lesson/ChapterLessonUI";
import { HookStep } from "@/components/chapter-lesson/steps/HookStep";
import { QuizStep } from "@/components/chapter-lesson/steps/QuizStep";
import { TheoryStep } from "@/components/chapter-lesson/steps/TheoryStep";
import { CHAPTER_LESSON_STEP_NAMES, LessonColors } from "@/constants/chapterLesson";
import { useChapterProgress } from "@/features/chapter/progress";
import { useGetChapterNodeQuery, useGetChapterNodesQuery } from "@/services/rtk-api/chapter.api";
import type {
  ChapterDraftState,
  ChapterLessonStep,
  ChapterProgressItem,
  ChapterReviewState,
} from "@/types/chapterLesson";
import { Pressable, SafeAreaView, ScrollView, View } from "@/tw";

const ACCENT = LessonColors.accent;

type FlowStep = ChapterLessonStep;

type FlowState = {
  lessonKey: string;
  hydrated: boolean;
  step: FlowStep;
  quizScore: number;
  reviewState: ChapterReviewState;
};

function toFlowStep(value: unknown): FlowStep {
  return value === 1 || value === 2 ? value : 0;
}

function stepName(step: FlowStep) {
  return CHAPTER_LESSON_STEP_NAMES[step] ?? "Bài học";
}

function createDefaultFlowState(lessonKey: string): FlowState {
  return {
    lessonKey,
    hydrated: false,
    step: 0,
    quizScore: 0,
    reviewState: {},
  };
}

function createHydratedFlowState({
  currentProgress,
  isReplay,
  lessonKey,
}: {
  currentProgress?: ChapterProgressItem;
  isReplay: boolean;
  lessonKey: string;
}): FlowState {
  const draft = currentProgress?.draft;
  const reviewState = currentProgress?.review ?? draft?.review ?? {};

  return {
    lessonKey,
    hydrated: true,
    step: currentProgress?.status === "done" && isReplay ? 0 : toFlowStep(draft?.step),
    quizScore:
      currentProgress?.status === "done" ? (currentProgress.score ?? 0) : (draft?.quizScore ?? 0),
    reviewState,
  };
}

export default function ChapterLessonFlowScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ chapter?: string; muc?: string; replay?: string }>();

  const chapter = Array.isArray(params.chapter) ? params.chapter[0] : params.chapter;
  const muc = Array.isArray(params.muc) ? params.muc[0] : params.muc;
  const replay = Array.isArray(params.replay) ? params.replay[0] : params.replay;
  const isReplay = replay === "1";

  const { data: nodesData } = useGetChapterNodesQuery(chapter ?? "", {
    skip: !chapter,
  });

  const order = nodesData?.order ?? [];

  const {
    data: node,
    isLoading,
    isError,
    refetch,
  } = useGetChapterNodeQuery(
    {
      chapter: chapter ?? "",
      muc: muc ?? "",
    },
    {
      skip: !chapter || !muc,
    },
  );

  const { completeNode, saveNodeDraft, progress, ready } = useChapterProgress(chapter, order);

  const currentProgress = muc ? progress[muc] : undefined;
  const currentDraft = currentProgress?.draft;
  const lessonKey = `${chapter ?? ""}:${muc ?? ""}:${isReplay ? "replay" : "learn"}`;

  const [flowState, setFlowState] = useState<FlowState>(() => createDefaultFlowState(lessonKey));
  const [isRelearning, setIsRelearning] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);

  const isCompletedReview = currentProgress?.status === "done" && isReplay && !isRelearning;

  useEffect(() => {
    setFlowState(createDefaultFlowState(lessonKey));
    setIsRelearning(false);
    setAttemptKey(0);
  }, [lessonKey]);

  useEffect(() => {
    if (!ready || !muc) return;

    setFlowState((current) => {
      if (current.lessonKey !== lessonKey || current.hydrated) {
        return current;
      }

      return createHydratedFlowState({
        currentProgress,
        isReplay,
        lessonKey,
      });
    });
  }, [currentProgress, isReplay, lessonKey, muc, ready]);

  const activeFlowState =
    flowState.lessonKey === lessonKey ? flowState : createDefaultFlowState(lessonKey);

  const { step, quizScore, reviewState } = activeFlowState;

  function persistDraft(next: Partial<ChapterDraftState>) {
    if (!muc || isCompletedReview) return;

    saveNodeDraft(muc, {
      step,
      review: reviewState,
      quizScore,
      ...next,
    });
  }

  function mergeReview(nextReview: ChapterReviewState, nextDraft?: Partial<ChapterDraftState>) {
    const mergedReview = {
      ...reviewState,
      ...nextReview,
    };

    setFlowState((current) => ({
      ...current,
      reviewState: mergedReview,
    }));

    persistDraft({
      review: mergedReview,
      ...nextDraft,
    });

    return mergedReview;
  }

  function moveToStep(nextStep: FlowStep, nextDraft?: Partial<ChapterDraftState>) {
    setFlowState((current) => ({
      ...current,
      step: nextStep,
    }));

    persistDraft({
      step: nextStep,
      ...nextDraft,
    });
  }

  function goToStepFromBar(targetStep: FlowStep) {
    if (!isCompletedReview && targetStep > step) return;

    setFlowState((current) => ({
      ...current,
      step: targetStep,
    }));

    persistDraft({
      step: targetStep,
    });
  }

  function startLearningAgain() {
    setIsRelearning(true);
    setAttemptKey((current) => current + 1);

    setFlowState({
      lessonKey,
      hydrated: true,
      step: 0,
      quizScore: 0,
      reviewState: {},
    });

    if (muc) {
      saveNodeDraft(muc, {
        step: 0,
        review: {},
        quizScore: 0,
        theoryIndex: 0,
        quizIndex: 0,
        quizShowResult: false,
      });
    }
  }

  async function complete(score: number, nextReview?: ChapterReviewState) {
    if (!chapter || !muc) return;

    const finalReview = {
      ...reviewState,
      ...nextReview,
    };

    await completeNode(muc, score, finalReview);

    router.replace({
      pathname: "/(tabs)/learn" as never,
      params: { chapter },
    });
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#242420]">
      <View className="flex-1 items-center">
        <View className="w-full max-w-[430px] flex-1 overflow-hidden rounded-t-[28px] bg-[#101018]">
          <View className="px-5 pb-2 pt-5">
            <View className="flex-row items-center gap-3">
              <Pressable
                className="h-9 w-9 items-center justify-center"
                onPress={() => router.back()}
              >
                <ChevronLeft color={ACCENT} size={24} />
              </Pressable>

              <ThemedText className="min-w-0 flex-1 text-[17px] font-extrabold leading-6 text-white">
                {node?.title ?? "Bài học"}
              </ThemedText>

              {isCompletedReview ? (
                <Pressable
                  className="min-h-9 items-center justify-center rounded-full border border-[#FF8517] px-3"
                  onPress={startLearningAgain}
                >
                  <ThemedText className="text-xs font-extrabold text-[#FF8517]">Học lại</ThemedText>
                </Pressable>
              ) : null}
            </View>

            <ThemedText className="mt-2 text-[13px] font-medium leading-5 text-[#A3A3AF]">
              {isCompletedReview ? `Xem lại · ${stepName(step)}` : stepName(step)}
            </ThemedText>

            <StepBar
              step={step}
              maxPressableStep={isCompletedReview ? 2 : step}
              onStepPress={goToStepFromBar}
            />
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center gap-3 px-6">
              <ActivityIndicator color={ACCENT} />
              <ThemedText className="text-center text-sm font-semibold text-white/60">
                Đang tải bài học từ API...
              </ThemedText>
            </View>
          ) : null}

          {isError ? (
            <Pressable
              className="flex-1 items-center justify-center gap-3 px-6"
              onPress={() => refetch()}
            >
              <ThemedText className="text-center text-base font-extrabold text-white">
                Không tải được bài học
              </ThemedText>
              <ThemedText className="text-center text-sm leading-5 text-white/55">
                Chạm để thử lại.
              </ThemedText>
            </Pressable>
          ) : null}

          {node && ready ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="px-5 pb-12 pt-1">
                {step === 0 ? (
                  <HookStep
                    key={`hook-${chapter}-${muc}-${attemptKey}`}
                    node={node}
                    review={reviewState}
                    onChange={(nextReview) => mergeReview(nextReview, { step: 0 })}
                    onDone={(nextReview) => {
                      const mergedReview = mergeReview(nextReview, { step: 1 });
                      moveToStep(1, { review: mergedReview });
                    }}
                  />
                ) : null}

                {step === 1 ? (
                  <TheoryStep
                    key={`theory-${chapter}-${muc}-${attemptKey}`}
                    node={node}
                    initialIndex={isCompletedReview ? 0 : (currentDraft?.theoryIndex ?? 0)}
                    onIndexChange={(theoryIndex) => {
                      persistDraft({
                        step: 1,
                        theoryIndex,
                      });
                    }}
                    onDone={(theoryIndex) => {
                      moveToStep(2, {
                        theoryIndex,
                        quizIndex: 0,
                        quizShowResult: false,
                      });
                    }}
                  />
                ) : null}

                {step === 2 ? (
                  <QuizStep
                    key={`quiz-${chapter}-${muc}-${attemptKey}`}
                    node={node}
                    initialAnswers={reviewState.quizAnswers}
                    initialIndex={isCompletedReview ? 0 : (currentDraft?.quizIndex ?? 0)}
                    initialShowResult={
                      isCompletedReview ? false : (currentDraft?.quizShowResult ?? false)
                    }
                    readOnly={isCompletedReview}
                    onProgress={(draft) => {
                      persistDraft({
                        step: 2,
                        ...draft,
                      });
                    }}
                    onDone={(score, quizAnswers) => {
                      void complete(score, { quizAnswers });
                    }}
                  />
                ) : null}
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
