import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  GitCompareArrows,
  Lightbulb,
  Scale,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/* ─── Types & Data ─── */

interface ConceptSide {
  term: string;
  definition: string;
  keyPoints: string[];
  representatives: string[];
  color: string;
}

interface ComparisonPair {
  id: string;
  title: string;
  category: string;
  left: ConceptSide;
  right: ConceptSide;
  similarities: string[];
  differences: string[];
  keyInsight: string;
}

const comparisonPairs: ComparisonPair[] = [
  {
    id: "1",
    title: "Duy vật vs Duy tâm",
    category: "Bản thể luận",
    left: {
      term: "Chủ nghĩa Duy vật",
      definition:
        "Vật chất có trước, ý thức có sau. Vật chất tồn tại khách quan, không phụ thuộc vào ý thức và quyết định ý thức.",
      keyPoints: [
        "Vật chất là tính thứ nhất",
        "Ý thức là sự phản ánh của vật chất",
        "Thế giới tồn tại khách quan",
        "Thực tiễn là tiêu chuẩn chân lý",
      ],
      representatives: ["Karl Marx", "V.I. Lênin", "Friedrich Engels"],
      color: "#3B82F6",
    },
    right: {
      term: "Chủ nghĩa Duy tâm",
      definition:
        "Ý thức, tinh thần có trước và quyết định sự tồn tại của vật chất. Thế giới vật chất chỉ là biểu hiện bên ngoài của ý thức.",
      keyPoints: [
        "Ý thức/tinh thần là tính thứ nhất",
        "Vật chất phụ thuộc vào ý thức",
        "Chia thành chủ quan và khách quan",
        "Thần linh, Ý niệm tuyệt đối",
      ],
      representatives: ["Plato", "Georg Hegel", "George Berkeley"],
      color: "#A855F7",
    },
    similarities: [
      "Đều là câu trả lời cho vấn đề cơ bản của triết học",
      "Đều thừa nhận sự tồn tại của cả vật chất và ý thức",
      "Đều có lịch sử phát triển lâu đời từ thời cổ đại",
    ],
    differences: [
      "Trật tự ưu tiên: vật chất vs ý thức cái nào có trước",
      "Quan hệ quyết định: vật chất quyết định ý thức hay ngược lại",
      "Cơ sở phương pháp luận: duy vật → khoa học, duy tâm → tôn giáo",
      "Thái độ với thực tiễn: cải tạo thế giới vs chiêm nghiệm thế giới",
    ],
    keyInsight:
      "Cuộc đấu tranh giữa chủ nghĩa duy vật và duy tâm xuyên suốt toàn bộ lịch sử triết học, phản ánh cuộc đấu tranh giữa các lực lượng tiến bộ và bảo thủ trong xã hội.",
  },
  {
    id: "2",
    title: "Biện chứng vs Siêu hình",
    category: "Phương pháp luận",
    left: {
      term: "Phương pháp Biện chứng",
      definition:
        "Xem xét sự vật trong mối liên hệ phổ biến, trong sự vận động và phát triển không ngừng. Nguồn gốc của phát triển là mâu thuẫn nội tại.",
      keyPoints: [
        "Mọi sự vật đều có liên hệ",
        "Mọi sự vật đều vận động, phát triển",
        "Mâu thuẫn là nguồn gốc của phát triển",
        "Phát triển đi theo đường xoáy ốc",
      ],
      representatives: ["Heraclitus", "Hegel", "Marx"],
      color: "#22C55E",
    },
    right: {
      term: "Phương pháp Siêu hình",
      definition:
        "Xem xét sự vật trong trạng thái cô lập, tĩnh tại, không thấy mối liên hệ qua lại giữa các sự vật và hiện tượng.",
      keyPoints: [
        "Sự vật tồn tại cô lập",
        "Sự vật không thay đổi bản chất",
        "Phát triển chỉ là tăng/giảm về lượng",
        "Nguồn gốc phát triển là bên ngoài",
      ],
      representatives: ["Newton", "Wolff", "Locke"],
      color: "#F59E0B",
    },
    similarities: [
      "Đều là phương pháp nhận thức thế giới",
      "Đều có vai trò lịch sử trong sự phát triển khoa học",
      "Đều cung cấp công cụ phân tích sự vật hiện tượng",
    ],
    differences: [
      "Cách nhìn: toàn thể vs cô lập",
      "Quan niệm phát triển: chất lượng vs số lượng",
      "Nguồn gốc phát triển: nội tại vs ngoại tại",
      "Hình thức phát triển: xoáy ốc vs đường thẳng",
    ],
    keyInsight:
      "Phương pháp siêu hình có giá trị ở giai đoạn phân tích chi tiết, nhưng không thể thay thế phương pháp biện chứng khi cần nắm bắt bản chất và quy luật phát triển của sự vật.",
  },
  {
    id: "3",
    title: "Chất vs Lượng",
    category: "Quy luật biện chứng",
    left: {
      term: "Chất",
      definition:
        "Tính quy định khách quan vốn có của sự vật, là sự thống nhất hữu cơ của các thuộc tính làm cho sự vật là nó mà không phải sự vật khác.",
      keyPoints: [
        "Xác định bản chất sự vật",
        "Phân biệt sự vật này với sự vật khác",
        "Gắn liền với sự vật như một thể thống nhất",
        "Biến đổi chất = sự vật mới ra đời",
      ],
      representatives: ["Aristotle", "Hegel", "Marx"],
      color: "#EF4444",
    },
    right: {
      term: "Lượng",
      definition:
        "Tính quy định vốn có của sự vật về mặt số lượng, quy mô, tốc độ, nhịp điệu của quá trình vận động, phát triển.",
      keyPoints: [
        "Biểu thị bằng con số, đại lượng",
        "Thay đổi lượng chưa thay đổi bản chất",
        "Lượng biến đổi dần dần, liên tục",
        "Tích lũy lượng dẫn đến biến đổi chất",
      ],
      representatives: ["Pythagoras", "Hegel", "Engels"],
      color: "#06B6D4",
    },
    similarities: [
      "Đều là tính quy định khách quan của sự vật",
      "Đều tồn tại trong sự thống nhất không tách rời",
      "Đều vận động, biến đổi trong quá trình phát triển",
    ],
    differences: [
      "Chất xác định bản chất, lượng xác định quy mô",
      "Chất biến đổi đột biến (nhảy vọt), lượng biến đổi dần",
      "Mất chất = mất sự vật, mất lượng = chưa mất sự vật",
      "Chất ổn định tương đối, lượng biến đổi liên tục",
    ],
    keyInsight:
      "Quy luật lượng – chất cho thấy: mọi sự biến đổi về chất đều được chuẩn bị bởi những biến đổi về lượng, và ngược lại, biến đổi về chất tạo ra những biến đổi mới về lượng.",
  },
];

