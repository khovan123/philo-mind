import { useEffect, useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { cn, StepBadge } from "@/components/chapter-lesson/ChapterLessonUI";
import type { ChapterNode } from "@/services/rtk-api/chapter.api";
import { Pressable, View } from "@/tw";

export function TheoryStep({
  node,
  initialIndex,
  onIndexChange,
  onDone,
}: {
  node: ChapterNode;
  initialIndex?: number;
  onIndexChange: (index: number) => void;
  onDone: (index: number) => void;
}) {
  const [index, setIndex] = useState(initialIndex ?? 0);
  const safeIndex = Math.min(Math.max(index, 0), Math.max(node.theoryCards.length - 1, 0));
  const card = node.theoryCards[safeIndex];
  const last = safeIndex === node.theoryCards.length - 1;

  useEffect(() => {
    setIndex(initialIndex ?? 0);
  }, [initialIndex]);

  if (!card) return null;

  function changeIndex(nextIndex: number) {
    setIndex(nextIndex);
    onIndexChange(nextIndex);
  }

  return (
    <View className="gap-5">
      <View className="flex-row items-center justify-between">
        <StepBadge label="Theory cards" />
        <ThemedText className="text-sm font-semibold text-[#A3A3AF]">
          Thẻ {safeIndex + 1}/{node.theoryCards.length}
        </ThemedText>
      </View>

      <View className="min-h-[244px] items-center justify-center rounded-2xl border border-[#2D2D39] bg-[#171720] px-7 py-8">
        <View className="mb-7 h-12 w-12 items-center justify-center rounded-full bg-[#4A2A1B]">
          <ThemedText className="text-xl font-black text-[#FF8517]">{card.icon || "?"}</ThemedText>
        </View>

        <ThemedText className="text-center text-[17px] font-extrabold leading-7 text-white">
          {card.body}
        </ThemedText>
      </View>

      <View className="flex-row justify-center gap-2">
        {node.theoryCards.map((item, itemIndex) => (
          <View
            key={item.id}
            className={cn(
              "h-2 w-2 rounded-full bg-[#41414D]",
              itemIndex === safeIndex && "bg-[#FF8517]",
            )}
          />
        ))}
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Pressable
          className="min-h-11 justify-center"
          disabled={safeIndex === 0}
          onPress={() => changeIndex(safeIndex - 1)}
        >
          <ThemedText
            className={cn(
              "text-base font-semibold text-[#A3A3AF]",
              safeIndex === 0 && "text-[#54545F]",
            )}
          >
            ← Thẻ trước
          </ThemedText>
        </Pressable>

        <Pressable
          className="min-h-11 justify-center"
          onPress={() => (last ? onDone(safeIndex) : changeIndex(safeIndex + 1))}
        >
          <ThemedText className="text-base font-extrabold text-[#FF8517]">
            {last ? "Vào quiz →" : "Thẻ tiếp →"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
