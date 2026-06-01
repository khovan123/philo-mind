import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Brain,
  Gamepad2,
  Layers3,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useMiniGameStore } from "@/stores/minigame.store";
import { miniGameTypes, type MiniGame, type MiniGameType } from "@/types/minigame";

type FilterType = MiniGameType | "ALL";

const gameTypeCopy: Record<MiniGameType, { label: string; detail: string; color: string }> = {
  matching: { label: "Matching cards", detail: "Ghép cặp khái niệm", color: "#38BDF8" },
  "guess-who": { label: "Portrait quiz", detail: "Đoán nhân vật qua gợi ý", color: "#A78BFA" },
  "logic-puzzle": { label: "Argument sorting", detail: "Sắp xếp lập luận", color: "#34D399" },
};

export default function MiniGamesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { games, filter, loadingList, error, successMessage, loadList, setFilter, retry } =
    useMiniGameStore();

  useEffect(() => {
    loadList();
  }, [loadList]);

  const isEmpty = !loadingList && !error && games.length === 0;

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={theme.text} size={20} />
          </Pressable>
          <View style={styles.topTitle}>
            <ThemedText type="smallBold">MiniGames</ThemedText>
            <ThemedText type="label" themeColor="textMuted">
              score + animation
            </ThemedText>
          </View>
          <Pressable
            disabled={loadingList}
            onPress={retry}
            style={[styles.iconButton, loadingList && styles.disabled]}
          >
            <RefreshCw color={theme.text} size={18} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
              <Gamepad2 color={theme.buttonText} size={24} />
            </View>
            <View style={styles.heroCopy}>
              <ThemedText style={styles.title}>Luyện tư duy bằng mini game</ThemedText>
              <ThemedText style={styles.subtitle}>
                Chọn một game, hoàn thành lượt chơi và xem điểm cùng leaderboard.
              </ThemedText>
            </View>
          </View>

          <View style={[styles.statusStrip, { borderColor: theme.border }]}>
            <ThemedText type="smallBold">{filterLabel(filter)}</ThemedText>
            <ThemedText type="label" themeColor={error ? "danger" : "textMuted"}>
              {error ?? successMessage ?? "Sẵn sàng tải mini game"}
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRail}
          >
            <FilterChip label="Tất cả" active={filter === "ALL"} onPress={() => setFilter("ALL")} />
            {miniGameTypes.map((gameType) => (
              <FilterChip
                key={gameType}
                label={gameTypeCopy[gameType].label}
                active={filter === gameType}
                onPress={() => setFilter(gameType)}
              />
            ))}
          </ScrollView>

          {loadingList ? (
            <StatePanel>
              <ActivityIndicator color={theme.primaryLight} size="large" />
              <ThemedText type="smallBold">Đang tải mini game...</ThemedText>
            </StatePanel>
          ) : null}

          {!loadingList && error ? (
            <StatePanel>
              <RefreshCw color={theme.danger} size={32} />
              <ThemedText type="smallBold">Không tải được mini game</ThemedText>
              <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
                {error}
              </ThemedText>
              <Button title="Thử lại" onPress={retry} />
            </StatePanel>
          ) : null}

          {isEmpty ? (
            <StatePanel>
              <Sparkles color={theme.primaryLight} size={34} />
              <ThemedText type="smallBold">Chưa có mini game</ThemedText>
              <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
                Khi backend seed có game, danh sách này sẽ mở thẳng vào màn hình chơi.
              </ThemedText>
            </StatePanel>
          ) : null}

          {!loadingList && !error
            ? games.map((game) => (
                <MiniGameCard
                  key={game.id}
                  game={game}
                  onPress={() => router.push(`/minigames/${game.id}` as never)}
                />
              ))
            : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function MiniGameCard({ game, onPress }: { game: MiniGame; onPress: () => void }) {
  const theme = useTheme();
  const copy = gameTypeCopy[game.gameType];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.gameIcon, { backgroundColor: copy.color }]}>
        <GameTypeIcon gameType={game.gameType} />
      </View>
      <View style={styles.cardCopy}>
        <ThemedText type="smallBold">{game.title}</ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          {game.description ?? copy.detail}
        </ThemedText>
        <View style={styles.cardMeta}>
          <ThemedText type="label" themeColor="textSecondary">
            {copy.label}
          </ThemedText>
          {game.topic ? (
            <ThemedText type="label" themeColor="textMuted">
              {game.topic.title}
            </ThemedText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText type="label" style={{ color: active ? theme.buttonText : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function GameTypeIcon({ gameType }: { gameType: MiniGameType }) {
  switch (gameType) {
    case "matching":
      return <Layers3 color="#0C0C0E" size={20} />;
    case "guess-who":
      return <Brain color="#0C0C0E" size={20} />;
    case "logic-puzzle":
      return <Trophy color="#0C0C0E" size={20} />;
  }
}

function StatePanel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return <View style={[styles.statePanel, { borderColor: theme.border }]}>{children}</View>;
}

function filterLabel(filter: FilterType) {
  return filter === "ALL" ? "Tất cả mini game" : gameTypeCopy[filter].label;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  topBar: {
    minHeight: 64,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topTitle: { alignItems: "center", gap: 2 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.five, gap: Spacing.three },
  hero: { flexDirection: "row", gap: Spacing.three, alignItems: "center" },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: { flex: 1, gap: Spacing.one },
  title: { fontFamily: Fonts.sans, fontSize: 28, lineHeight: 34, fontWeight: "800" },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 20, color: "#A1A1AA" },
  statusStrip: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  filterRail: { gap: Spacing.two, paddingRight: Spacing.three },
  filterChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  statePanel: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  centerText: { textAlign: "center" },
  card: {
    minHeight: 118,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    flexDirection: "row",
    gap: Spacing.three,
  },
  gameIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: { flex: 1, gap: Spacing.one },
  cardMeta: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.84 },
});