/* ─── Component ─── */

export default function ConceptComparisonScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { pairId } = useLocalSearchParams<{ pairId?: string }>();

  const [selectedPairIndex, setSelectedPairIndex] = useState(
    pairId ? comparisonPairs.findIndex((p) => p.id === pairId) : 0,
  );
  const [expandedSection, setExpandedSection] = useState<string | null>("differences");

  const pair = comparisonPairs[Math.max(0, selectedPairIndex)];

  function toggleSection(section: string) {
    setExpandedSection((prev) => (prev === section ? null : section));
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.background }}>
      <AppHeader title="So sánh khái niệm" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Pair Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pairSelector}
        >
          {comparisonPairs.map((p, i) => (
            <Pressable
              key={p.id}
              style={[
                s.pairChip,
                {
                  backgroundColor: i === selectedPairIndex ? `${theme.primary}20` : theme.surface,
                  borderColor: i === selectedPairIndex ? theme.primary : theme.border,
                },
              ]}
              onPress={() => {
                setSelectedPairIndex(i);
                setExpandedSection("differences");
              }}
            >
              <ThemedText
                type="smallBold"
                style={{
                  color: i === selectedPairIndex ? theme.primary : theme.text,
                  fontSize: 12,
                }}
              >
                {p.title}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Category Badge */}
        <View style={s.categoryRow}>
          <View style={[s.categoryBadge, { backgroundColor: `${theme.primary}15` }]}>
            <Scale color={theme.primary} size={12} />
            <ThemedText type="label" style={{ color: theme.primary, fontSize: 10 }}>
              {pair.category}
            </ThemedText>
          </View>
        </View>

        {/* Side-by-Side Comparison */}
        <View style={s.comparisonRow}>
          {/* Left */}
          <View
            style={[
              s.sideCard,
              {
                backgroundColor: theme.surface,
                borderColor: pair.left.color,
                borderTopWidth: 3,
              },
            ]}
          >
            <View style={[s.sideBadge, { backgroundColor: `${pair.left.color}20` }]}>
              <ThemedText type="label" style={{ color: pair.left.color, fontSize: 9 }}>
                QUAN ĐIỂM A
              </ThemedText>
            </View>
            <ThemedText style={[s.sideTerm, { color: pair.left.color }]}>
              {pair.left.term}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={s.sideDefinition}>
              {pair.left.definition}
            </ThemedText>
          </View>

          {/* VS Divider */}
          <View style={s.vsDivider}>
            <View style={[s.vsCircle, { backgroundColor: theme.backgroundElement }]}>
              <ArrowLeftRight color={theme.primary} size={16} />
            </View>
          </View>

          {/* Right */}
          <View
            style={[
              s.sideCard,
              {
                backgroundColor: theme.surface,
                borderColor: pair.right.color,
                borderTopWidth: 3,
              },
            ]}
          >
            <View style={[s.sideBadge, { backgroundColor: `${pair.right.color}20` }]}>
              <ThemedText type="label" style={{ color: pair.right.color, fontSize: 9 }}>
                QUAN ĐIỂM B
              </ThemedText>
            </View>
            <ThemedText style={[s.sideTerm, { color: pair.right.color }]}>
              {pair.right.term}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={s.sideDefinition}>
              {pair.right.definition}
            </ThemedText>
          </View>
        </View>

        {/* Key Points Columns */}
        <View style={s.keyPointsRow}>
          <View style={s.keyPointsCol}>
            <ThemedText
              type="label"
              style={{ color: pair.left.color, fontSize: 10, letterSpacing: 1 }}
            >
              LUẬN ĐIỂM CHÍNH
            </ThemedText>
            {pair.left.keyPoints.map((pt, i) => (
              <View key={i} style={s.keyPointItem}>
                <View style={[s.keyPointDot, { backgroundColor: pair.left.color }]} />
                <ThemedText type="small" style={s.keyPointText}>
                  {pt}
                </ThemedText>
              </View>
            ))}
            <View style={s.repsRow}>
              {pair.left.representatives.map((rep) => (
                <View key={rep} style={[s.repChip, { backgroundColor: `${pair.left.color}15` }]}>
                  <ThemedText type="small" style={{ color: pair.left.color, fontSize: 10 }}>
                    {rep}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={[s.colDivider, { backgroundColor: theme.border }]} />

          <View style={s.keyPointsCol}>
            <ThemedText
              type="label"
              style={{ color: pair.right.color, fontSize: 10, letterSpacing: 1 }}
            >
              LUẬN ĐIỂM CHÍNH
            </ThemedText>
            {pair.right.keyPoints.map((pt, i) => (
              <View key={i} style={s.keyPointItem}>
                <View style={[s.keyPointDot, { backgroundColor: pair.right.color }]} />
                <ThemedText type="small" style={s.keyPointText}>
                  {pt}
                </ThemedText>
              </View>
            ))}
            <View style={s.repsRow}>
              {pair.right.representatives.map((rep) => (
                <View key={rep} style={[s.repChip, { backgroundColor: `${pair.right.color}15` }]}>
                  <ThemedText type="small" style={{ color: pair.right.color, fontSize: 10 }}>
                    {rep}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Collapsible Sections */}
        {/* Similarities */}
        <Pressable
          style={[s.accordion, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => toggleSection("similarities")}
        >
          <View style={s.accordionHeader}>
            <GitCompareArrows color={theme.success} size={16} />
            <ThemedText type="smallBold">Điểm tương đồng ({pair.similarities.length})</ThemedText>
            {expandedSection === "similarities" ? (
              <ChevronUp color={theme.textMuted} size={16} />
            ) : (
              <ChevronDown color={theme.textMuted} size={16} />
            )}
          </View>
          {expandedSection === "similarities" && (
            <View style={s.accordionBody}>
              {pair.similarities.map((item, i) => (
                <View key={i} style={s.accordionItem}>
                  <View style={[s.accordionDot, { backgroundColor: theme.success }]} />
                  <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </Pressable>

        {/* Differences */}
        <Pressable
          style={[s.accordion, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => toggleSection("differences")}
        >
          <View style={s.accordionHeader}>
            <ArrowLeftRight color={theme.danger} size={16} />
            <ThemedText type="smallBold">Điểm khác biệt ({pair.differences.length})</ThemedText>
            {expandedSection === "differences" ? (
              <ChevronUp color={theme.textMuted} size={16} />
            ) : (
              <ChevronDown color={theme.textMuted} size={16} />
            )}
          </View>
          {expandedSection === "differences" && (
            <View style={s.accordionBody}>
              {pair.differences.map((item, i) => (
                <View key={i} style={s.accordionItem}>
                  <View style={[s.accordionDot, { backgroundColor: theme.danger }]} />
                  <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </Pressable>

        {/* Key Insight */}
        <View
          style={[
            s.insightCard,
            { backgroundColor: `${theme.primary}10`, borderColor: theme.primary },
          ]}
        >
          <Lightbulb color={theme.primary} size={20} />
          <View style={s.insightContent}>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              Nhận thức then chốt
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={s.insightText}>
              {pair.keyInsight}
            </ThemedText>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={s.bottomActions}>
          <Button
            title="Xem bài học liên quan"
            variant="outline"
            fullWidth
            onPress={() => router.push("/(tabs)/explore")}
          />
          <Button
            title="Ôn Flashcard"
            fullWidth
            onPress={() => router.push("/(lesson)/flashcard")}
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

  pairSelector: {
    gap: Spacing.two,
    paddingBottom: Spacing.one,
  },
  pairChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  categoryRow: {
    alignItems: "flex-start",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },

  comparisonRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "stretch",
  },
  sideCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sideBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  sideTerm: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Fonts.sans,
  },
  sideDefinition: {
    lineHeight: 18,
    fontSize: 11,
  },

  vsDivider: {
    alignItems: "center",
    justifyContent: "center",
    width: 0,
    marginHorizontal: -Spacing.one,
    zIndex: 1,
  },
  vsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  keyPointsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  keyPointsCol: {
    flex: 1,
    gap: Spacing.two,
  },
  colDivider: {
    width: 1,
  },
  keyPointItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  keyPointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  keyPointText: {
    flex: 1,
    lineHeight: 18,
    fontSize: 12,
  },
  repsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  repChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },

  accordion: {
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
  },
  accordionBody: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  accordionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  accordionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },

  insightCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.three,
    alignItems: "flex-start",
  },
  insightContent: {
    flex: 1,
    gap: 4,
  },
  insightText: {
    lineHeight: 20,
  },

  bottomActions: {
    gap: Spacing.two,
  },
});
