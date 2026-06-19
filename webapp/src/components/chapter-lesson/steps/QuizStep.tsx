import { useMemo, useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { Callout, cn, PrimaryButton, StepBadge } from "@/components/chapter-lesson/ChapterLessonUI";
import type { ChapterNode } from "@/services/rtk-api/chapter.api";
import type { ChapterDraftState } from "@/types/chapterLesson";
import { Pressable, View } from "@/tw";

export function QuizStep({
  node,
  initialAnswers,
  initialIndex,
  initialShowResult,
  onProgress,
  onDone,
}: {
  node: ChapterNode;
  initialAnswers?: Record<number, number>;
  initialIndex?: number;
  initialShowResult?: boolean;
  onProgress: (draft: Partial<ChapterDraftState>) => void;
  onDone: (score: number, answers: Record<number, number>) => void;
}) {
  const [index, setIndex] = useState(initialIndex ?? 0);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers ?? {});
  const [showResult, setShowResult] = useState(Boolean(initialShowResult));
  const safeIndex = Math.min(Math.max(index, 0), Math.max(node.quiz.length - 1, 0));
  const question = node.quiz[safeIndex];
  const selected = answers[safeIndex];

  const correctCount = useMemo(
    () => node.quiz.filter((q, itemIndex) => answers[itemIndex] === q.answerIndex).length,
    [answers, node.quiz],
  );

  const done = Object.keys(answers).length === node.quiz.length;

  function countCorrect(nextAnswers: Record<number, number>) {
    return node.quiz.filter((q, itemIndex) => nextAnswers[itemIndex] === q.answerIndex).length;
  }

  function chooseAnswer(optionIndex: number) {
    const nextAnswers = {
      ...answers,
      [safeIndex]: optionIndex,
    };

    setAnswers(nextAnswers);
    onProgress({
      review: { quizAnswers: nextAnswers },
      quizIndex: safeIndex,
      quizScore: countCorrect(nextAnswers),
      quizShowResult: false,
    });
  }

  function nextQuestion() {
    if (safeIndex === node.quiz.length - 1) {
      setShowResult(true);
      onProgress({
        review: { quizAnswers: answers },
        quizIndex: safeIndex,
        quizScore: correctCount,
        quizShowResult: true,
      });
      return;
    }

    const nextIndex = safeIndex + 1;
    setIndex(nextIndex);
    onProgress({
      review: { quizAnswers: answers },
      quizIndex: nextIndex,
      quizScore: correctCount,
      quizShowResult: false,
    });
  }

  if (done && showResult) {
    return (
      <View className="items-center gap-5 pt-4">
        <StepBadge label="Kết quả" />

        <View className="items-center">
          <ThemedText className="text-[44px] font-black leading-[54px] text-[#FF8517]">
            {correctCount}/{node.quiz.length}
          </ThemedText>
          <ThemedText className="text-sm font-semibold text-[#A3A3AF]">câu trả lời đúng</ThemedText>
        </View>

        <ThemedText className="px-5 text-center text-[17px] font-semibold leading-7 text-white">
          Ổn rồi. Giờ thử đứng trước hai quan điểm đối lập.
        </ThemedText>

        <PrimaryButton label="Vào tranh luận →" onPress={() => onDone(correctCount, answers)} />
      </View>
    );
  }

  if (!question) return null;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <StepBadge label="Practice quiz" />
        <ThemedText className="text-sm font-semibold text-[#A3A3AF]">
          {correctCount} đúng
        </ThemedText>
      </View>

      <ThemedText className="text-sm font-medium leading-5 text-[#A3A3AF]">
        Câu {safeIndex + 1}/{node.quiz.length} · {question.type}
      </ThemedText>

      <ThemedText className="text-[17px] font-extrabold leading-7 text-white">
        {question.question}
      </ThemedText>

      <View className="gap-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrect = selected !== undefined && optionIndex === question.answerIndex;
          const isWrong = isSelected && optionIndex !== question.answerIndex;

          return (
            <Pressable
              key={`${option}-${optionIndex}`}
              disabled={selected !== undefined}
              className={cn(
                "min-h-[58px] flex-row items-center gap-4 rounded-2xl border border-[#2D2D39] bg-[#171720] px-4 py-3",
                isCorrect && "border-[#35B779]",
                isWrong && "border-[#E15A5A]",
              )}
              onPress={() => chooseAnswer(optionIndex)}
            >
              <View
                className={cn(
                  "h-8 w-8 items-center justify-center rounded-full border border-[#FF8517]",
                  isCorrect && "border-[#35B779] bg-[#35B779]",
                  isWrong && "border-[#E15A5A] bg-[#E15A5A]",
                )}
              >
                <ThemedText className="text-sm font-extrabold text-[#FF8517]">
                  {String.fromCharCode(65 + optionIndex)}
                </ThemedText>
              </View>

              <ThemedText className="min-w-0 flex-1 text-[16px] font-semibold leading-6 text-white">
                {option}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {selected !== undefined ? (
        <>
          <Callout text={question.explanation} />
          <PrimaryButton
            label={safeIndex === node.quiz.length - 1 ? "Xem kết quả →" : "Câu tiếp →"}
            onPress={nextQuestion}
          />
        </>
      ) : null}
    </View>
  );
}
