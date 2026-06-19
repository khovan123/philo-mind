import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import {
  Callout,
  ChoiceCard,
  cn,
  FloatingNextButton,
  PrimaryButton,
  SecondaryButton,
  StepBadge,
} from "@/components/chapter-lesson/ChapterLessonUI";
import type { ChapterNode } from "@/services/rtk-api/chapter.api";
import type { ChapterReviewState } from "@/types/chapterLesson";
import { Pressable, View } from "@/tw";

export function HookStep({
  node,
  review,
  onChange,
  onDone,
}: {
  node: ChapterNode;
  review: ChapterReviewState;
  onChange: (nextReview: ChapterReviewState) => void;
  onDone: (nextReview: ChapterReviewState) => void;
}) {
  if (node.hook.type === "drag") {
    return (
      <HookDrag
        node={node}
        initialPlacements={review.hookDragPlacements}
        onChange={(hookDragPlacements) => onChange({ hookDragPlacements })}
        onDone={(hookDragPlacements) => onDone({ hookDragPlacements })}
      />
    );
  }

  return (
    <HookChoice
      node={node}
      initialSelected={review.hookChoice}
      onChange={(hookChoice) => onChange({ hookChoice })}
      onDone={(hookChoice) => onDone({ hookChoice })}
    />
  );
}

function HookChoice({
  node,
  initialSelected,
  onChange,
  onDone,
}: {
  node: ChapterNode;
  initialSelected?: "A" | "B" | null;
  onChange: (selected: "A" | "B") => void;
  onDone: (selected: "A" | "B") => void;
}) {
  const [selected, setSelected] = useState<"A" | "B" | null>(initialSelected ?? null);

  if (node.hook.type !== "choice") return null;

  const feedback =
    selected === "A" ? node.hook.feedbackA : selected === "B" ? node.hook.feedbackB : "";

  function selectOption(option: "A" | "B") {
    setSelected(option);
    onChange(option);
  }

  return (
    <View className="gap-4">
      <StepBadge label="Tình huống" />

      <ThemedText className="text-[16px] font-semibold leading-7 text-white">
        {node.hook.situation}
      </ThemedText>

      <ThemedText className="text-[17px] font-extrabold leading-7 text-white">
        {node.hook.question}
      </ThemedText>

      <ChoiceCard
        letter="A"
        text="Có, câu hỏi này đáng đặt ra"
        selected={selected === "A"}
        onPress={() => selectOption("A")}
      />

      <ChoiceCard
        letter="B"
        text="Không chắc, có vẻ hơi xa thực tế"
        selected={selected === "B"}
        onPress={() => selectOption("B")}
      />

      {selected ? (
        <>
          <Callout text={feedback} />
          <FloatingNextButton onPress={() => onDone(selected)} />
        </>
      ) : null}
    </View>
  );
}

function HookDrag({
  node,
  initialPlacements,
  onChange,
  onDone,
}: {
  node: ChapterNode;
  initialPlacements?: Record<number, number>;
  onChange: (placements: Record<number, number>) => void;
  onDone: (placements: Record<number, number>) => void;
}) {
  function shouldStartChecked(placements?: Record<number, number>) {
    return (
      node.hook.type === "drag" &&
      Boolean(placements) &&
      Object.keys(placements ?? {}).length === node.hook.items.length
    );
  }

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [placements, setPlacements] = useState<Record<number, number>>(initialPlacements ?? {});
  const [checked, setChecked] = useState(shouldStartChecked(initialPlacements));

  if (node.hook.type !== "drag") return null;

  const hook = node.hook;
  const pool = hook.items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => placements[index] === undefined);
  const answerMap = new Map(hook.answers.map((answer) => [answer.cardIndex, answer.groupIndex]));
  const allPlaced = pool.length === 0;
  const allCorrect = hook.items.every((_, index) => placements[index] === answerMap.get(index));

  function assign(groupIndex: number) {
    if (selectedItem === null || checked) return;

    const nextPlacements = { ...placements, [selectedItem]: groupIndex };
    setPlacements(nextPlacements);
    onChange(nextPlacements);
    setSelectedItem(null);
  }

  function reset() {
    setPlacements({});
    onChange({});
    setChecked(false);
    setSelectedItem(null);
  }

  return (
    <View className="gap-4">
      <StepBadge label="Hook kéo thả" />

      <ThemedText className="text-[16px] font-semibold leading-7 text-white">
        Chọn từng thẻ rồi đặt vào nhóm phù hợp.
      </ThemedText>

      <View className="min-h-[92px] flex-row flex-wrap gap-2 rounded-2xl border border-dashed border-[#343440] bg-[#171720] p-3">
        {pool.map(({ item, index }) => (
          <Pressable
            key={item}
            className={cn(
              "rounded-full border border-[#343440] px-4 py-2",
              selectedItem === index && "border-[#FF8517] bg-[#2B1B14]",
            )}
            onPress={() => setSelectedItem(index)}
          >
            <ThemedText className="text-sm font-semibold leading-5 text-white">{item}</ThemedText>
          </Pressable>
        ))}
      </View>

      <View className="gap-3">
        {hook.groups.map((group, groupIndex) => (
          <Pressable
            key={group}
            className="min-h-[112px] gap-2 rounded-2xl border border-[#2D2D39] bg-[#171720] p-4"
            onPress={() => assign(groupIndex)}
          >
            <ThemedText className="text-xs font-extrabold uppercase tracking-[0.7px] text-[#FF8517]">
              {group}
            </ThemedText>

            <View className="flex-row flex-wrap gap-2">
              {hook.items.map((item, itemIndex) => {
                if (placements[itemIndex] !== groupIndex) return null;

                const correct = checked && answerMap.get(itemIndex) === groupIndex;
                const wrong = checked && answerMap.get(itemIndex) !== groupIndex;

                return (
                  <View
                    key={item}
                    className={cn(
                      "rounded-full border border-[#343440] bg-[#101018] px-3 py-2",
                      correct && "border-[#35B779]",
                      wrong && "border-[#E15A5A]",
                    )}
                  >
                    <ThemedText className="text-sm font-semibold text-white">{item}</ThemedText>
                  </View>
                );
              })}
            </View>
          </Pressable>
        ))}
      </View>

      {allPlaced && !checked ? (
        <PrimaryButton label="Kiểm tra" onPress={() => setChecked(true)} />
      ) : null}

      {checked ? (
        <>
          <Callout
            text={
              allCorrect
                ? hook.bridge
                : "Một vài thẻ chưa đúng nhóm. Thử phân loại lại để mở khóa phần lý thuyết."
            }
          />
          {allCorrect ? (
            <PrimaryButton label="Thẻ lí thuyết" onPress={() => onDone(placements)} />
          ) : (
            <SecondaryButton label="Làm lại" onPress={reset} />
          )}
        </>
      ) : null}
    </View>
  );
}
