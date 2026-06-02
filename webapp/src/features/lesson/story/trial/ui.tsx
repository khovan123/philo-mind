import { ChevronRight, RotateCcw } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Fonts, Radius, Spacing } from "@/constants/theme";

import { Colors } from "./data";

export function StatusPill({ label }: { label: string }) {
  return (
    <View style={styles.statusPill}>
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
      <ChevronRight color={Colors.primaryText} size={18} />
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
    >
      <RotateCcw color={Colors.primaryLight} size={16} />
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function InfoCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardBody}>{body}</Text>
      </View>
    </View>
  );
}

export function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.labelValue}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function Metric({
  label,
  value,
  danger,
  success,
}: {
  label: string;
  value: number;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricTrack}>
        <View
          style={[
            styles.metricFill,
            {
              width: `${value}%`,
              backgroundColor: danger
                ? Colors.danger
                : success
                  ? Colors.success
                  : Colors.primaryLight,
            },
          ]}
        />
      </View>
    </View>
  );
}

export function MarkdownBlock({ lines }: { lines: string[] }) {
  return (
    <View style={styles.markdown}>
      {lines.map((line) => {
        if (line.startsWith("## ")) {
          return (
            <Text key={line} style={styles.markdownHeading}>
              {line.replace("## ", "")}
            </Text>
          );
        }

        if (line.startsWith("> ")) {
          return (
            <View key={line} style={styles.quoteBlock}>
              <Text style={styles.quoteBlockText}>{line.replace("> ", "")}</Text>
              <Text style={styles.quoteAuthor}>- Socrates, The Apology</Text>
            </View>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <Text key={line} style={styles.bullet}>
              <Text style={styles.bulletMarker}>• </Text>
              {renderInlineMarkdown(line.replace("- ", ""))}
            </Text>
          );
        }

        return (
          <Text key={line} style={styles.paragraph}>
            {renderInlineMarkdown(line)}
          </Text>
        );
      })}
    </View>
  );
}

function renderInlineMarkdown(value: string) {
  const tokens = value.split(/(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g);

  return tokens.map((token, index) => {
    if (token.startsWith("[[") && token.endsWith("]]")) {
      return (
        <Text key={`${token}-${index}`} style={styles.highlight}>
          {token.slice(2, -2)}
        </Text>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <Text key={`${token}-${index}`} style={styles.bold}>
          {token.slice(2, -2)}
        </Text>
      );
    }

    return token;
  });
}

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: Colors.background,
  },
  topBar: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
  },
  topTitleBlock: {
    flex: 1,
    paddingHorizontal: Spacing.two,
  },
  lessonEyebrow: {
    color: Colors.primaryLight,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  stepText: {
    color: Colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  menuDots: {
    width: 36,
    gap: 3,
    alignItems: "center",
  },
  dotSmall: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
  },
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  stack: {
    gap: Spacing.three,
  },
  heroTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: Colors.mutedStrong,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
  },
  centerTitle: {
    color: Colors.text,
    textAlign: "center",
    fontFamily: Fonts.sans,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  centerSubtitle: {
    color: Colors.primaryLight,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },
  imageCard: {
    minHeight: 230,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  sceneImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.58,
  },
  imageShade: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(12,12,14,0.36)",
  },
  imageCaption: {
    padding: Spacing.three,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
    fontWeight: "800",
  },
  verdictTitle: {
    padding: Spacing.three,
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
  },
  infoCard: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  infoIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.chip,
  },
  infoCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  cardTitle: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  cardBody: {
    color: Colors.mutedStrong,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  optionCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  optionTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  optionMeta: {
    color: Colors.primaryLight,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  labelValue: {
    gap: 2,
  },
  label: {
    color: Colors.primaryLight,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  value: {
    color: Colors.mutedStrong,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  quotePanel: {
    flexDirection: "row",
    padding: Spacing.four,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
  },
  dropCap: {
    color: Colors.primaryLight,
    fontFamily: Fonts.sans,
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "900",
  },
  quoteBody: {
    flex: 1,
    color: Colors.text,
    fontSize: 17,
    lineHeight: 27,
    fontStyle: "italic",
    fontWeight: "700",
  },
  callout: {
    padding: Spacing.four,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  calloutText: {
    color: Colors.primaryLight,
    fontFamily: Fonts.sans,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
  },
  virtueGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  virtueChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    backgroundColor: Colors.chip,
  },
  virtueText: {
    color: Colors.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  decisionCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  decisionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  decisionBody: {
    color: Colors.mutedStrong,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  decisionTag: {
    alignSelf: "flex-end",
    color: Colors.primaryLight,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  radioActive: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.primary,
  },
  metricCard: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  metricRow: {
    gap: Spacing.one,
  },
  metricLabel: {
    color: Colors.mutedStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  metricTrack: {
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: Colors.chip,
  },
  metricFill: {
    height: "100%",
    borderRadius: 999,
  },
  lessonLabel: {
    color: Colors.primaryLight,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  markdown: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  markdownHeading: {
    color: Colors.primaryLight,
    fontFamily: Fonts.sans,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
  },
  paragraph: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
  bullet: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
  },
  bulletMarker: {
    color: Colors.primaryLight,
  },
  bold: {
    color: Colors.text,
    fontWeight: "900",
  },
  highlight: {
    color: Colors.primaryLight,
    fontWeight: "900",
    backgroundColor: "rgba(217,119,6,0.22)",
  },
  quoteBlock: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  quoteBlockText: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 28,
    fontStyle: "italic",
    fontWeight: "900",
  },
  quoteAuthor: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  conceptPanel: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  conceptRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  conceptChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  conceptText: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  actionCard: {
    flex: 1,
    minWidth: "31%",
    minHeight: 74,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  actionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  actionTitle: {
    color: Colors.text,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
  },
  actionMeta: {
    color: Colors.primaryLight,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
  },
  statusPill: {
    alignSelf: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    backgroundColor: Colors.chip,
  },
  statusText: {
    color: Colors.primaryLight,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
  },
  primaryButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
  },
  primaryButtonText: {
    color: Colors.primaryText,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: Colors.primaryLight,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
