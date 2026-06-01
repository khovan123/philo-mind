import { Brain, Landmark, ShieldCheck } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { ConceptName, LessonBlock, LessonInline, LessonSection } from "./data";
import { fullLesson } from "./data";
import { Colors, styles } from "./ui";

type FullLessonContentProps = {
  onConceptPress: (concept: ConceptName) => void;
};

const conceptIcons = {
  "Socratic Method": Brain,
  "Moral Integrity": ShieldCheck,
  "Civic Duty": Landmark,
  Impiety: Brain,
} satisfies Record<ConceptName, typeof Brain>;

export function FullLessonContent({ onConceptPress }: FullLessonContentProps) {
  return (
    <>
      {fullLesson.sections.slice(0, 1).map((section) => (
        <LessonSectionView key={section.id} section={section} onConceptPress={onConceptPress} />
      ))}

      <View style={styles.conceptPanel}>
        <ThemedText style={styles.panelLabel}>Core Concepts to Master</ThemedText>
        <View style={styles.conceptGrid}>
          {fullLesson.coreConcepts.map((concept) => {
            const Icon = conceptIcons[concept];

            return (
              <Pressable
                key={concept}
                accessibilityRole="button"
                onPress={() => onConceptPress(concept)}
                style={({ pressed }) => [styles.conceptChip, pressed && styles.pressed]}
              >
                <Icon color={Colors.primaryLight} size={16} />
                <ThemedText style={styles.conceptChipText}>{concept}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {fullLesson.sections.slice(1).map((section) => (
        <LessonSectionView key={section.id} section={section} onConceptPress={onConceptPress} />
      ))}
    </>
  );
}

function LessonSectionView({
  section,
  onConceptPress,
}: {
  section: LessonSection;
  onConceptPress: (concept: ConceptName) => void;
}) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
      {section.blocks.map((block) => (
        <LessonBlockView key={block.id} block={block} onConceptPress={onConceptPress} />
      ))}
    </View>
  );
}

function LessonBlockView({
  block,
  onConceptPress,
}: {
  block: LessonBlock;
  onConceptPress: (concept: ConceptName) => void;
}) {
  if (block.type === "quote") {
    return (
      <View style={styles.quote}>
        <ThemedText style={styles.quoteText}>{`"${block.text}"`}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.paragraph}>
      {block.parts.map((part, index) => (
        <InlinePart key={`${block.id}-${index}`} part={part} onConceptPress={onConceptPress} />
      ))}
    </View>
  );
}

function InlinePart({
  part,
  onConceptPress,
}: {
  part: LessonInline;
  onConceptPress: (concept: ConceptName) => void;
}) {
  if ("concept" in part) {
    return (
      <ThemedText onPress={() => onConceptPress(part.concept)} style={styles.conceptText}>
        {part.text}
      </ThemedText>
    );
  }

  return (
    <ThemedText style={[styles.bodyText, part.type === "italic" && styles.italicText]}>
      {part.text}
    </ThemedText>
  );
}
