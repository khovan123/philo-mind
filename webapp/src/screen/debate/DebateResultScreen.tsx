import { useLocalSearchParams, useRouter } from "expo-router";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  Scale,
  Shield,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/* ─── Types & Mock Data ─── */

interface ArgumentScore {
  dimension: string;
  score: number;
  maxScore: number;
  icon: typeof Brain;
  feedback: string;
}

interface DebateResultData {
  debateTitle: string;
  userStance: string;
  stanceLabel: string;
  overallScore: number;
  rank: string;
  totalParticipants: number;
  userRankPosition: number;
  xpEarned: number;
  argumentScores: ArgumentScore[];
  strengths: string[];
  improvements: string[];
  communityStats: {
    agreePercent: number;
    disagreePercent: number;
    neutralPercent: number;
    totalArguments: number;
    averageScore: number;
  };
  suggestedReadings: { title: string; type: string }[];
}

const mockResult: DebateResultData = {
  debateTitle: "Vật chất hay Ý thức — cái nào có trước?",
  userStance: "AGREE",
  stanceLabel: "Duy vật",
  overallScore: 78,
  rank: "Triết gia Triển vọng",
  totalParticipants: 42,
  userRankPosition: 8,
  xpEarned: 150,
  argumentScores: [
    {
      dimension: "Logic luận cứ",
      score: 85,
      maxScore: 100,
      icon: Brain,
      feedback: "Lập luận mạch lạc, có cấu trúc tam đoạn luận rõ ràng.",
    },
    {
      dimension: "Dẫn chứng",
      score: 70,
      maxScore: 100,
      icon: BookOpen,
      feedback: "Cần bổ sung thêm trích dẫn từ tác phẩm gốc của Marx và Lênin.",
    },
    {
      dimension: "Phản biện",
      score: 75,
      maxScore: 100,
      icon: Shield,
      feedback: "Xử lý phản biện tốt nhưng chưa dự đoán hết các phản luận phổ biến.",
    },
    {
      dimension: "Tính thuyết phục",
      score: 82,
      maxScore: 100,
      icon: Sparkles,
      feedback: "Ngôn ngữ thuyết phục, ví dụ minh họa sinh động từ thực tiễn.",
    },
    {
      dimension: "Tính sáng tạo",
      score: 68,
      maxScore: 100,
      icon: Lightbulb,
      feedback: "Có thể mạnh dạn đưa ra góc nhìn liên ngành (khoa học thần kinh, vật lý).",
    },
  ],
  strengths: [
    "Cấu trúc lập luận rõ ràng, dễ theo dõi",
    "Sử dụng ví dụ thực tiễn hiệu quả",
    "Thái độ tranh luận tôn trọng, học thuật",
  ],
  improvements: [
    "Bổ sung trích dẫn từ các tác phẩm kinh điển",
    "Dự đoán phản luận từ quan điểm duy tâm",
    "Kết hợp góc nhìn liên ngành để tăng chiều sâu",
  ],
  communityStats: {
    agreePercent: 58,
    disagreePercent: 30,
    neutralPercent: 12,
    totalArguments: 67,
    averageScore: 72,
  },
  suggestedReadings: [
    { title: "Bài học: Vấn đề cơ bản của Triết học", type: "lesson" },
    { title: "Flashcard: Duy vật vs Duy tâm", type: "flashcard" },
    { title: "So sánh: Biện chứng vs Siêu hình", type: "comparison" },
  ],
};

/* ─── Component ─── */

