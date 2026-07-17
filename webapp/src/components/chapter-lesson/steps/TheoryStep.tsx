import { useState } from "react";
import { ChevronDown } from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { cn, StepBadge } from "@/components/chapter-lesson/ChapterLessonUI";
import type { ChapterNode, ChapterTheoryCard } from "@/services/rtk-api/chapter.api";
import { Pressable, View } from "@/tw";

function getFallbackTitle(card: ChapterTheoryCard, index: number, total: number) {
  const text = card.body.toLocaleLowerCase("vi-VN");

  if (card.title?.trim()) return card.title.trim();
  if (index === total - 1 || text.includes("tóm lại")) return "Tóm tắt cần nhớ";
  if (index === 0) return "Vấn đề cần hiểu";
  if (text.includes("lưu ý") || text.includes("cần phân biệt")) return "Lưu ý dễ nhầm";
  if (text.includes("quy luật")) return "Quy luật cần nắm";
  if (text.includes("đối tượng nghiên cứu")) return "Khái niệm trọng tâm";

  return `Ý chính ${index + 1}`;
}

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
  const [openIndex, setOpenIndex] = useState(initialIndex ?? 0);
  const safeOpenIndex = Math.min(Math.max(openIndex, 0), Math.max(node.theoryCards.length - 1, 0));

  if (node.theoryCards.length === 0) return null;

  function openCard(nextIndex: number) {
    setOpenIndex(nextIndex);
    onIndexChange(nextIndex);
  }

  return (
    <View className="gap-5">
      <View className="flex-row items-center justify-between">
        <StepBadge label="Lý thuyết" />
        <ThemedText className="text-sm font-semibold text-[#A3A3AF]">
          {node.theoryCards.length} chủ đề
        </ThemedText>
      </View>

      <View className="gap-3">
        {node.theoryCards.map((card, itemIndex) => {
          const open = itemIndex === safeOpenIndex;
          const title = getFallbackTitle(card, itemIndex, node.theoryCards.length);

          return (
            <View
              key={card.id}
              className={cn(
                "overflow-hidden rounded-xl border bg-[#171720]",
                open ? "border-[#FF8517]" : "border-[#2D2D39]",
              )}
            >
              <Pressable
                accessibilityRole="button"
                className="min-h-[64px] flex-row items-center gap-3 px-4 py-3 active:opacity-80"
                onPress={() => openCard(itemIndex)}
              >
                <View
                  className={cn(
                    "h-10 w-10 items-center justify-center rounded-full",
                    open ? "bg-[#4A2A1B]" : "bg-[#242431]",
                  )}
                >
                  <ThemedText
                    className={cn("text-lg font-black", open ? "text-[#FF8517]" : "text-[#A3A3AF]")}
                  >
                    {card.icon || itemIndex + 1}
                  </ThemedText>
                </View>

                <View className="min-w-0 flex-1">
                  <ThemedText className="text-[11px] font-black uppercase leading-4 text-[#FF8517]">
                    Chủ đề {itemIndex + 1}
                  </ThemedText>
                  <ThemedText
                    numberOfLines={2}
                    className="text-[16px] font-extrabold leading-6 text-white"
                  >
                    {title}
                  </ThemedText>
                </View>

                <View
                  style={{
                    transform: [{ rotate: open ? "180deg" : "0deg" }],
                  }}
                >
                  <ChevronDown color={open ? "#FF8517" : "#A3A3AF"} size={20} />
                </View>
              </Pressable>

              {open ? (
                <View className="border-t border-[#2D2D39] px-4 pb-5 pt-4">
                  <ThemedText className="text-[16px] font-semibold leading-7 text-[#F4F4F5]">
                    {card.body}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <Pressable
        className="mt-2 min-h-[50px] items-center justify-center rounded-xl bg-[#FF8517] active:opacity-80"
        onPress={() => onDone(Math.max(safeOpenIndex, 0))}
      >
        <ThemedText className="text-base font-black text-[#101018]">Làm quiz</ThemedText>
      </Pressable>
    </View>
  );
}
