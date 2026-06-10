import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { quizStyles as styles } from "./ui";

type QuizFiltersProps = {
  activeFilter: string;
  filters: string[];
  onChange: (filter: string) => void;
};

export function QuizFilters({ activeFilter, filters, onChange }: QuizFiltersProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
    >
      {filters.map((filter) => {
        const active = filter === activeFilter;

        return (
          <Pressable
            key={filter}
            accessibilityRole="button"
            onPress={() => onChange(filter)}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
              {t(`quiz.filter_${filter}`)}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
