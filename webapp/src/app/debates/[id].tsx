import { VoteValue } from "@philo-mind/shared";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Scale,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  useCreateArgumentMutation,
  useCreateCommentMutation,
  useGetDebateDetailQuery,
  useVoteArgumentMutation,
} from "@/services/rtk-api/debate.api";

type StanceType = "AGREE" | "DISAGREE" | "NEUTRAL";
type ActiveTab = "OVERVIEW" | "ARGUMENTS";

// Animated vote wrapper for spring physics popping animation
const AnimatedVoteButton: React.FC<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}> = ({ onPress, style, children }) => {
  const [scale] = React.useState(() => new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable style={style} onPress={handlePress}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default function DebateDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  // RTK Query & Mutation Hooks
  const {
    data: debate,
    isLoading,
    error,
    refetch,
  } = useGetDebateDetailQuery(id as string, {
    skip: !id,
  });

  const [createArgument, { isLoading: isPostingArgument }] = useCreateArgumentMutation();
  const [voteArgument] = useVoteArgumentMutation();
  const [createComment, { isLoading: isPostingComment }] = useCreateCommentMutation();

  // Screen UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>("OVERVIEW");
  const [selectedStanceFilter, setSelectedStanceFilter] = useState<string>("ALL");
  const [expandedArgumentId, setExpandedArgumentId] = useState<string | null>(null);

  // Stance / Argument Posting Form State
  const [isWritingArgument, setIsWritingArgument] = useState(false);
  const [argumentStance, setArgumentStance] = useState<StanceType>("AGREE");
  const [argumentTitle, setArgumentTitle] = useState("");
  const [argumentBody, setArgumentBody] = useState("");
  const [convincingRating, setConvincingRating] = useState(80); // percentage: 20, 40, 60, 80, 100
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Comment Writing State
  const [commentTextMap, setCommentTextMap] = useState<Record<string, string>>({});

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/debate");
    }
  };

  // Helper to translate stances
  const getStanceLabels = (title: string = "") => {
    const isMaterialism =
      title.includes("Vật chất") || title.includes("Duy vật") || title.includes("Duy tâm");
    if (isMaterialism) {
      return {
        AGREE: "Duy vật",
        DISAGREE: "Duy tâm",
        NEUTRAL: "Trung lập",
      };
    }
    const isScience = title.includes("Khoa học");
    if (isScience) {
      return {
        AGREE: "Duy khoa học",
        DISAGREE: "Đa chiều",
        NEUTRAL: "Trung lập",
      };
    }
    return {
      AGREE: "Ủng hộ",
      DISAGREE: "Phản đối",
      NEUTRAL: "Trung lập",
    };
  };

  const labels = getStanceLabels(debate?.title);

  // Calculations for Stance Stats
  const argumentsList = debate?.arguments || [];
  const agreeCount = argumentsList.filter((a) => a.stance === "AGREE").length;
  const disagreeCount = argumentsList.filter((a) => a.stance === "DISAGREE").length;
  const neutralCount = argumentsList.filter((a) => a.stance === "NEUTRAL").length;
  const totalCount = argumentsList.length;

  const agreePercent = totalCount > 0 ? Math.round((agreeCount / totalCount) * 100) : 0;
  const disagreePercent = totalCount > 0 ? Math.round((disagreeCount / totalCount) * 100) : 0;
  const neutralPercent = totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0;

  // Polarization level calculation
  const getPolarizationLevel = () => {
    if (totalCount === 0) return { label: "Chưa xác định", percent: 0, color: theme.textSecondary };
    const diff = Math.abs(agreePercent - disagreePercent);
    if (diff < 20) {
      return { label: "Cực kỳ phân hóa (Cân bằng ý kiến)", percent: 90, color: theme.danger };
    } else if (diff < 50) {
      return { label: "Phân hóa trung bình", percent: 55, color: theme.warning };
    } else {
      return { label: "Phân hóa thấp (Đồng thuận cao)", percent: 25, color: theme.success };
    }
  };

  const polarization = getPolarizationLevel();

  // Handle post argument
  const handlePostArgumentSubmit = async () => {
    if (!argumentBody.trim() || !argumentTitle.trim() || argumentBody.trim().length < 50) return;
    const combinedContent = `**${argumentTitle.trim()}**\n\n${argumentBody.trim()}`;

    try {
      await createArgument({
        debateId: id as string,
        body: {
          stance: argumentStance,
          content: combinedContent,
        },
      }).unwrap();

      // Reset Form
      setArgumentTitle("");
      setArgumentBody("");
      setIsPreviewMode(false);
      setIsWritingArgument(false);
      refetch();
    } catch {
      // Error handled by RTK
    }
  };

  // Handle vote argument
  const handleVotePress = async (argumentId: string, value: VoteValue) => {
    try {
      await voteArgument({ argumentId, value }).unwrap();
      refetch();
    } catch {
      // Handle err
    }
  };

  // Handle submit comment
  const handleCommentSubmit = async (argumentId: string) => {
    const text = commentTextMap[argumentId];
    if (!text?.trim()) return;

    try {
      await createComment({
        argumentId,
        commentText: text.trim(),
      }).unwrap();

      setCommentTextMap((prev) => ({ ...prev, [argumentId]: "" }));
      refetch();
    } catch {
      // Handle err
    }
  };

  // Filtered arguments
  const filteredArguments = argumentsList.filter((arg) => {
    if (selectedStanceFilter === "ALL") return true;
    return arg.stance === selectedStanceFilter;
  });

  // Top noteworthy arguments
  const noteworthyArguments = [...argumentsList]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 2);

  // Compact card renderer for split columns
  const renderSplitCard = (arg: (typeof argumentsList)[0], accentColor: string) => {
    const matches = arg.argumentText.match(/^\*\*(.*?)\*\*\n\n([\s\S]*)/);
    const cardTitle = matches ? matches[1] : "";
    const cardBody = matches ? matches[2] : arg.argumentText;
    return (
      <Pressable
        key={arg.id}
        style={[
          styles.splitCard,
          {
            backgroundColor: theme.surface,
            borderLeftColor: accentColor,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setSelectedStanceFilter(arg.stance)}
      >
        {cardTitle ? (
          <ThemedText style={styles.splitCardTitle} numberOfLines={2}>
            {cardTitle}
          </ThemedText>
        ) : null}
        <ThemedText style={styles.splitCardBody} themeColor="textSecondary" numberOfLines={3}>
          {cardBody}
        </ThemedText>
        <View style={styles.splitCardFooter}>
          <View style={styles.splitCardVotes}>
            <ThumbsUp size={12} color={theme.textMuted} />
            <Text style={[styles.splitCardVoteText, { color: theme.textMuted }]}>
              {arg.voteCount}
            </Text>
          </View>
          <Text style={[styles.splitCardAuthor, { color: theme.textMuted }]}>
            {arg.user.fullName?.split(" ").pop()}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={{ marginTop: Spacing.two }} themeColor="textSecondary">
          Đang tải chi tiết tranh luận...
        </ThemedText>
      </View>
    );
  }

  if (error || !debate) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ThemedText style={{ color: theme.danger }}>
          Đã có lỗi xảy ra hoặc không tìm thấy phiên tranh luận này.
        </ThemedText>
        <Pressable style={[styles.backBtn, { marginTop: Spacing.four }]} onPress={handleGoBack}>
          <ThemedText themeColor="primary">Quay lại</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleGoBack}>
            <ArrowLeft size={24} color={theme.icon} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerLabel} type="label" themeColor="textSecondary">
              CHI TIẾT TRANH LUẬN
            </ThemedText>
            <ThemedText style={styles.headerTitle} numberOfLines={1}>
              {debate.title}
            </ThemedText>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Stance Toggle Tabs */}
          <View style={[styles.tabBar, { borderColor: theme.border }]}>
            <Pressable
              style={[styles.tabItem, activeTab === "OVERVIEW" && styles.tabActive]}
              onPress={() => setActiveTab("OVERVIEW")}
            >
              <ThemedText
                style={[styles.tabText, activeTab === "OVERVIEW" && { color: theme.primary }]}
                themeColor={activeTab === "OVERVIEW" ? "primary" : "textSecondary"}
              >
                TỔNG QUAN
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.tabItem, activeTab === "ARGUMENTS" && styles.tabActive]}
              onPress={() => setActiveTab("ARGUMENTS")}
            >
              <ThemedText
                style={[styles.tabText, activeTab === "ARGUMENTS" && { color: theme.primary }]}
                themeColor={activeTab === "ARGUMENTS" ? "primary" : "textSecondary"}
              >
                LẬP LUẬN ({totalCount})
              </ThemedText>
            </Pressable>
          </View>

          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === "OVERVIEW" && (
            <View style={styles.tabContent}>
              {/* Stance Distribution Chart */}
              <View
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <ThemedText style={styles.cardTitle} type="smallBold">
                  Phân bổ lập trường cộng đồng
                </ThemedText>

                {totalCount === 0 ? (
                  <ThemedText style={styles.emptyText} themeColor="textSecondary">
                    Chưa có lập luận nào. Hãy là người đầu tiên đưa ra lập luận!
                  </ThemedText>
                ) : (
                  <View style={{ marginVertical: Spacing.two }}>
                    {/* Segmented bar */}
                    <View style={styles.segmentedBar}>
                      {agreePercent > 0 && (
                        <View
                          style={[
                            styles.barSegment,
                            { width: `${agreePercent}%`, backgroundColor: theme.success },
                          ]}
                        />
                      )}
                      {disagreePercent > 0 && (
                        <View
                          style={[
                            styles.barSegment,
                            { width: `${disagreePercent}%`, backgroundColor: theme.danger },
                          ]}
                        />
                      )}
                      {neutralPercent > 0 && (
                        <View
                          style={[
                            styles.barSegment,
                            { width: `${neutralPercent}%`, backgroundColor: theme.warning },
                          ]}
                        />
                      )}
                    </View>

                    {/* Legends */}
                    <View style={styles.legendsRow}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.success }]} />
                        <ThemedText style={styles.legendText}>
                          {labels.AGREE}: {agreePercent}%
                        </ThemedText>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.danger }]} />
                        <ThemedText style={styles.legendText}>
                          {labels.DISAGREE}: {disagreePercent}%
                        </ThemedText>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.warning }]} />
                        <ThemedText style={styles.legendText}>
                          {labels.NEUTRAL}: {neutralPercent}%
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                )}

                {/* Polarization Slider */}
                <View style={styles.polarizationSection}>
                  <View style={styles.polarHeader}>
                    <Scale size={16} color={theme.primary} />
                    <ThemedText style={styles.polarLabel} type="smallBold">
                      Độ phân hóa
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.polarValue} themeColor="primary">
                    {polarization.label}
                  </ThemedText>

                  {/* Indicator slider */}
                  <View style={[styles.sliderTrack, { backgroundColor: theme.backgroundElement }]}>
                    <View
                      style={[
                        styles.sliderThumb,
                        {
                          left: `${polarization.percent}%`,
                          backgroundColor: polarization.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Featured Noteworthy Arguments */}
              {noteworthyArguments.length > 0 && (
                <View style={styles.section}>
                  <ThemedText
                    style={styles.sectionTitle}
                    type="smallBold"
                    themeColor="textSecondary"
                  >
                    LẬP LUẬN NỔI BẬT KHUYÊN ĐỌC
                  </ThemedText>

                  {noteworthyArguments.map((arg) => (
                    <Pressable
                      key={arg.id}
                      style={[
                        styles.noteworthyCard,
                        {
                          backgroundColor: theme.surfaceElevated,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => {
                        setActiveTab("ARGUMENTS");
                        setSelectedStanceFilter("ALL");
                        setExpandedArgumentId(arg.id);
                      }}
                    >
                      <View style={styles.argHeader}>
                        <View style={styles.userInfo}>
                          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                            <ThemedText style={styles.avatarText}>
                              {arg.user.fullName?.charAt(0).toUpperCase()}
                            </ThemedText>
                          </View>
                          <View style={{ marginLeft: Spacing.two }}>
                            <ThemedText style={styles.fullName}>{arg.user.fullName}</ThemedText>
                            <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                              TRIẾT GIA TẬP SỰ
                            </Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.stanceBadge,
                            {
                              backgroundColor:
                                arg.stance === "AGREE"
                                  ? "rgba(34, 197, 94, 0.15)"
                                  : arg.stance === "DISAGREE"
                                    ? "rgba(239, 44, 68, 0.15)"
                                    : "rgba(245, 158, 11, 0.15)",
                              borderColor:
                                arg.stance === "AGREE"
                                  ? theme.success
                                  : arg.stance === "DISAGREE"
                                    ? theme.danger
                                    : theme.warning,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.stanceBadgeText,
                              {
                                color:
                                  arg.stance === "AGREE"
                                    ? theme.success
                                    : arg.stance === "DISAGREE"
                                      ? theme.danger
                                      : theme.warning,
                              },
                            ]}
                          >
                            {labels[arg.stance]}
                          </Text>
                        </View>
                      </View>

                      <ThemedText style={styles.argText} numberOfLines={3}>
                        {arg.argumentText.replace(/\*\*.*?\*\*\n\n/, "")}
                      </ThemedText>

                      <View style={styles.argFooter}>
                        <View style={styles.votesCountGroup}>
                          <ThumbsUp size={14} color={theme.primary} />
                          <ThemedText style={styles.footerVotesText} themeColor="primary">
                            {arg.voteCount} điểm thuyết phục
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.viewDiscussionText} themeColor="textSecondary">
                          Xem thảo luận ({arg.comments.length})
                        </ThemedText>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Reflection actions */}
              <View style={styles.reflectionSection}>
                <View
                  style={[
                    styles.reflectionCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Sparkles size={20} color={theme.primary} />
                  <ThemedText style={styles.reflectTitle} type="smallBold">
                    Gợi ý phản tư nâng cao
                  </ThemedText>
                  <ThemedText style={styles.reflectText} themeColor="textSecondary">
                    Hãy xem lại các bài học về chương này để củng cố các luận cứ thuyết phục. Bạn có
                    thể thay đổi lập trường của mình bất kỳ lúc nào dựa trên tri thức mới.
                  </ThemedText>

                  <View style={styles.reflectButtons}>
                    <Pressable
                      style={[styles.primaryButton, { backgroundColor: theme.primary }]}
                      onPress={() => setIsWritingArgument(true)}
                    >
                      <Plus size={16} color="#0C0C0E" style={{ marginRight: Spacing.one }} />
                      <Text style={styles.buttonTextBlack}>Viết lập luận của bạn</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: ARGUMENTS SPLIT FOR/AGAINST VIEW */}
          {activeTab === "ARGUMENTS" && (
            <View style={styles.tabContent}>
              {/* Split FOR vs AGAINST header bar */}
              <View style={styles.splitHeader}>
                <Pressable
                  style={[
                    styles.splitHeaderTab,
                    {
                      backgroundColor:
                        selectedStanceFilter === "AGREE"
                          ? "rgba(34, 197, 94, 0.15)"
                          : theme.surface,
                      borderColor: selectedStanceFilter === "AGREE" ? theme.success : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setSelectedStanceFilter(selectedStanceFilter === "AGREE" ? "ALL" : "AGREE")
                  }
                >
                  <View style={[styles.splitDot, { backgroundColor: theme.success }]} />
                  <Text
                    style={[
                      styles.splitHeaderText,
                      {
                        color: selectedStanceFilter === "AGREE" ? theme.success : theme.text,
                      },
                    ]}
                  >
                    {labels.AGREE} ({agreeCount})
                  </Text>
                </Pressable>

                <View style={styles.splitVsDivider}>
                  <Text style={[styles.vsText, { color: theme.textMuted }]}>VS</Text>
                </View>

                <Pressable
                  style={[
                    styles.splitHeaderTab,
                    {
                      backgroundColor:
                        selectedStanceFilter === "DISAGREE"
                          ? "rgba(239, 44, 68, 0.15)"
                          : theme.surface,
                      borderColor:
                        selectedStanceFilter === "DISAGREE" ? theme.danger : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setSelectedStanceFilter(
                      selectedStanceFilter === "DISAGREE" ? "ALL" : "DISAGREE",
                    )
                  }
                >
                  <View style={[styles.splitDot, { backgroundColor: theme.danger }]} />
                  <Text
                    style={[
                      styles.splitHeaderText,
                      {
                        color: selectedStanceFilter === "DISAGREE" ? theme.danger : theme.text,
                      },
                    ]}
                  >
                    {labels.DISAGREE} ({disagreeCount})
                  </Text>
                </Pressable>
              </View>

              {/* Neutral chip toggle */}
              {neutralCount > 0 && (
                <Pressable
                  style={[
                    styles.neutralChip,
                    {
                      backgroundColor:
                        selectedStanceFilter === "NEUTRAL"
                          ? "rgba(245, 158, 11, 0.15)"
                          : theme.surface,
                      borderColor:
                        selectedStanceFilter === "NEUTRAL" ? theme.warning : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setSelectedStanceFilter(selectedStanceFilter === "NEUTRAL" ? "ALL" : "NEUTRAL")
                  }
                >
                  <View style={[styles.splitDot, { backgroundColor: theme.warning }]} />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color:
                        selectedStanceFilter === "NEUTRAL" ? theme.warning : theme.textSecondary,
                    }}
                  >
                    {labels.NEUTRAL} ({neutralCount})
                  </Text>
                </Pressable>
              )}

              {/* Split columns layout – show side-by-side when filter is ALL */}
              {selectedStanceFilter === "ALL" ? (
                <View style={styles.splitColumnsContainer}>
                  {/* FOR Column */}
                  <View style={styles.splitColumn}>
                    <View
                      style={[
                        styles.splitColumnHeader,
                        { backgroundColor: "rgba(34, 197, 94, 0.08)" },
                      ]}
                    >
                      <View style={[styles.splitColumnDot, { backgroundColor: theme.success }]} />
                      <Text style={[styles.splitColumnLabel, { color: theme.success }]}>
                        {labels.AGREE}
                      </Text>
                    </View>
                    {argumentsList.filter((a) => a.stance === "AGREE").length === 0 ? (
                      <View style={styles.splitEmptyCol}>
                        <ThemedText
                          style={{ fontSize: 11, textAlign: "center" }}
                          themeColor="textSecondary"
                        >
                          Chưa có lập luận
                        </ThemedText>
                      </View>
                    ) : (
                      argumentsList
                        .filter((a) => a.stance === "AGREE")
                        .map((arg) => renderSplitCard(arg, theme.success))
                    )}
                  </View>

                  {/* AGAINST Column */}
                  <View style={styles.splitColumn}>
                    <View
                      style={[
                        styles.splitColumnHeader,
                        { backgroundColor: "rgba(239, 44, 68, 0.08)" },
                      ]}
                    >
                      <View style={[styles.splitColumnDot, { backgroundColor: theme.danger }]} />
                      <Text style={[styles.splitColumnLabel, { color: theme.danger }]}>
                        {labels.DISAGREE}
                      </Text>
                    </View>
                    {argumentsList.filter((a) => a.stance === "DISAGREE").length === 0 ? (
                      <View style={styles.splitEmptyCol}>
                        <ThemedText
                          style={{ fontSize: 11, textAlign: "center" }}
                          themeColor="textSecondary"
                        >
                          Chưa có lập luận
                        </ThemedText>
                      </View>
                    ) : (
                      argumentsList
                        .filter((a) => a.stance === "DISAGREE")
                        .map((arg) => renderSplitCard(arg, theme.danger))
                    )}
                  </View>
                </View>
              ) : null}

              {/* Filtered full-width argument cards (when a specific stance is selected) */}
              {selectedStanceFilter !== "ALL" && filteredArguments.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <ThemedText themeColor="textSecondary">
                    Không tìm thấy lập luận nào cho bộ lọc này.
                  </ThemedText>
                </View>
              ) : selectedStanceFilter !== "ALL" ? (
                filteredArguments.map((arg) => {
                  const isExpanded = expandedArgumentId === arg.id;

                  // Split title and body from content if formatted
                  const matches = arg.argumentText.match(/^\*\*(.*?)\*\*\n\n([\s\S]*)/);
                  const displayTitle = matches ? matches[1] : "";
                  const displayBody = matches ? matches[2] : arg.argumentText;

                  return (
                    <View
                      key={arg.id}
                      style={[
                        styles.argumentCard,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      {/* Top Header */}
                      <View style={styles.argHeader}>
                        <View style={styles.userInfo}>
                          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                            <ThemedText style={styles.avatarText}>
                              {arg.user.fullName?.charAt(0).toUpperCase()}
                            </ThemedText>
                          </View>
                          <View style={{ marginLeft: Spacing.two }}>
                            <ThemedText style={styles.fullName}>{arg.user.fullName}</ThemedText>
                            <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                              TRIẾT GIA TẬP SỰ
                            </Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.stanceBadge,
                            {
                              backgroundColor:
                                arg.stance === "AGREE"
                                  ? "rgba(34, 197, 94, 0.15)"
                                  : arg.stance === "DISAGREE"
                                    ? "rgba(239, 44, 68, 0.15)"
                                    : "rgba(245, 158, 11, 0.15)",
                              borderColor:
                                arg.stance === "AGREE"
                                  ? theme.success
                                  : arg.stance === "DISAGREE"
                                    ? theme.danger
                                    : theme.warning,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.stanceBadgeText,
                              {
                                color:
                                  arg.stance === "AGREE"
                                    ? theme.success
                                    : arg.stance === "DISAGREE"
                                      ? theme.danger
                                      : theme.warning,
                              },
                            ]}
                          >
                            {labels[arg.stance]}
                          </Text>
                        </View>
                      </View>

                      {/* Content */}
                      <View style={styles.argContentBox}>
                        {displayTitle ? (
                          <ThemedText style={styles.argContentTitle} type="smallBold">
                            {displayTitle}
                          </ThemedText>
                        ) : null}
                        <ThemedText style={styles.argContentText}>{displayBody}</ThemedText>
                      </View>

                      {/* Score & Vote actions */}
                      <View style={[styles.argActions, { borderTopColor: theme.border }]}>
                        <View style={styles.voteControls}>
                          <AnimatedVoteButton
                            style={[
                              styles.voteBtn,
                              arg.userVote === "UP" && {
                                backgroundColor: "rgba(34, 197, 94, 0.15)",
                              },
                            ]}
                            onPress={() => handleVotePress(arg.id, VoteValue.UP)}
                          >
                            <ThumbsUp
                              size={16}
                              color={arg.userVote === "UP" ? theme.success : theme.icon}
                            />
                          </AnimatedVoteButton>

                          <ThemedText style={styles.voteCountText} type="smallBold">
                            {arg.voteCount}
                          </ThemedText>

                          <AnimatedVoteButton
                            style={[
                              styles.voteBtn,
                              arg.userVote === "DOWN" && {
                                backgroundColor: "rgba(239, 44, 68, 0.15)",
                              },
                            ]}
                            onPress={() => handleVotePress(arg.id, VoteValue.DOWN)}
                          >
                            <ThumbsDown
                              size={16}
                              color={arg.userVote === "DOWN" ? theme.danger : theme.icon}
                            />
                          </AnimatedVoteButton>
                        </View>

                        <Pressable
                          style={styles.commentToggleBtn}
                          onPress={() => setExpandedArgumentId(isExpanded ? null : arg.id)}
                        >
                          <MessageSquare size={16} color={theme.textSecondary} />
                          <ThemedText style={styles.commentToggleText} themeColor="textSecondary">
                            Phản biện ({arg.comments.length})
                          </ThemedText>
                        </Pressable>
                      </View>

                      {/* Comments / Discussion Section */}
                      {isExpanded && (
                        <View
                          style={[
                            styles.commentsSection,
                            {
                              borderTopColor: theme.border,
                              backgroundColor: theme.surfaceElevated,
                            },
                          ]}
                        >
                          <ThemedText
                            style={styles.commentsHeading}
                            type="label"
                            themeColor="textSecondary"
                          >
                            DANH SÁCH PHẢN BIỆN
                          </ThemedText>

                          {arg.comments.length === 0 ? (
                            <ThemedText style={styles.noCommentsText} themeColor="textSecondary">
                              Chưa có phản biện nào. Hãy đóng góp ý kiến của bạn!
                            </ThemedText>
                          ) : (
                            arg.comments.map((comment) => (
                              <View key={comment.id} style={styles.commentItem}>
                                <View style={styles.commentUserRow}>
                                  <View
                                    style={[styles.avatarMini, { backgroundColor: theme.primary }]}
                                  >
                                    <Text style={styles.avatarMiniText}>
                                      {comment.user.fullName?.charAt(0).toUpperCase()}
                                    </Text>
                                  </View>
                                  <ThemedText style={styles.commentUser} type="smallBold">
                                    {comment.user.fullName}
                                  </ThemedText>
                                </View>
                                <ThemedText style={styles.commentText}>
                                  {comment.commentText}
                                </ThemedText>
                              </View>
                            ))
                          )}

                          {/* Write Comment Box */}
                          <View style={styles.commentInputRow}>
                            <TextInput
                              style={[
                                styles.commentInput,
                                {
                                  borderColor: theme.border,
                                  backgroundColor: theme.surface,
                                  color: theme.text,
                                },
                              ]}
                              placeholder="Viết phản biện cho lập luận này..."
                              placeholderTextColor={theme.textMuted}
                              value={commentTextMap[arg.id] || ""}
                              onChangeText={(text) =>
                                setCommentTextMap((prev) => ({ ...prev, [arg.id]: text }))
                              }
                            />
                            <Pressable
                              style={[styles.sendCommentBtn, { backgroundColor: theme.primary }]}
                              onPress={() => handleCommentSubmit(arg.id)}
                              disabled={isPostingComment}
                            >
                              <Send size={16} color="#0C0C0E" />
                            </Pressable>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : null}
            </View>
          )}

          <View style={{ height: Spacing.five }} />
        </ScrollView>

        {/* Float CTA: Write Argument — navigates to dedicated argue screen */}
        <Pressable
          style={[styles.floatCta, { backgroundColor: theme.primary }]}
          onPress={() => router.push(`/debates/argue?debateId=${id}` as never)}
        >
          <Plus size={24} color="#0C0C0E" />
        </Pressable>

        {/* Modal-style Stance & Argument Wizard Overlay */}
        {isWritingArgument && (
          <View style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                ]}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <ThemedText style={styles.modalTitle} type="subtitle">
                    Viết lập luận của bạn
                  </ThemedText>
                  <Pressable
                    style={styles.modalCloseBtn}
                    onPress={() => setIsWritingArgument(false)}
                  >
                    <ThemedText themeColor="textSecondary">Hủy</ThemedText>
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScroll}
                >
                  {/* Step 1: Choose Stance */}
                  <ThemedText
                    style={styles.wizardLabel}
                    type="smallBold"
                    themeColor="textSecondary"
                  >
                    BƯỚC 1: CHỌN LẬP TRƯỜNG CỦA BẠN
                  </ThemedText>

                  <View style={styles.stanceOptionsWrapper}>
                    {[
                      {
                        value: "AGREE",
                        label: labels.AGREE,
                        desc: `Ủng hộ hoặc đứng từ góc nhìn ${labels.AGREE}`,
                      },
                      {
                        value: "DISAGREE",
                        label: labels.DISAGREE,
                        desc: `Ủng hộ hoặc đứng từ góc nhìn ${labels.DISAGREE}`,
                      },
                      {
                        value: "NEUTRAL",
                        label: labels.NEUTRAL,
                        desc: "Đứng trung lập hoặc đề xuất cách tổng hợp biện chứng",
                      },
                    ].map((item) => {
                      const isSelected = argumentStance === item.value;
                      return (
                        <Pressable
                          key={item.value}
                          style={[
                            styles.stanceCard,
                            {
                              backgroundColor: isSelected
                                ? theme.backgroundSelected
                                : theme.surface,
                              borderColor: isSelected ? theme.primary : theme.border,
                            },
                          ]}
                          onPress={() => setArgumentStance(item.value as StanceType)}
                        >
                          <ThemedText style={styles.stanceCardLabel} type="smallBold">
                            Phe {item.label}
                          </ThemedText>
                          <ThemedText style={styles.stanceCardDesc} themeColor="textSecondary">
                            {item.desc}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Step 2: Write/Preview Argument content */}
                  <ThemedText
                    style={[styles.wizardLabel, { marginTop: Spacing.four }]}
                    type="smallBold"
                    themeColor="textSecondary"
                  >
                    BƯỚC 2: PHÁT BIỂU LUẬN ĐIỂM
                  </ThemedText>

                  {isPreviewMode ? (
                    <View style={styles.previewContainer}>
                      <ThemedText
                        style={styles.previewHeading}
                        type="smallBold"
                        themeColor="primary"
                      >
                        XEM TRƯỚC LẬP LUẬN CỦA BẠN:
                      </ThemedText>
                      <View
                        style={[
                          styles.argumentCard,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.primary,
                            borderWidth: 2,
                            padding: Spacing.four,
                            marginTop: Spacing.two,
                            marginBottom: Spacing.four,
                          },
                        ]}
                      >
                        {/* Preview Header */}
                        <View style={styles.argHeader}>
                          <View style={styles.userInfo}>
                            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                              <ThemedText style={styles.avatarText}>U</ThemedText>
                            </View>
                            <View style={{ marginLeft: Spacing.two }}>
                              <ThemedText style={styles.fullName}>Bạn (Người dùng)</ThemedText>
                              <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                                TRIẾT GIA TẬP SỰ
                              </Text>
                            </View>
                          </View>

                          <View
                            style={[
                              styles.stanceBadge,
                              {
                                backgroundColor:
                                  argumentStance === "AGREE"
                                    ? "rgba(34, 197, 94, 0.15)"
                                    : argumentStance === "DISAGREE"
                                      ? "rgba(239, 44, 68, 0.15)"
                                      : "rgba(245, 158, 11, 0.15)",
                                borderColor:
                                  argumentStance === "AGREE"
                                    ? theme.success
                                    : argumentStance === "DISAGREE"
                                      ? theme.danger
                                      : theme.warning,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.stanceBadgeText,
                                {
                                  color:
                                    argumentStance === "AGREE"
                                      ? theme.success
                                      : argumentStance === "DISAGREE"
                                        ? theme.danger
                                        : theme.warning,
                                },
                              ]}
                            >
                              {labels[argumentStance]}
                            </Text>
                          </View>
                        </View>

                        {/* Preview Content */}
                        <View
                          style={[styles.argContentBox, { paddingHorizontal: 0, paddingBottom: 0 }]}
                        >
                          <ThemedText style={styles.argContentTitle} type="smallBold">
                            {argumentTitle.trim()}
                          </ThemedText>
                          <ThemedText style={styles.argContentText}>
                            {argumentBody.trim()}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={styles.inputContainer}>
                        <ThemedText
                          style={styles.inputLabel}
                          type="smallBold"
                          themeColor="textSecondary"
                        >
                          Luận điểm chính (Ngắn gọn dưới 100 chữ)
                        </ThemedText>
                        <TextInput
                          style={[
                            styles.textInputTitle,
                            {
                              borderColor: theme.border,
                              backgroundColor: theme.surface,
                              color: theme.text,
                            },
                          ]}
                          placeholder="Ví dụ: Hiện thực khách quan quyết định ý thức con người..."
                          placeholderTextColor={theme.textMuted}
                          value={argumentTitle}
                          onChangeText={(text) => {
                            if (text.length <= 100) setArgumentTitle(text);
                          }}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <ThemedText
                          style={styles.inputLabel}
                          type="smallBold"
                          themeColor="textSecondary"
                        >
                          Bằng chứng & Lập luận lý giải chi tiết
                        </ThemedText>
                        <TextInput
                          style={[
                            styles.textInputBody,
                            {
                              borderColor: theme.border,
                              backgroundColor: theme.surface,
                              color: theme.text,
                            },
                          ]}
                          placeholder="Phân tích thêm: Khoa học thần kinh chứng minh não bộ sinh ra ý thức..."
                          placeholderTextColor={theme.textMuted}
                          multiline
                          numberOfLines={6}
                          value={argumentBody}
                          onChangeText={setArgumentBody}
                        />
                        <ThemedText
                          style={{
                            color: argumentBody.trim().length >= 50 ? theme.success : theme.danger,
                            marginTop: Spacing.one,
                            fontSize: 11,
                            fontWeight: "600",
                          }}
                        >
                          {argumentBody.trim().length >= 50
                            ? `✓ Đạt độ dài tối thiểu (Hiện có: ${argumentBody.trim().length}/50 ký tự)`
                            : `✗ Cần tối thiểu 50 ký tự (Hiện có: ${argumentBody.trim().length}/50 ký tự)`}
                        </ThemedText>
                      </View>
                    </>
                  )}

                  {/* Toggle Preview Button */}
                  <Pressable
                    style={[
                      styles.previewToggleBtn,
                      {
                        borderColor: theme.primary,
                        backgroundColor: isPreviewMode ? theme.primary : "transparent",
                      },
                    ]}
                    onPress={() => setIsPreviewMode(!isPreviewMode)}
                    disabled={!argumentTitle.trim() || argumentBody.trim().length < 50}
                  >
                    <Text
                      style={[
                        styles.previewToggleBtnText,
                        {
                          color: isPreviewMode ? "#0C0C0E" : theme.primary,
                        },
                      ]}
                    >
                      {isPreviewMode ? "QUAY LẠI CHỈNH SỬA" : "XEM TRƯỚC LẬP LUẬN"}
                    </Text>
                  </Pressable>

                  {/* Step 3: Self rating strength slider */}
                  <ThemedText
                    style={[styles.wizardLabel, { marginTop: Spacing.four }]}
                    type="smallBold"
                    themeColor="textSecondary"
                  >
                    BƯỚC 3: ĐÁNH GIÁ SỨC MẠNH LUẬN ĐIỂM TRƯỚC KHI ĐĂNG
                  </ThemedText>

                  <View style={styles.ratingSection}>
                    <ThemedText
                      style={styles.ratingValueText}
                      type="smallBold"
                      themeColor="primary"
                    >
                      Độ thuyết phục: {convincingRating}% (
                      {convincingRating <= 40
                        ? "Trung bình"
                        : convincingRating <= 80
                          ? "Khá tốt"
                          : "Hoàn toàn tự tin"}
                      )
                    </ThemedText>

                    {/* Custom Segmented interactive bar */}
                    <View style={styles.ratingBarContainer}>
                      {[20, 40, 60, 80, 100].map((rating) => {
                        const isSelected = convincingRating === rating;
                        const isUnder = rating <= convincingRating;
                        return (
                          <Pressable
                            key={rating}
                            style={[
                              styles.ratingSegment,
                              {
                                backgroundColor: isSelected
                                  ? theme.primary
                                  : isUnder
                                    ? theme.primaryDark
                                    : theme.border,
                              },
                            ]}
                            onPress={() => setConvincingRating(rating)}
                          >
                            <Text
                              style={[
                                styles.ratingSegmentText,
                                isSelected && { color: "#0C0C0E", fontWeight: "bold" },
                              ]}
                            >
                              {rating}%
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <Pressable
                    style={[
                      styles.submitBtn,
                      {
                        backgroundColor: theme.success,
                        opacity: !argumentTitle.trim() || argumentBody.trim().length < 50 ? 0.6 : 1,
                      },
                    ]}
                    onPress={handlePostArgumentSubmit}
                    disabled={
                      !argumentTitle.trim() || argumentBody.trim().length < 50 || isPostingArgument
                    }
                  >
                    {isPostingArgument ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>ĐĂNG LẬP LUẬN</Text>
                    )}
                  </Pressable>

                  <View style={{ height: Spacing.five }} />
                </ScrollView>
              </View>
            </SafeAreaView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.five,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(47, 42, 36, 0.2)",
  },
  backBtn: {
    padding: Spacing.one,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: Spacing.four,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginVertical: Spacing.three,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#D97706",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  tabContent: {
    marginTop: Spacing.one,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: Spacing.three,
  },
  segmentedBar: {
    height: 12,
    borderRadius: Radius.full,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: Spacing.three,
  },
  barSegment: {
    height: "100%",
  },
  legendsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    marginRight: Spacing.one,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "500",
  },
  polarizationSection: {
    marginTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: "rgba(113, 113, 122, 0.15)",
    paddingTop: Spacing.three,
  },
  polarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  polarLabel: {
    fontSize: 14,
  },
  polarValue: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: Spacing.two,
  },
  sliderTrack: {
    height: 6,
    borderRadius: Radius.full,
    position: "relative",
  },
  sliderThumb: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    position: "absolute",
    top: -4,
    transform: [{ translateX: -7 }],
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: Spacing.two,
  },
  noteworthyCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.four,
    marginBottom: Spacing.two,
  },
  argHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#0C0C0E",
    fontWeight: "bold",
    fontSize: 16,
  },
  fullName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  stanceBadge: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  stanceBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  argText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  argFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  votesCountGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  footerVotesText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  viewDiscussionText: {
    fontSize: 11,
    fontWeight: "500",
  },
  reflectionSection: {
    marginBottom: Spacing.four,
  },
  reflectionCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: "center",
    gap: Spacing.two,
  },
  reflectTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reflectText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  reflectButtons: {
    width: "100%",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    width: "100%",
  },
  buttonTextBlack: {
    color: "#0C0C0E",
    fontWeight: "bold",
    fontSize: 14,
  },
  filterChipsContainer: {
    paddingVertical: Spacing.one,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginRight: Spacing.one,
  },
  chipText: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: Spacing.five,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    marginVertical: Spacing.three,
  },
  argumentCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: Spacing.three,
    overflow: "hidden",
  },
  argContentBox: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  argContentTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: Spacing.one,
  },
  argContentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  argActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
  },
  voteControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  voteBtn: {
    padding: Spacing.one,
    borderRadius: Radius.sm,
  },
  voteCountText: {
    fontSize: 13,
    minWidth: 16,
    textAlign: "center",
  },
  commentToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    padding: Spacing.one,
  },
  commentToggleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  commentsSection: {
    borderTopWidth: 1,
    padding: Spacing.three,
  },
  commentsHeading: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.8,
    marginBottom: Spacing.two,
  },
  noCommentsText: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: Spacing.two,
  },
  commentItem: {
    marginBottom: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(113, 113, 122, 0.08)",
  },
  commentUserRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.half,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.one,
  },
  avatarMiniText: {
    color: "#0C0C0E",
    fontSize: 10,
    fontWeight: "bold",
  },
  commentUser: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 24,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  commentInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    fontSize: 13,
  },
  sendCommentBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  floatCta: {
    position: "absolute",
    bottom: Spacing.four,
    right: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    backgroundColor: "rgba(12, 12, 14, 0.85)",
    zIndex: 999,
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    padding: Spacing.four,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(113, 113, 122, 0.15)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseBtn: {
    padding: Spacing.one,
  },
  modalScroll: {
    paddingBottom: Spacing.six,
  },
  wizardLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: Spacing.two,
  },
  stanceOptionsWrapper: {
    gap: Spacing.two,
  },
  stanceCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
  },
  stanceCardLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: Spacing.half,
  },
  stanceCardDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  inputContainer: {
    marginBottom: Spacing.three,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: Spacing.one,
  },
  textInputTitle: {
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
    fontWeight: "600",
  },
  textInputBody: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  ratingSection: {
    marginBottom: Spacing.four,
  },
  ratingValueText: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: Spacing.two,
  },
  ratingBarContainer: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  ratingSegment: {
    flex: 1,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingSegmentText: {
    fontSize: 11,
    color: "#FFFFFF",
  },
  submitBtn: {
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.8,
  },
  previewToggleBtn: {
    height: 44,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  previewToggleBtnText: {
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  previewContainer: {
    marginBottom: Spacing.two,
  },
  previewHeading: {
    fontSize: 11,
    marginBottom: Spacing.one,
  },

  /* ====== Split FOR / AGAINST View Styles ====== */
  splitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  splitHeaderTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  splitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  splitHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: Fonts.sans,
  },
  splitVsDivider: {
    width: 32,
    alignItems: "center",
  },
  vsText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: Fonts.sans,
  },
  neutralChip: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  splitColumnsContainer: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  splitColumn: {
    flex: 1,
  },
  splitColumnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    marginBottom: Spacing.two,
  },
  splitColumnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  splitColumnLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    fontFamily: Fonts.sans,
  },
  splitCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: Spacing.two,
    marginBottom: Spacing.two,
  },
  splitCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: Fonts.sans,
  },
  splitCardBody: {
    fontSize: 12,
    lineHeight: 17,
  },
  splitCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.one,
  },
  splitCardVotes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  splitCardVoteText: {
    fontSize: 11,
    fontWeight: "600",
  },
  splitCardAuthor: {
    fontSize: 10,
    fontWeight: "500",
  },
  splitEmptyCol: {
    paddingVertical: Spacing.four,
    alignItems: "center",
  },
});
