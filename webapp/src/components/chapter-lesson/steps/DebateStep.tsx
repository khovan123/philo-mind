import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import {
  Callout,
  DebateChoice,
  PrimaryButton,
  StepBadge,
} from "@/components/chapter-lesson/ChapterLessonUI";
import type { ChapterNode } from "@/services/rtk-api/chapter.api";
import { View } from "@/tw";

export function DebateStep({
  node,
  score,
  initialChoice,
  onChange,
  onDone,
}: {
  node: ChapterNode;
  score: number;
  initialChoice?: "A" | "B" | null;
  onChange: (selected: "A" | "B") => void;
  onDone: (score: number, selected: "A" | "B") => void;
}) {
  const [selected, setSelected] = useState<"A" | "B" | null>(initialChoice ?? null);

  function selectOption(option: "A" | "B") {
    setSelected(option);
    onChange(option);
  }

  const selectedExplanation =
    selected === "A"
      ? node.debate.explanationA || node.debate.perspectiveA
      : selected === "B"
        ? node.debate.explanationB || node.debate.perspectiveB
        : "";

  return (
    <View className="gap-4">
      <StepBadge label="Debate card" />

      <ThemedText className="text-[17px] font-extrabold leading-7 text-white">
        Bạn đồng ý hơn với quan điểm nào?
      </ThemedText>

      <DebateChoice
        title="Quan điểm A"
        text={node.debate.perspectiveA}
        selected={selected === "A"}
        onPress={() => selectOption("A")}
      />

      <DebateChoice
        title="Quan điểm B"
        text={node.debate.perspectiveB}
        selected={selected === "B"}
        onPress={() => selectOption("B")}
      />

      {selected ? <Callout text={selectedExplanation} /> : null}

      <View className="mt-2 h-px bg-[#2D2D39]" />

      <View className="gap-2">
        <ThemedText className="text-sm font-medium text-[#A3A3AF]">Câu hỏi mở</ThemedText>
        <ThemedText className="text-[16px] font-extrabold leading-7 text-white">
          {node.debate.openQuestion}
        </ThemedText>
      </View>

      {selected ? (
        <PrimaryButton label="Hoàn thành bài →" onPress={() => onDone(score, selected)} />
      ) : null}
    </View>
  );
}
