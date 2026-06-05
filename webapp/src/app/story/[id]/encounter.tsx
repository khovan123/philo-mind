import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, User } from "lucide-react-native";
import { useState, useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import {
  encounterCatalog,
  defaultEncounterData,
  moralAlignmentLabel,
  moralAlignmentColor,
  moralAlignmentTextColor,
  type NpcCharacter,
  type NpcDialogueChoice,
} from "@/features/story/encounterData";

type EncounterPhase = "select" | "dialogue" | "response" | "completed";

export default function NpcEncounterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  // TODO: swap to RTK Query GET /story-sessions/:id/npc when backend available
  const { data: story, isLoading, error } = useGetStoryDetailQuery(storyId);
  const { setNpcEncounterCompleted } = useStoryStore();

  const [phase, setPhase] = useState<EncounterPhase>("select");
  const [selectedNpcIndex, setSelectedNpcIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<NpcDialogueChoice | null>(null);

  const encounterData = useMemo(() => {
    if (!story) return null;
    return encounterCatalog[story.title] ?? defaultEncounterData(story.title);
  }, [story]);

  const selectedNpc: NpcCharacter | undefined = encounterData?.npcCharacters[selectedNpcIndex];

  const handleSelectNpc = (index: number) => {
    setSelectedNpcIndex(index);
  };

  const handleStartDialogue = () => {
    setPhase("dialogue");
    setSelectedChoice(null);
  };

  const handleSelectChoice = (choice: NpcDialogueChoice) => {
    setSelectedChoice(choice);
    setPhase("response");
  };

  const handleContinue = () => {
    setPhase("select");
    setSelectedChoice(null);
  };

  const handleComplete = () => {
    setNpcEncounterCompleted(true);
    router.push(`/story/${storyId}/dilemma` as never);
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
            Đang tải nhân vật gặp gỡ...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error || !story || !encounterData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ThemedText type="subtitle" style={{ color: theme.danger }}>
            Không thể tải màn gặp gỡ
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", marginVertical: Spacing.three }}
          >
            Đã xảy ra lỗi khi tải dữ liệu NPC. Vui lòng quay lại.
          </ThemedText>
          <Button
            title="Quay lại bản đồ"
            onPress={() => router.replace(`/story/${storyId}/map` as never)}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace(`/story/${storyId}/map` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Gặp Gỡ NPC</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 7/13 • {story.title}
          </ThemedText>
        </View>
        {phase === "response" && (
          <Pressable
            accessibilityRole="button"
            onPress={handleComplete}
            style={[styles.skipButton, { backgroundColor: "rgba(217,119,6,0.1)" }]}
          >
            <ThemedText type="label" style={{ color: theme.primary, fontWeight: "700" }}>
              Hoàn thành
            </ThemedText>
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Phase: NPC Selection ─────────────────────────────────────── */}
        {phase === "select" && (
          <View style={styles.phaseContainer}>
            <ThemedText type="subtitle" style={styles.phaseTitle}>
              Chọn nhân vật để trò chuyện
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.phaseDesc}>
              Mỗi nhân vật mang một quan điểm triết học khác nhau. Cuộc trò chuyện sẽ thử thách tư
              duy của bạn.
            </ThemedText>

            {encounterData.npcCharacters.map((npc, index) => {
              const isSelected = index === selectedNpcIndex;
              return (
                <Pressable
                  key={npc.id}
                  accessibilityRole="button"
                  onPress={() => handleSelectNpc(index)}
                  style={[
                    styles.npcCard,
                    {
                      borderColor: isSelected ? npc.accentColor : theme.border,
                      backgroundColor: isSelected
                        ? `${npc.accentColor}10`
                        : theme.backgroundElement,
                      // glow selection (acceptance criteria)
                      shadowColor: isSelected ? npc.accentColor : "transparent",
                      shadowOpacity: isSelected ? 0.35 : 0,
                      shadowRadius: isSelected ? 12 : 0,
                      elevation: isSelected ? 8 : 2,
                    },
                  ]}
                >
                  {/* Tag badge (acceptance criteria) */}
                  <View style={styles.npcBadgeRow}>
                    <View style={[styles.tagBadge, { backgroundColor: `${npc.accentColor}20` }]}>
                      <ThemedText
                        type="label"
                        style={{ color: npc.accentColor, fontWeight: "800", fontSize: 10 }}
                      >
                        NHÂN VẬT
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <View style={[styles.tagBadge, { backgroundColor: "rgba(217,119,6,0.15)" }]}>
                        <ThemedText
                          type="label"
                          style={{ color: theme.primary, fontWeight: "800", fontSize: 10 }}
                        >
                          ĐANG CHỌN
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  <View style={styles.npcIdentity}>
                    <View
                      style={[
                        styles.npcAvatar,
                        { backgroundColor: `${npc.accentColor}20`, borderColor: npc.accentColor },
                      ]}
                    >
                      <User color={npc.accentColor} size={22} />
                    </View>
                    <View style={styles.npcIdentityText}>
                      <ThemedText style={[styles.npcName, { color: theme.text }]}>
                        {npc.name}
                      </ThemedText>
                      <ThemedText type="label" themeColor="textSecondary">
                        {npc.role}
                      </ThemedText>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.stanceBox,
                      { backgroundColor: "rgba(255,255,255,0.03)", borderColor: theme.border },
                    ]}
                  >
                    <ThemedText
                      type="label"
                      style={{ color: npc.accentColor, fontWeight: "700", marginBottom: 2 }}
                    >
                      Quan điểm
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {npc.stance}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}

            <Button
              title={`Bắt đầu trò chuyện với ${selectedNpc?.name ?? "nhân vật"}`}
              onPress={handleStartDialogue}
              fullWidth
              style={{ marginTop: Spacing.two }}
            />
          </View>
        )}

        {/* ─── Phase: Dialogue Choices ──────────────────────────────────── */}
        {phase === "dialogue" && selectedNpc && (
          <View style={styles.phaseContainer}>
            {/* NPC opener bubble */}
            <View style={styles.npcBubbleRow}>
              <View
                style={[
                  styles.npcAvatarSm,
                  {
                    backgroundColor: `${selectedNpc.accentColor}20`,
                    borderColor: selectedNpc.accentColor,
                  },
                ]}
              >
                <User color={selectedNpc.accentColor} size={16} />
              </View>
              <View style={styles.npcBubbleWrap}>
                <ThemedText
                  type="label"
                  style={{ color: selectedNpc.accentColor, fontWeight: "700", marginBottom: 4 }}
                >
                  {selectedNpc.name} · {selectedNpc.role}
                </ThemedText>
                <Card
                  style={[
                    styles.speechBubble,
                    {
                      backgroundColor: `${selectedNpc.accentColor}10`,
                      borderColor: `${selectedNpc.accentColor}40`,
                    },
                  ]}
                >
                  <MessageCircle
                    size={14}
                    color={selectedNpc.accentColor}
                    style={{ marginBottom: 4 }}
                  />
                  <ThemedText type="small" style={{ lineHeight: 20 }}>
                    {selectedNpc.dialogueOpener}
                  </ThemedText>
                </Card>
              </View>
            </View>

            {/* Choices */}
            <ThemedText
              type="smallBold"
              style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}
            >
              Bạn trả lời:
            </ThemedText>

            {selectedNpc.choices.map((choice) => (
              <Pressable
                key={choice.id}
                accessibilityRole="button"
                onPress={() => handleSelectChoice(choice)}
                style={[
                  styles.choiceButton,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.backgroundElement,
                  },
                ]}
              >
                {/* Tag badges on choices (acceptance criteria) */}
                <View style={styles.choiceTagRow}>
                  {choice.tags.map((tag) => (
                    <View
                      key={tag}
                      style={[
                        styles.tagBadge,
                        { backgroundColor: moralAlignmentColor[choice.moralAlignment] },
                      ]}
                    >
                      <ThemedText
                        type="label"
                        style={{
                          color: moralAlignmentTextColor[choice.moralAlignment],
                          fontWeight: "800",
                          fontSize: 10,
                        }}
                      >
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                {/* min 20 chars enforced in data (acceptance criteria) */}
                <ThemedText type="small" style={{ lineHeight: 20 }}>
                  {choice.text}
                </ThemedText>
              </Pressable>
            ))}

            <Button
              title="← Đổi nhân vật"
              onPress={() => setPhase("select")}
              variant="outline"
              style={{ marginTop: Spacing.three }}
            />
          </View>
        )}

        {/* ─── Phase: NPC Response ─────────────────────────────────────── */}
        {phase === "response" && selectedNpc && selectedChoice && (
          <View style={styles.phaseContainer}>
            {/* User choice recap */}
            <Card
              style={[
                styles.userChoiceCard,
                { backgroundColor: "rgba(255,255,255,0.04)", borderColor: theme.border },
              ]}
            >
              <ThemedText type="label" themeColor="textSecondary" style={{ marginBottom: 4 }}>
                Bạn đã nói:
              </ThemedText>
              <ThemedText type="small" style={{ lineHeight: 20 }}>
                {selectedChoice.text}
              </ThemedText>
            </Card>

            {/* Moral alignment badge */}
            <View style={styles.alignmentRow}>
              <View
                style={[
                  styles.tagBadgeLg,
                  { backgroundColor: moralAlignmentColor[selectedChoice.moralAlignment] },
                ]}
              >
                <ThemedText
                  type="label"
                  style={{
                    color: moralAlignmentTextColor[selectedChoice.moralAlignment],
                    fontWeight: "800",
                  }}
                >
                  Lập trường: {moralAlignmentLabel[selectedChoice.moralAlignment]}
                </ThemedText>
              </View>
            </View>

            {/* NPC response bubble */}
            <View style={styles.npcBubbleRow}>
              <View
                style={[
                  styles.npcAvatarSm,
                  {
                    backgroundColor: `${selectedNpc.accentColor}20`,
                    borderColor: selectedNpc.accentColor,
                  },
                ]}
              >
                <User color={selectedNpc.accentColor} size={16} />
              </View>
              <View style={styles.npcBubbleWrap}>
                <ThemedText
                  type="label"
                  style={{ color: selectedNpc.accentColor, fontWeight: "700", marginBottom: 4 }}
                >
                  {selectedNpc.name} phản hồi:
                </ThemedText>
                <Card
                  style={[
                    styles.speechBubble,
                    {
                      backgroundColor: `${selectedNpc.accentColor}10`,
                      borderColor: `${selectedNpc.accentColor}40`,
                    },
                  ]}
                >
                  <ThemedText type="small" style={{ lineHeight: 20 }}>
                    {selectedChoice.responseText}
                  </ThemedText>
                </Card>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.responseActions}>
              <Button
                title="Tiếp tục trò chuyện"
                onPress={handleContinue}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button title="Tiến đến Tình Huống" onPress={handleComplete} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        {/* ─── Phase: Completed ─────────────────────────────────────────── */}
        {phase === "completed" && (
          <View style={styles.phaseContainer}>
            <View style={styles.completedIcon}>
              <CheckCircle2 color={theme.success} size={52} />
            </View>
            <ThemedText type="subtitle" style={styles.completedTitle}>
              Gặp gỡ hoàn tất!
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={{ textAlign: "center", lineHeight: 20 }}
            >
              Bạn đã hoàn thành cuộc đối thoại với NPC. Hãy tiến đến Tình Huống Nan Giải để đưa ra
              quyết định đạo đức.
            </ThemedText>
            <Button
              title="Tiến đến Tình Huống →"
              onPress={() => router.push(`/story/${storyId}/dilemma` as never)}
              fullWidth
              style={{ marginTop: Spacing.four }}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA for select phase */}
      {phase === "select" && (
        <View style={[styles.bottomBar, { borderColor: theme.border }]}>
          <ThemedText type="label" themeColor="textSecondary" style={{ flex: 1 }}>
            {encounterData.npcCharacters.length} nhân vật có thể gặp
          </ThemedText>
          <Pressable accessibilityRole="button" onPress={handleComplete} style={[styles.skipLink]}>
            <ThemedText type="label" style={{ color: theme.textMuted }}>
              Bỏ qua
            </ThemedText>
            <ArrowRight color={theme.textMuted} size={14} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  skipButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.six,
  },
  phaseContainer: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  phaseTitle: {
    fontWeight: "900",
    marginBottom: Spacing.one,
  },
  phaseDesc: {
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  // NPC Card
  npcCard: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowOffset: { width: 0, height: 4 },
  },
  npcBadgeRow: {
    flexDirection: "row",
    gap: Spacing.one,
    flexWrap: "wrap",
  },
  tagBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  tagBadgeLg: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
  },
  npcIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  npcAvatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  npcIdentityText: {
    flex: 1,
    gap: 2,
  },
  npcName: {
    fontSize: 17,
    fontWeight: "800",
  },
  stanceBox: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  // Dialogue
  npcBubbleRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
    marginTop: Spacing.two,
  },
  npcAvatarSm: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  npcBubbleWrap: {
    flex: 1,
  },
  speechBubble: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  choiceButton: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  choiceTagRow: {
    flexDirection: "row",
    gap: Spacing.one,
    flexWrap: "wrap",
    marginBottom: Spacing.one,
  },
  // Response
  userChoiceCard: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  alignmentRow: {
    flexDirection: "row",
    marginVertical: Spacing.one,
  },
  responseActions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  // Completed
  completedIcon: {
    alignItems: "center",
    marginBottom: Spacing.three,
    marginTop: Spacing.four,
  },
  completedTitle: {
    textAlign: "center",
    fontWeight: "900",
    marginBottom: Spacing.two,
  },
  // Bottom bar
  bottomBar: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
  },
  skipLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
