import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Brain, Lock, Sparkles, User } from "lucide-react-native";
import { useState, useRef, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
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
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import { rolesCatalog, defaultRoles } from "@/features/story/rolesData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RoleSelectionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { data: story, isLoading, error } = useGetStoryDetailQuery(storyId);
  const { setSelectedRoleId } = useStoryStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get roles for this story scenario
  const roles = useMemo(() => {
    if (!story) return [];
    const matchedRoles = rolesCatalog[story.title];
    return matchedRoles || defaultRoles(story.title, story.characterRole);
  }, [story]);

  const activeRole = roles[activeIndex];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < roles.length) {
      setActiveIndex(index);
    }
  };

  const handleSelectRole = () => {
    if (!activeRole || activeRole.status === "locked") return;

    // Save to Redux store
    setSelectedRoleId(activeRole.id);

    // Redirect to Step 4: Role Intro screen
    router.push(`/story/${storyId}/role-intro` as never);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
            Đang tải thông tin nhân vật...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !story) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <ThemedText type="subtitle" style={{ color: theme.danger }}>
            Đã có lỗi xảy ra
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", marginVertical: Spacing.three }}
          >
            Không thể tải dữ liệu kịch bản. Vui lòng quay lại danh sách.
          </ThemedText>
          <Button
            title="Quay lại"
            onPress={() => router.replace("/story" as never)}
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
          onPress={() => router.replace(`/story/${storyId}` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Vai trò nhân vật</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 3/7 • Lựa chọn góc nhìn
          </ThemedText>
        </View>
      </View>

      {/* Intro copy */}
      <View style={styles.introContainer}>
        <ThemedText type="subtitle" style={styles.introTitle}>
          Chọn một góc nhìn
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.introDesc}>
          Cùng một câu chuyện, nhưng trải nghiệm và quyết định sẽ thay đổi theo lăng kính của nhân
          vật bạn chọn.
        </ThemedText>
      </View>

      {/* Swipeable List */}
      <View style={styles.listContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {roles.map((role, idx) => {
            const isLocked = role.status === "locked";
            const isActive = idx === activeIndex;

            return (
              <View key={role.id} style={styles.slideWidth}>
                <Card
                  style={[
                    styles.card,
                    {
                      borderColor: isActive
                        ? isLocked
                          ? theme.border
                          : theme.primary
                        : "rgba(255,255,255,0.05)",
                      backgroundColor: theme.backgroundElement,
                      shadowColor: isLocked ? "transparent" : theme.primary,
                    },
                  ]}
                >
                  {/* Status Badge */}
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isLocked
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(16, 185, 129, 0.1)",
                        },
                      ]}
                    >
                      <ThemedText
                        type="label"
                        style={{
                          color: isLocked ? theme.danger : theme.success,
                          fontWeight: "800",
                          fontSize: 11,
                        }}
                      >
                        {isLocked ? "ĐANG KHÓA" : "SẴN SÀNG"}
                      </ThemedText>
                    </View>
                    <ThemedText type="label" themeColor="textSecondary" style={styles.roleNameText}>
                      {role.roleName}
                    </ThemedText>
                  </View>

                  {/* Character Name & Age */}
                  <View style={styles.nameRow}>
                    <View style={styles.avatarIconPlaceholder}>
                      <User color={isLocked ? theme.textMuted : theme.primaryLight} size={28} />
                    </View>
                    <View>
                      <ThemedText style={styles.charName}>{role.name}</ThemedText>
                      <ThemedText type="label" themeColor="textSecondary">
                        Tuổi: {role.age}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Philosophy Ideal */}
                  <View style={[styles.sectionBox, { backgroundColor: "rgba(255,255,255,0.02)" }]}>
                    <View style={styles.sectionHeader}>
                      <Brain size={16} color={theme.primary} />
                      <ThemedText type="smallBold" style={{ color: theme.primaryLight }}>
                        Lý tưởng triết học
                      </ThemedText>
                    </View>
                    <ThemedText type="small" style={styles.idealText}>
                      {role.ideal}
                    </ThemedText>
                  </View>

                  {/* Psychology Stance */}
                  <View style={styles.sectionBox}>
                    <View style={styles.sectionHeader}>
                      <Sparkles size={16} color={theme.primaryLight} />
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        Đặc điểm tâm lý
                      </ThemedText>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                      {role.psychology}
                    </ThemedText>
                  </View>

                  {/* Brief Info */}
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      type="label"
                      themeColor="textSecondary"
                      style={{ marginBottom: Spacing.half }}
                    >
                      Tóm tắt bối cảnh:
                    </ThemedText>
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      numberOfLines={3}
                      style={styles.bioText}
                    >
                      {role.description}
                    </ThemedText>
                  </View>

                  {/* Lock Overlay Content */}
                  {isLocked && (
                    <View
                      style={[
                        styles.lockBanner,
                        {
                          backgroundColor: "rgba(255, 60, 60, 0.04)",
                          borderColor: theme.danger + "22",
                        },
                      ]}
                    >
                      <Lock size={16} color={theme.danger} />
                      <ThemedText
                        type="label"
                        style={{ color: theme.danger, fontWeight: "700", flex: 1 }}
                      >
                        {role.lockMessage || "Hoàn thành vai chính để mở khóa"}
                      </ThemedText>
                    </View>
                  )}
                </Card>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationRow}>
        {roles.map((_, idx) => {
          const isActive = idx === activeIndex;
          return (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? theme.primary : "rgba(255,255,255,0.2)",
                  width: isActive ? 16 : 8,
                },
              ]}
            />
          );
        })}
      </View>

      {/* CTA Footer */}
      <View style={styles.footer}>
        <Button
          title={activeRole?.status === "locked" ? "Vai trò đang khóa" : "Chọn nhân vật này"}
          onPress={handleSelectRole}
          disabled={activeRole?.status === "locked"}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
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
  introContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  introTitle: {
    fontWeight: "900",
    marginBottom: Spacing.one,
  },
  introDesc: {
    lineHeight: 18,
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  slideWidth: {
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.four,
    justifyContent: "center",
  },
  card: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    minHeight: 380,
    gap: Spacing.three,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  roleNameText: {
    fontWeight: "700",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  avatarIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  charName: {
    fontSize: 20,
    fontWeight: "900",
  },
  sectionBox: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    gap: Spacing.one,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.half,
  },
  idealText: {
    fontWeight: "700",
  },
  bioText: {
    lineHeight: 18,
  },
  lockBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.two,
    marginVertical: Spacing.three,
  },
  dot: {
    height: 8,
    borderRadius: Radius.full,
  },
  footer: {
    padding: Spacing.four,
  },
});
