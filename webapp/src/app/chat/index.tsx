/**
 * T-E06: AI Character Gallery & Chat Sessions
 * Closes #88
 *
 * Main chat tab: shows AI philosopher characters to start new conversations,
 * plus a list of existing chat sessions.
 */
import { useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, Clock, MessageCircle, Sparkles, User } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useGetCharactersQuery,
  useListChatSessionsQuery,
  useCreateChatSessionMutation,
  type AiCharacter,
} from "@/services/rtk-api/chatApi";

const CHARACTER_COLORS = [
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#06B6D4", // Cyan
];

function getCharacterColor(index: number) {
  return CHARACTER_COLORS[index % CHARACTER_COLORS.length];
}

export default function ChatGalleryScreen() {
  const router = useRouter();
  const theme = useTheme();

  const {
    data: characters,
    isLoading: loadingChars,
    error: charError,
    refetch: refetchChars,
  } = useGetCharactersQuery();

  const {
    data: sessionsData,
    isLoading: loadingSessions,
    refetch: refetchSessions,
  } = useListChatSessionsQuery();

  const [createSession, { isLoading: creating }] = useCreateChatSessionMutation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchChars(), refetchSessions()]);
    setRefreshing(false);
  }, [refetchChars, refetchSessions]);

  async function handleStartChat(character: AiCharacter) {
    try {
      const session = await createSession({
        characterId: character.id,
        title: `Trò chuyện với ${character.name}`,
      }).unwrap();
      router.push(`/chat/${session.id}` as never);
    } catch {
      // Error handled by RTK Query
    }
  }

  function handleResumeSession(sessionId: string) {
    router.push(`/chat/${sessionId}` as never);
  }

  const sessions = sessionsData?.sessions ?? [];
  const isLoading = loadingChars || loadingSessions;

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/" as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Trò chuyện AI</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Đối thoại với các nhà triết học nổi tiếng
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {/* Error State */}
        {charError && (
          <Card style={styles.errorCard}>
            <AlertCircle color={theme.danger} size={28} />
            <ThemedText type="smallBold">Không thể tải nhân vật</ThemedText>
            <Button title="Thử lại" onPress={() => refetchChars()} variant="outline" />
          </Card>
        )}

        {/* Loading State */}
        {isLoading && !refreshing ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
              Đang tải...
            </ThemedText>
          </View>
        ) : (
          <>
            {/* Character Gallery */}
            <View style={styles.sectionHeader}>
              <Sparkles color={theme.primary} size={18} />
              <ThemedText type="smallBold">Chọn nhân vật để trò chuyện</ThemedText>
            </View>

            {characters && characters.length > 0 && (
              <FlatList
                horizontal
                data={characters}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.charListContent}
                scrollEnabled
                renderItem={({ item, index }) => {
                  const color = getCharacterColor(index);
                  return (
                    <Pressable
                      onPress={() => handleStartChat(item)}
                      disabled={creating}
                      style={({ pressed }) => [
                        styles.charCard,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.charAvatar, { backgroundColor: color + "20" }]}>
                        <User color={color} size={28} />
                      </View>
                      <ThemedText type="smallBold" numberOfLines={1} style={styles.charName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText
                        type="label"
                        themeColor="textSecondary"
                        numberOfLines={2}
                        style={styles.charType}
                      >
                        {item.type}
                      </ThemedText>
                      {item.bio && (
                        <ThemedText
                          type="label"
                          themeColor="textMuted"
                          numberOfLines={2}
                          style={styles.charBio}
                        >
                          {item.bio}
                        </ThemedText>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}

            {/* Existing Sessions */}
            {sessions.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: Spacing.four }]}>
                  <MessageCircle color={theme.primary} size={18} />
                  <ThemedText type="smallBold">Cuộc trò chuyện gần đây</ThemedText>
                </View>

                {sessions.map((session) => (
                  <Pressable
                    key={session.id}
                    onPress={() => handleResumeSession(session.id)}
                    style={({ pressed }) => [
                      styles.sessionCard,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.sessionAvatar, { backgroundColor: theme.primary + "20" }]}>
                      <User color={theme.primary} size={20} />
                    </View>
                    <View style={styles.sessionInfo}>
                      <ThemedText type="smallBold" numberOfLines={1}>
                        {session.title}
                      </ThemedText>
                      <ThemedText type="label" themeColor="textSecondary" numberOfLines={1}>
                        {session.character?.name ?? "AI"} • {formatRelativeTime(session.createdAt)}
                      </ThemedText>
                      {session.lastMessage && (
                        <ThemedText
                          type="label"
                          themeColor="textMuted"
                          numberOfLines={1}
                          style={{ marginTop: 2 }}
                        >
                          {session.lastMessage.message}
                        </ThemedText>
                      )}
                    </View>
                    <Clock color={theme.textMuted} size={14} />
                  </Pressable>
                ))}
              </>
            )}

            {/* Empty State */}
            {!charError && characters?.length === 0 && sessions.length === 0 && (
              <View style={styles.emptyState}>
                <MessageCircle color={theme.textMuted} size={36} />
                <ThemedText
                  type="smallBold"
                  themeColor="textSecondary"
                  style={{ marginTop: Spacing.two }}
                >
                  Chưa có cuộc trò chuyện nào
                </ThemedText>
                <ThemedText type="label" themeColor="textSecondary" style={styles.centerText}>
                  Hãy chọn một nhân vật triết học để bắt đầu.
                </ThemedText>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#353437",
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  charListContent: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  charCard: {
    width: 140,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.one,
  },
  charAvatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  charName: {
    fontSize: 14,
    textAlign: "center",
  },
  charType: {
    fontSize: 11,
    textAlign: "center",
  },
  charBio: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
  sessionAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  errorCard: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  emptyState: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: "center",
  },
});
