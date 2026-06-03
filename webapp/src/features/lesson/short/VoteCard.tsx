import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Badge, Card } from "@/components/ui";

import { voteImage, type VoteOption } from "./data";
import { styles } from "./ui";

type VoteCardProps = {
  voteOptions: VoteOption[];
  selectedVoteId: string | null;
  submittedVoteId: string | null;
  onSelect: (value: string) => void;
};

export function VoteCard({
  onSelect,
  selectedVoteId,
  submittedVoteId,
  voteOptions,
}: VoteCardProps) {
  return (
    <Card style={styles.voteCard}>
      <View style={styles.voteTitleBlock}>
        <Badge label="VOTE" style={styles.softBadge} />
        <ThemedText style={styles.voteTitle}>What do you think?</ThemedText>
      </View>

      <Image source={voteImage} contentFit="cover" style={styles.voteImage} />

      <View style={styles.voteList}>
        {voteOptions.map((option) => (
          <VoteOptionCard
            key={option.id}
            option={option}
            selected={selectedVoteId === option.id}
            submitted={submittedVoteId === option.id}
            disabled={!!submittedVoteId}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </Card>
  );
}

type VoteOptionCardProps = {
  disabled: boolean;
  onPress: () => void;
  option: VoteOption;
  selected: boolean;
  submitted: boolean;
};

export function VoteOptionCard({
  disabled,
  onPress,
  option,
  selected,
  submitted,
}: VoteOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.voteOption,
        selected && styles.voteOptionSelected,
        submitted && styles.voteOptionSubmitted,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radioOuter, selected && styles.radioSelected]}>
        <View style={[styles.radioInner, selected && styles.radioInnerSelected]} />
      </View>
      <View style={styles.voteOptionCopy}>
        <ThemedText style={[styles.voteOptionText, selected && styles.voteOptionTextSelected]}>
          {option.label}
        </ThemedText>
        {submitted ? (
          <ThemedText style={styles.votePercent}>{option.percent}% of users</ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}
