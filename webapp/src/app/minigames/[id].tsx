import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, GripVertical, RefreshCw, Trophy } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MiniGameResult } from "@/components/minigame-result";
import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useMiniGameStore } from "@/stores/minigame.store";
import type { LogicPuzzleItem, MatchingPair, MiniGame, MiniGameAnswers } from "@/types/minigame";

const FALLBACK_LOGIC_ITEMS: LogicPuzzleItem[] = [
  { id: "premise-1", text: "Nếu một lập luận hợp lệ thì kết luận đi theo tiền đề." },
  { id: "premise-2", text: "Lập luận này có tiền đề đúng và cấu trúc hợp lệ." },
  { id: "conclusion", text: "Vì vậy kết luận có lý do để được chấp nhận." },
];

export default function MiniGamePlayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const {
    game,
    leaderboard,
    playResult,
    loadingGame,
    submitting,
    error,
    successMessage,
    loadGame,
    submitAttempt,
    resetAttempt,
    retry,
  } = useMiniGameStore();
  const startedAt = useRef(0);

  useEffect(() => {
    if (id) {
      startedAt.current = Date.now();
      loadGame(id);
    }
  }, [id, loadGame]);

  function replay() {
    resetAttempt();
    startedAt.current = Date.now();
  }

  async function submit(answers: MiniGameAnswers) {
    await submitAttempt(answers, Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)));
  }

  if (loadingGame) {
    return (
      <GameState title="MiniGame">
        <ActivityIndicator color={theme.primaryLight} size="large" />
        <ThemedText type="smallBold">Đang tải mini game...</ThemedText>
        <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
          Chuẩn bị config, luật chơi và leaderboard.
        </ThemedText>
      </GameState>
    );
  }

  if (error && !game) {
    return (
      <GameState title="MiniGame">
        <RefreshCw color={theme.danger} size={34} />
        <ThemedText type="smallBold">Không tải được mini game</ThemedText>
        <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
          {error}
        </ThemedText>
        <Button title="Thử lại" onPress={retry} />
      </GameState>
    );
  }

  if (!game) {
    return (
      <GameState title="MiniGame">
        <Trophy color={theme.primaryLight} size={34} />
        <ThemedText type="smallBold">Không có mini game</ThemedText>
        <Button title="Về danh sách" onPress={() => router.push("/minigames" as never)} />
      </GameState>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={theme.text} size={20} />
          </Pressable>
          <View style={styles.topTitle}>
            <ThemedText type="smallBold">MiniGame</ThemedText>
            <ThemedText type="label" themeColor="textMuted">
              {game.gameType}
            </ThemedText>
          </View>
          <Pressable disabled={loadingGame} onPress={retry} style={styles.iconButton}>
            <RefreshCw color={theme.text} size={18} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <ThemedText style={styles.title}>{game.title}</ThemedText>
            <ThemedText style={styles.subtitle}>
              {game.description ?? "Hoàn thành thử thách để ghi điểm vào leaderboard."}
            </ThemedText>
          </View>

          <View style={[styles.statusStrip, { borderColor: theme.border }]}>
            <ThemedText type="smallBold">{gameTypeLabel(game)}</ThemedText>
            <ThemedText type="label" themeColor={error ? "danger" : "textMuted"}>
              {error ?? successMessage ?? "Sẵn sàng chơi"}
            </ThemedText>
          </View>

          {playResult ? (
            <MiniGameResult
              leaderboard={leaderboard}
              result={playResult}
              onReplay={replay}
              onBack={() => router.push("/minigames" as never)}
            />
          ) : (
            <GameRenderer game={game} submitting={submitting} onSubmit={submit} />
          )}

          {!playResult ? <LeaderboardPreview leaderboard={leaderboard} /> : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function GameRenderer({
  game,
  submitting,
  onSubmit,
}: {
  game: MiniGame;
  submitting: boolean;
  onSubmit: (answers: MiniGameAnswers) => void;
}) {
  switch (game.gameType) {
    case "matching":
      return <MatchingGame game={game} submitting={submitting} onSubmit={onSubmit} />;
    case "guess-who":
      return <PortraitQuiz game={game} submitting={submitting} onSubmit={onSubmit} />;
    case "logic-puzzle":
      return <ArgumentSorting game={game} submitting={submitting} onSubmit={onSubmit} />;
  }
}

function MatchingGame({
  game,
  submitting,
  onSubmit,
}: {
  game: MiniGame;
  submitting: boolean;
  onSubmit: (answers: MiniGameAnswers) => void;
}) {
  const theme = useTheme();
  const pairs = useMemo(() => normalizePairs(game.config?.pairs ?? []), [game.config?.pairs]);
  const rightOptions = useMemo(
    () => pairs.map((pair) => pair.right).sort((a, b) => a.localeCompare(b)),
    [pairs],
  );
  const [matches, setMatches] = useState<Record<string, string>>({});
  const canSubmit = pairs.length > 0 && pairs.every((pair) => matches[pair.left]);

  if (pairs.length === 0) {
    return <EmptyGameState message="Game matching chưa có cặp dữ liệu để chơi." />;
  }

  return (
    <View style={styles.gamePanel}>
      <ThemedText type="smallBold">Matching cards</ThemedText>
      {pairs.map((pair) => (
        <View key={pair.left} style={[styles.matchRow, { borderColor: theme.border }]}>
          <ThemedText type="small" style={styles.matchLeft}>
            {pair.left}
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionRail}
          >
            {rightOptions.map((option) => {
              const active = matches[pair.left] === option;
              return (
                <Pressable
                  key={option}
                  disabled={submitting}
                  onPress={() => setMatches((current) => ({ ...current, [pair.left]: option }))}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: active ? theme.primary : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                    },
                    submitting && styles.disabled,
                  ]}
                >
                  <ThemedText
                    type="label"
                    style={{ color: active ? theme.buttonText : theme.text }}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ))}
      <Button
        disabled={!canSubmit}
        loading={submitting}
        title="Nộp cặp ghép"
        onPress={() =>
          onSubmit({
            matches: pairs.map((pair) => ({ left: pair.left, right: matches[pair.left] })),
          })
        }
      />
    </View>
  );
}

function PortraitQuiz({
  game,
  submitting,
  onSubmit,
}: {
  game: MiniGame;
  submitting: boolean;
  onSubmit: (answers: MiniGameAnswers) => void;
}) {
  const theme = useTheme();
  const characters = game.config?.characters ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const canSubmit =
    characters.length > 0 && characters.every((character) => answers[character.name]?.trim());

  if (characters.length === 0) {
    return <EmptyGameState message="Portrait quiz chưa có nhân vật để đoán." />;
  }

  return (
    <View style={styles.gamePanel}>
      <ThemedText type="smallBold">Portrait quiz</ThemedText>
      {characters.map((character, index) => (
        <View key={character.name} style={[styles.characterCard, { borderColor: theme.border }]}>
          <ThemedText type="smallBold">{character.name}</ThemedText>
          {(character.hints ?? []).slice(0, 4).map((hint, hintIndex) => (
            <ThemedText key={`${character.name}-${hintIndex}`} type="small" themeColor="textMuted">
              {hintIndex + 1}. {hint}
            </ThemedText>
          ))}
          <TextInput
            editable={!submitting}
            onChangeText={(value) =>
              setAnswers((current) => ({ ...current, [character.name]: value }))
            }
            placeholder={`Đáp án nhân vật ${index + 1}`}
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface },
            ]}
            value={answers[character.name] ?? ""}
          />
        </View>
      ))}
      <Button
        disabled={!canSubmit}
        loading={submitting}
        title="Nộp đáp án"
        onPress={() =>
          onSubmit({
            characterAnswers: characters.map((character) => ({
              name: character.name,
              answer: answers[character.name] ?? "",
            })),
          })
        }
      />
    </View>
  );
}

