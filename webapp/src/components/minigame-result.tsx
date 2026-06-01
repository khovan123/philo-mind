import { Medal, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { MiniGameLeaderboardEntry, MiniGamePlayResult } from "@/types/minigame";

type MiniGameResultProps = {
  result: MiniGamePlayResult;
  leaderboard: MiniGameLeaderboardEntry[];
  onReplay: () => void;
  onBack: () => void;
};

export function MiniGameResult({ result, leaderboard, onReplay, onBack }: MiniGameResultProps) {
  const theme = useTheme();
  const [scoreScale] = useState(() => new Animated.Value(0.72));
  const [barProgress] = useState(() => new Animated.Value(0));
  const accuracyPercent = Math.round(result.result.accuracy * 100);
  const topTen = leaderboard.slice(0, 10);

  useEffect(() => {
    scoreScale.setValue(0.72);
    barProgress.setValue(0);

    Animated.parallel([
      Animated.spring(scoreScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(barProgress, {
        toValue: accuracyPercent,
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start();
  }, [accuracyPercent, barProgress, scoreScale]);

  const animatedBarWidth = barProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.wrap}>
      <View style={[styles.resultPanel, { borderColor: theme.primary }]}>
        <Animated.View
          style={[
            styles.scoreRing,
            { borderColor: theme.primary, transform: [{ scale: scoreScale }] },
          ]}
        >
          <ThemedText style={styles.scoreText}>{result.score}</ThemedText>
          <ThemedText type="label" themeColor="textMuted">
            điểm
          </ThemedText>
        </Animated.View>

        <View style={styles.resultCopy}>
          <ThemedText type="smallBold">Hoàn thành lượt chơi</ThemedText>
          <ThemedText type="small" themeColor="textMuted" style={styles.centerText}>
            Đúng {result.result.correctCount}/{result.result.total} • {result.timeSpentSeconds}s •
            Hạng #{result.leaderboardRank}
          </ThemedText>
        </View>

        <View style={[styles.accuracyTrack, { backgroundColor: theme.backgroundElement }]}>
          <Animated.View
            style={[
              styles.accuracyFill,
              { backgroundColor: theme.primary, width: animatedBarWidth },
            ]}
          />
        </View>

        <View style={styles.resultActions}>
          <Button title="Chơi lại" variant="outline" onPress={onReplay} />
          <Button title="Danh sách game" onPress={onBack} />
        </View>
      </View>

      <View style={[styles.leaderboard, { borderColor: theme.border }]}>
        <View style={styles.leaderboardTitle}>
          <Trophy color={theme.primaryLight} size={18} />
          <ThemedText type="smallBold">Top 10 leaderboard</ThemedText>
        </View>

        {topTen.length === 0 ? (
          <ThemedText type="small" themeColor="textMuted">
            Chưa có lượt chơi nào. Hoàn thành game để ghi điểm đầu tiên.
          </ThemedText>
        ) : (
          topTen.map((entry) => (
            <LeaderboardRow
              key={entry.attemptId}
              entry={entry}
              active={entry.attemptId === result.attemptId}
            />
          ))
        )}
      </View>
    </View>
  );
}

function LeaderboardRow({ entry, active }: { entry: MiniGameLeaderboardEntry; active: boolean }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.leaderboardRow,
        {
          backgroundColor: active ? theme.backgroundSelected : "transparent",
          borderColor: active ? theme.border : "transparent",
        },
      ]}
    >
      <View style={[styles.rankBadge, { backgroundColor: rankColor(entry.rank) }]}>
        {entry.rank <= 3 ? (
          <Medal color="#0C0C0E" size={14} />
        ) : (
          <ThemedText type="label" style={styles.rankText}>
            {entry.rank}
          </ThemedText>
        )}
      </View>
      <View style={styles.leaderboardName}>
        <ThemedText type="smallBold">{entry.user?.fullName ?? "Người chơi"}</ThemedText>
        <ThemedText type="label" themeColor="textMuted">
          {formatDate(entry.completedAt ?? entry.createdAt)}
        </ThemedText>
      </View>
      <ThemedText type="smallBold">{entry.score}</ThemedText>
      {active ? (
        <View style={[styles.youBadge, { borderColor: theme.primary }]}>
          <ThemedText type="label" themeColor="textSecondary">
            bạn
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

function rankColor(rank: number) {
  if (rank === 1) return "#F59E0B";
  if (rank === 2) return "#A1A1AA";
  if (rank === 3) return "#A78BFA";
  return "#2F2A24";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Không rõ ngày";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.three,
  },
  resultPanel: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
  },
  scoreRing: {
    width: 116,
    height: 116,
    borderRadius: Radius.full,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontFamily: Fonts.sans,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  resultCopy: {
    gap: Spacing.half,
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
  accuracyTrack: {
    width: "100%",
    height: 10,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  accuracyFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  resultActions: {
    width: "100%",
    gap: Spacing.two,
  },
  leaderboard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  leaderboardTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  leaderboardRow: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    color: "#E4E4E7",
    fontWeight: "800",
  },
  leaderboardName: {
    flex: 1,
    gap: 2,
  },
  youBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
});
