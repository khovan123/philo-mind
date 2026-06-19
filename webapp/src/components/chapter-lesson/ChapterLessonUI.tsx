import { ArrowDown } from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { LessonColors } from "@/constants/chapterLesson";
import type { ChapterLessonStep } from "@/types/chapterLesson";
import { Pressable, View } from "@/tw";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function StepBar({ step }: { step: ChapterLessonStep }) {
  return (
    <View className="mt-3 flex-row gap-1.5">
      {[0, 1, 2, 3].map((item) => (
        <View
          key={item}
          className={cn("h-1 flex-1 rounded-full bg-[#282832]", item <= step && "bg-[#FF8517]")}
        />
      ))}
    </View>
  );
}

export function StepBadge({ label }: { label: string }) {
  return (
    <View className="self-start rounded-full bg-[#2B1B14] px-3 py-1.5">
      <ThemedText className="text-xs font-extrabold leading-4 text-[#FF8517]">{label}</ThemedText>
    </View>
  );
}

export function ChoiceCard({
  letter,
  text,
  selected,
  onPress,
}: {
  letter: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "min-h-[58px] flex-row items-center gap-4 rounded-2xl border border-[#2D2D39] bg-[#171720] px-4 py-3",
        selected && "border-[#FF8517] bg-[#211913]",
      )}
      onPress={onPress}
    >
      <View className="h-8 w-8 items-center justify-center rounded-full border border-[#FF8517]">
        <ThemedText className="text-sm font-extrabold text-[#FF8517]">{letter}</ThemedText>
      </View>
      <ThemedText className="min-w-0 flex-1 text-[16px] font-extrabold leading-6 text-white">
        {text}
      </ThemedText>
    </Pressable>
  );
}

export function DebateChoice({
  title,
  text,
  selected,
  onPress,
}: {
  title: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "gap-2 rounded-2xl border border-[#2D2D39] bg-[#171720] p-4",
        selected && "border-[#FF8517] bg-[#211913]",
      )}
      onPress={onPress}
    >
      <ThemedText className="text-sm font-extrabold text-[#FF8517]">{title}</ThemedText>
      <ThemedText className="text-[15px] font-semibold leading-6 text-white">{text}</ThemedText>
    </Pressable>
  );
}

export function Callout({ text }: { text: string }) {
  return (
    <View className="rounded-2xl border border-[#2D2D39] bg-[#171720] p-4">
      <ThemedText className="text-sm font-semibold leading-6 text-[#D7D7E0]">{text}</ThemedText>
    </View>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      className="mt-2 min-h-[56px] flex-row items-center justify-center rounded-2xl bg-[#FF8517] px-5"
      onPress={onPress}
    >
      <ThemedText className="text-[16px] font-extrabold text-[#111111]">{label}</ThemedText>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      className="mt-2 min-h-[52px] items-center justify-center rounded-2xl border border-[#2D2D39] bg-[#171720] px-5"
      onPress={onPress}
    >
      <ThemedText className="text-[15px] font-extrabold text-white">{label}</ThemedText>
    </Pressable>
  );
}

export function FloatingNextButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      className="self-center rounded-full border border-white/10 bg-[#3A3A3A] p-3"
      onPress={onPress}
    >
      <ArrowDown color={LessonColors.text} size={22} />
    </Pressable>
  );
}