function ArgumentSorting({
  game,
  submitting,
  onSubmit,
}: {
  game: MiniGame;
  submitting: boolean;
  onSubmit: (answers: MiniGameAnswers) => void;
}) {
  const theme = useTheme();
  const initialItems = game.config?.items?.length ? game.config.items : FALLBACK_LOGIC_ITEMS;
  const [items, setItems] = useState(initialItems);

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    setItems((current) => {
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  return (
    <View style={styles.gamePanel}>
      <ThemedText type="smallBold">Argument sorting</ThemedText>
      <ThemedText type="small" themeColor="textMuted">
        Sắp xếp các mệnh đề theo trình tự lập luận rồi nộp solution.
      </ThemedText>
      {items.map((item, index) => (
        <View key={item.id} style={[styles.sortRow, { borderColor: theme.border }]}>
          <GripVertical color={theme.textMuted} size={18} />
          <ThemedText type="small" style={styles.sortText}>
            {index + 1}. {item.text}
          </ThemedText>
          <View style={styles.sortActions}>
            <Pressable disabled={submitting || index === 0} onPress={() => move(index, -1)}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                ↑
              </ThemedText>
            </Pressable>
            <Pressable
              disabled={submitting || index === items.length - 1}
              onPress={() => move(index, 1)}
            >
              <ThemedText type="smallBold" themeColor="textSecondary">
                ↓
              </ThemedText>
            </Pressable>
          </View>
        </View>
      ))}
      <Button
        loading={submitting}
        title="Nộp lập luận"
        onPress={() => onSubmit({ solution: items.map((item) => item.text).join(" > ") })}
      />
    </View>
  );
}

function LeaderboardPreview({
  leaderboard,
}: {
  leaderboard: { rank: number; score: number; user?: { fullName: string | null } }[];
}) {
  const theme = useTheme();

  return (
    <View style={[styles.leaderboard, { borderColor: theme.border }]}>
      <View style={styles.leaderboardTitle}>
        <Trophy color={theme.primaryLight} size={18} />
        <ThemedText type="smallBold">Leaderboard</ThemedText>
      </View>
      {leaderboard.length === 0 ? (
        <ThemedText type="small" themeColor="textMuted">
          Chưa có lượt chơi nào. Hoàn thành game để ghi điểm đầu tiên.
        </ThemedText>
      ) : (
        leaderboard.slice(0, 10).map((entry) => (
          <View key={`${entry.rank}-${entry.score}`} style={styles.leaderboardRow}>
            <ThemedText type="label" themeColor="textMuted">
              #{entry.rank}
            </ThemedText>
            <ThemedText type="small" style={styles.leaderboardName}>
              {entry.user?.fullName ?? "Người chơi"}
            </ThemedText>
            <ThemedText type="smallBold">{entry.score}</ThemedText>
          </View>
        ))
      )}
    </View>
  );
}

function GameState({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={theme.text} size={20} />
          </Pressable>
          <ThemedText type="smallBold">{title}</ThemedText>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.statePanel}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

function EmptyGameState({ message }: { message: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.gamePanel, styles.emptyPanel, { borderColor: theme.border }]}>
      <Check color={theme.textMuted} size={30} />
      <ThemedText type="smallBold">Chưa đủ dữ liệu</ThemedText>
      <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
        {message}
      </ThemedText>
    </View>
  );
}

function normalizePairs(rows: Record<string, unknown>[]): MatchingPair[] {
  return rows
    .map((row) => {
      const values = Object.values(row);
      return {
        left: String(row.left ?? values[0] ?? ""),
        right: String(row.right ?? values[1] ?? ""),
      };
    })
    .filter((pair) => pair.left && pair.right);
}

function gameTypeLabel(game: MiniGame) {
  switch (game.gameType) {
    case "matching":
      return "Matching cards";
    case "guess-who":
      return "Portrait quiz";
    case "logic-puzzle":
      return "Argument sorting";
  }
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
  hero: { gap: Spacing.one },
  title: { fontFamily: Fonts.sans, fontSize: 28, lineHeight: 34, fontWeight: "800" },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 20, color: "#A1A1AA" },
  statusStrip: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  gamePanel: { gap: Spacing.three },
  matchRow: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.three, gap: Spacing.two },
  matchLeft: { lineHeight: 20 },
  optionRail: { gap: Spacing.two, paddingRight: Spacing.three },
  optionChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  characterCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  sortRow: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  sortText: { flex: 1, lineHeight: 20 },
  sortActions: { gap: Spacing.two, alignItems: "center" },
  leaderboard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  leaderboardTitle: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  leaderboardRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  leaderboardName: { flex: 1 },
  statePanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
    gap: Spacing.two,
  },
  emptyPanel: {
    minHeight: 180,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: { textAlign: "center" },
  disabled: { opacity: 0.55 },
});