export default function DebateResultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const [showDetails, setShowDetails] = useState(false);

  const result = mockResult;
  const scoreColor =
    result.overallScore >= 80
      ? theme.success
      : result.overallScore >= 60
        ? theme.warning
        : theme.danger;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.background }}>
      <AppHeader title="Kết quả tranh luận" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Hero Score Card */}
        <View style={[s.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Score Ring */}
          <View style={s.scoreSection}>
            <View style={[s.scoreRing, { borderColor: scoreColor }]}>
              <ThemedText style={[s.scoreValue, { color: scoreColor }]}>
                {result.overallScore}
              </ThemedText>
              <ThemedText type="small" themeColor="textMuted">
                /100
              </ThemedText>
            </View>
            <View style={s.scoreInfo}>
              <View style={[s.rankBadge, { backgroundColor: `${theme.primary}20` }]}>
                <Trophy color={theme.primary} size={14} />
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  {result.rank}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                Top {result.userRankPosition}/{result.totalParticipants} người tham gia
              </ThemedText>
            </View>
          </View>

          {/* XP & Stance */}
          <View style={s.metaRow}>
            <View style={[s.metaChip, { backgroundColor: `${theme.success}15` }]}>
              <Zap color={theme.success} size={14} />
              <ThemedText type="smallBold" style={{ color: theme.success }}>
                +{result.xpEarned} XP
              </ThemedText>
            </View>
            <View style={[s.metaChip, { backgroundColor: `${theme.info}15` }]}>
              <Scale color={theme.info} size={14} />
              <ThemedText type="smallBold" style={{ color: theme.info }}>
                Lập trường: {result.stanceLabel}
              </ThemedText>
            </View>
          </View>

          {/* Debate Title */}
          <ThemedText type="small" themeColor="textSecondary" style={s.debateTitle}>
            {result.debateTitle}
          </ThemedText>
        </View>

        {/* Dimension Scores */}
        <View style={s.section}>
          <ThemedText style={s.sectionTitle} type="smallBold" themeColor="textSecondary">
            PHÂN TÍCH CHI TIẾT (AI)
          </ThemedText>
          {result.argumentScores.map((dim) => {
            const DimIcon = dim.icon;
            const pct = Math.round((dim.score / dim.maxScore) * 100);
            const dimColor = pct >= 80 ? theme.success : pct >= 60 ? theme.warning : theme.danger;
            return (
              <View
                key={dim.dimension}
                style={[s.dimCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={s.dimHeader}>
                  <View style={[s.dimIcon, { backgroundColor: `${dimColor}15` }]}>
                    <DimIcon color={dimColor} size={16} />
                  </View>
                  <View style={s.dimInfo}>
                    <View style={s.dimRow}>
                      <ThemedText type="smallBold">{dim.dimension}</ThemedText>
                      <ThemedText type="smallBold" style={{ color: dimColor }}>
                        {dim.score}/{dim.maxScore}
                      </ThemedText>
                    </View>
                    <View style={[s.dimTrack, { backgroundColor: theme.backgroundElement }]}>
                      <View style={[s.dimFill, { width: `${pct}%`, backgroundColor: dimColor }]} />
                    </View>
                  </View>
                </View>
                {showDetails && (
                  <ThemedText type="small" themeColor="textSecondary" style={s.dimFeedback}>
                    {dim.feedback}
                  </ThemedText>
                )}
              </View>
            );
          })}
          <Pressable style={s.toggleDetails} onPress={() => setShowDetails(!showDetails)}>
            <ThemedText type="small" style={{ color: theme.primary }}>
              {showDetails ? "Ẩn phản hồi chi tiết" : "Xem phản hồi chi tiết"}
            </ThemedText>
          </Pressable>
        </View>

        {/* Strengths & Improvements */}
        <View style={s.dualSection}>
          {/* Strengths */}
          <View
            style={[
              s.feedbackCard,
              { backgroundColor: `${theme.success}08`, borderColor: theme.success },
            ]}
          >
            <View style={s.feedbackHeader}>
              <ThumbsUp color={theme.success} size={16} />
              <ThemedText type="smallBold" style={{ color: theme.success }}>
                Điểm mạnh
              </ThemedText>
            </View>
            {result.strengths.map((item, i) => (
              <View key={i} style={s.feedbackItem}>
                <View style={[s.feedbackDot, { backgroundColor: theme.success }]} />
                <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
                  {item}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Improvements */}
          <View
            style={[
              s.feedbackCard,
              { backgroundColor: `${theme.warning}08`, borderColor: theme.warning },
            ]}
          >
            <View style={s.feedbackHeader}>
              <TrendingUp color={theme.warning} size={16} />
              <ThemedText type="smallBold" style={{ color: theme.warning }}>
                Cần cải thiện
              </ThemedText>
            </View>
            {result.improvements.map((item, i) => (
              <View key={i} style={s.feedbackItem}>
                <View style={[s.feedbackDot, { backgroundColor: theme.warning }]} />
                <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
                  {item}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Community Stats */}
        <View
          style={[s.communityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={s.communityHeader}>
            <BarChart3 color={theme.primary} size={16} />
            <ThemedText type="smallBold">Thống kê cộng đồng</ThemedText>
          </View>

          {/* Stance Bar */}
          <View style={s.stanceBar}>
            <View
              style={[
                s.stanceSegment,
                {
                  width: `${result.communityStats.agreePercent}%`,
                  backgroundColor: theme.success,
                },
              ]}
            />
            <View
              style={[
                s.stanceSegment,
                {
                  width: `${result.communityStats.disagreePercent}%`,
                  backgroundColor: theme.danger,
                },
              ]}
            />
            <View
              style={[
                s.stanceSegment,
                {
                  width: `${result.communityStats.neutralPercent}%`,
                  backgroundColor: theme.warning,
                },
              ]}
            />
          </View>
          <View style={s.stanceLegend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: theme.success }]} />
              <ThemedText type="small" themeColor="textSecondary">
                Duy vật {result.communityStats.agreePercent}%
              </ThemedText>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: theme.danger }]} />
              <ThemedText type="small" themeColor="textSecondary">
                Duy tâm {result.communityStats.disagreePercent}%
              </ThemedText>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: theme.warning }]} />
              <ThemedText type="small" themeColor="textSecondary">
                Trung lập {result.communityStats.neutralPercent}%
              </ThemedText>
            </View>
          </View>

          <View style={s.communityStats}>
            <View style={s.statItem}>
              <MessageSquare color={theme.textMuted} size={14} />
              <ThemedText type="small" themeColor="textMuted">
                {result.communityStats.totalArguments} lập luận
              </ThemedText>
            </View>
            <View style={s.statItem}>
              <Star color={theme.textMuted} size={14} />
              <ThemedText type="small" themeColor="textMuted">
                Điểm TB: {result.communityStats.averageScore}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Suggested Readings */}
        <View style={s.section}>
          <ThemedText style={s.sectionTitle} type="smallBold" themeColor="textSecondary">
            GỢI Ý HỌC THÊM
          </ThemedText>
          {result.suggestedReadings.map((reading, i) => (
            <Pressable
              key={i}
              style={[s.readingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <BookOpen color={theme.primary} size={16} />
              <View style={s.readingInfo}>
                <ThemedText type="smallBold">{reading.title}</ThemedText>
                <ThemedText type="small" themeColor="textMuted">
                  {reading.type === "lesson"
                    ? "Bài học"
                    : reading.type === "flashcard"
                      ? "Thẻ ghi nhớ"
                      : "So sánh khái niệm"}
                </ThemedText>
              </View>
              <ChevronRight color={theme.textMuted} size={16} />
            </Pressable>
          ))}
        </View>

        {/* Bottom Actions */}
        <View style={s.bottomActions}>
          <Button
            title="Quay lại phiên tranh luận"
            variant="outline"
            fullWidth
            onPress={() => router.back()}
          />
          <Button
            title="Xem bảng xếp hạng"
            fullWidth
            onPress={() => router.push("/(tabs)/debate")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */

const s = StyleSheet.create({
  content: {
    padding: Spacing.three,
    paddingBottom: 120,
    gap: Spacing.three,
  },

  heroCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: "center",
  },
  scoreSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
    width: "100%",
  },
  scoreRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: Fonts.sans,
  },
  scoreInfo: {
    flex: 1,
    gap: Spacing.two,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.two,
    width: "100%",
  },
  metaChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
  debateTitle: {
    textAlign: "center",
    lineHeight: 20,
  },

  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    letterSpacing: 1,
    fontSize: 11,
  },

  dimCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  dimHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  dimIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dimInfo: {
    flex: 1,
    gap: Spacing.two,
  },
  dimRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dimTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  dimFill: {
    height: "100%",
    borderRadius: 2,
  },
  dimFeedback: {
    lineHeight: 18,
    paddingLeft: Spacing.three + 36,
  },
  toggleDetails: {
    alignItems: "center",
    paddingVertical: Spacing.one,
  },

  dualSection: {
    gap: Spacing.two,
  },
  feedbackCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  feedbackDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },

  communityCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  communityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  stanceBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
  },
  stanceSegment: {
    height: "100%",
  },
  stanceLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  communityStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.four,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  readingCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  readingInfo: {
    flex: 1,
    gap: 2,
  },

  bottomActions: {
    gap: Spacing.two,
  },
});
