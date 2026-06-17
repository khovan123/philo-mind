import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, ChevronRight, MessageSquare, TrendingUp } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useListDebatesQuery, type DebateListItemDTO } from "@/services/rtk-api/debate.api";
import { Fonts, Radius, Spacing } from "@/constants/theme";

const DEBATE_BANNER_BG =
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop";

export default function DebateListScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { data: debates, isLoading, error } = useListDebatesQuery();

  const handleDebatePress = (id: string) => {
    router.push({
      pathname: "/debates/[id]" as any,
      params: { id },
    });
  };

  // Find the featured debate (we can default to the second debate "Vật chất hay ý thức" or the first one)
  const featuredDebate =
    debates?.find((d) => d.title.includes("Vật chất hay ý thức")) || debates?.[0];
  const hotDebates = debates?.filter((d) => d.id !== featuredDebate?.id).slice(0, 3) || [];
  const otherDebates =
    debates?.filter((d) => d.id !== featuredDebate?.id && !hotDebates.includes(d)) || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader />

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText style={{ marginTop: Spacing.two }} themeColor="textSecondary">
              Đang tải danh sách tranh luận...
            </ThemedText>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText style={{ color: theme.danger }}>
              Không thể tải danh sách cuộc tranh luận. Vui lòng thử lại sau.
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Title Section */}
            <View style={styles.headerTitleContainer}>
              <ThemedText style={styles.title} type="title">
                Tranh luận
              </ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Rèn tư duy phản biện qua các vấn đề triết học
              </ThemedText>
            </View>

            {/* Featured Debate Card */}
            {featuredDebate && (
              <Pressable
                style={styles.featuredCard}
                onPress={() => handleDebatePress(featuredDebate.id)}
              >
                <Image source={{ uri: DEBATE_BANNER_BG }} style={StyleSheet.absoluteFillObject} />
                <View style={styles.scrim} />

                <View style={styles.featuredContent}>
                  <View style={styles.featuredTag}>
                    <ThemedText style={styles.featuredTagText}>DEBATE NỔI BẬT</ThemedText>
                  </View>

                  <ThemedText style={styles.featuredTitle}>{featuredDebate.title}</ThemedText>

                  <ThemedText style={styles.featuredDesc} numberOfLines={3}>
                    {featuredDebate.description}
                  </ThemedText>

                  <View style={styles.featuredStats}>
                    <ThemedText style={styles.featuredStatText}>Chương 1</ThemedText>
                    <ThemedText style={styles.statDot}>•</ThemedText>
                    <ThemedText style={styles.featuredStatText}>
                      {1248 + (featuredDebate.counts?.total || 0)} người tham gia
                    </ThemedText>
                    <ThemedText style={styles.statDot}>•</ThemedText>
                    <ThemedText style={styles.featuredStatText}>
                      {featuredDebate.counts?.total || 0} lập luận nổi bật
                    </ThemedText>
                  </View>

                  <Pressable
                    style={styles.featuredButton}
                    onPress={() => handleDebatePress(featuredDebate.id)}
                  >
                    <Text style={styles.featuredButtonText}>Tham gia tranh luận</Text>
                    <ArrowRight size={16} color="#0C0C0E" style={{ marginLeft: Spacing.one }} />
                  </Pressable>
                </View>
              </Pressable>
            )}

            {/* Hot Topics Section */}
            {hotDebates.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle} type="subtitle">
                    Chủ đề hot
                  </ThemedText>
                  <Pressable>
                    <ThemedText style={styles.viewAllText} themeColor="primary">
                      Xem tất cả
                    </ThemedText>
                  </Pressable>
                </View>

                {hotDebates.map((debate, index) => {
                  const tags = ["Độ tin cậy", "Phương pháp luận", "Khả tri / Bất khả tri"];
                  const tag = tags[index % tags.length];

                  return (
                    <Pressable
                      key={debate.id}
                      style={[
                        styles.hotCard,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => handleDebatePress(debate.id)}
                    >
                      <View style={styles.hotCardHeader}>
                        <View style={styles.hotTag}>
                          <Text style={styles.hotTagText}>{tag.toUpperCase()}</Text>
                        </View>
                        <TrendingUp size={16} color={theme.primary} />
                      </View>

                      <ThemedText style={styles.hotTitle}>{debate.title}</ThemedText>

                      <View style={styles.hotStats}>
                        <MessageSquare size={14} color={theme.textSecondary} />
                        <ThemedText style={styles.hotStatsText} themeColor="textSecondary">
                          {debate.counts?.total || 0} lập luận
                        </ThemedText>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Chapters Section */}
            {otherDebates.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle} type="subtitle">
                  Chủ đề theo chương
                </ThemedText>

                <View
                  style={[
                    styles.chapterList,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  {otherDebates.map((debate) => (
                    <Pressable
                      key={debate.id}
                      style={[styles.chapterItem, { borderBottomColor: theme.border }]}
                      onPress={() => handleDebatePress(debate.id)}
                    >
                      <View style={{ flex: 1, paddingRight: Spacing.two }}>
                        <ThemedText style={styles.chapterItemText}>{debate.title}</ThemedText>
                      </View>
                      <ChevronRight size={18} color={theme.textSecondary} />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Noteworthy Argument Section */}
            <View style={styles.section}>
              <View
                style={[
                  styles.quoteCard,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.quoteIcon, { color: theme.primary }]}>“</Text>
                <ThemedText style={styles.quoteText}>
                  Duy vật không phủ nhận vai trò của ý thức, mà đặt ý thức trong mối quan hệ với
                  điều kiện vật chất.
                </ThemedText>

                <View style={styles.quoteFooter}>
                  <View style={styles.authorRow}>
                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                      <Text style={styles.avatarLetter}>M</Text>
                    </View>
                    <View style={{ marginLeft: Spacing.two }}>
                      <ThemedText style={styles.authorName}>Minh Anh</ThemedText>
                      <Text style={[styles.authorTitle, { color: theme.textSecondary }]}>
                        TRIẾT GIA TẬP SỰ
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.likesBadge, { backgroundColor: "rgba(217, 119, 6, 0.15)" }]}>
                    <ThemedText style={[styles.likesText, { color: theme.primary }]}>
                      👍 132
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ height: Spacing.six }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.five,
  },
  headerTitleContainer: {
    marginVertical: Spacing.three,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: "italic",
  },
  featuredCard: {
    height: 340,
    borderRadius: Radius.lg,
    overflow: "hidden",
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.3)",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 12, 14, 0.75)",
  },
  featuredContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Spacing.four,
  },
  featuredTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(217, 119, 6, 0.2)",
    borderWidth: 1,
    borderColor: "#D97706",
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    marginBottom: Spacing.two,
  },
  featuredTagText: {
    color: "#FDBA74",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: Spacing.two,
  },
  featuredDesc: {
    fontSize: 13,
    color: "#E4E4E7",
    opacity: 0.85,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  featuredStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  featuredStatText: {
    fontSize: 11,
    color: "#A1A1AA",
  },
  statDot: {
    color: "#71717A",
    marginHorizontal: Spacing.two,
  },
  featuredButton: {
    backgroundColor: "#FDBA74",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
  featuredButtonText: {
    color: "#0C0C0E",
    fontWeight: "bold",
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  hotCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  hotCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  hotTag: {
    backgroundColor: "rgba(113, 113, 122, 0.15)",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  hotTagText: {
    color: "#A1A1AA",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  hotTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  hotStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  hotStatsText: {
    fontSize: 12,
  },
  chapterList: {
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  chapterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
  },
  chapterItemText: {
    fontSize: 14,
    fontWeight: "500",
  },
  quoteCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.four,
    position: "relative",
  },
  quoteIcon: {
    fontSize: 48,
    fontFamily: Fonts.serif,
    position: "absolute",
    top: Spacing.one,
    left: Spacing.three,
    opacity: 0.15,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: Spacing.four,
    paddingTop: Spacing.two,
  },
  quoteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "#0C0C0E",
    fontWeight: "bold",
    fontSize: 14,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  authorTitle: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  likesBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  likesText: {
    fontSize: 11,
    fontWeight: "bold",
  },
});
