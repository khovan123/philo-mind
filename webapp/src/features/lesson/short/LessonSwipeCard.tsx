import { Image } from "expo-image";
import { View } from "react-native";

import { StatusBadge } from "@/components/progress";
import { ThemedText } from "@/components/themed-text";
import { Badge, Card } from "@/components/ui";

import { ConceptChip } from "./ConceptChip";
import type { ShortLessonCard } from "./data";
import { styles } from "./ui";

type LessonSwipeCardProps = {
  card: ShortLessonCard;
};

export function LessonSwipeCard({ card }: LessonSwipeCardProps) {
  return (
    <Card style={styles.lessonCard}>
      <Image source={card.image} contentFit="cover" style={styles.cardImage} />
      <View style={styles.cardScrim} />

      <View style={styles.cardMeta}>
        <Badge label={card.eyebrow} style={styles.softBadge} />
        <StatusBadge status="in-progress" label={card.concept} size="sm" />
      </View>

      <View style={styles.cardBody}>
        <ThemedText style={styles.cardTitle}>{card.title}</ThemedText>
        <View style={styles.titleRule} />
        <ThemedText style={styles.cardText}>{card.body}</ThemedText>
      </View>

      {card.conceptLabel ? (
        <View style={styles.conceptBlock}>
          <ThemedText style={styles.metaLabel}>{card.conceptLabel}</ThemedText>
          <ConceptChip label={card.concept} />
        </View>
      ) : null}
    </Card>
  );
}
