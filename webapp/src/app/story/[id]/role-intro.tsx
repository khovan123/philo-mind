import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen, Brain, Compass, Sparkles } from "lucide-react-native";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";
import { useStoryStore } from "@/stores/story.store";
import { rolesCatalog, defaultRoles } from "@/features/story/rolesData";

export default function RoleIntroScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { data: story, isLoading, error } = useGetStoryDetailQuery(storyId);
  const { selectedRoleId } = useStoryStore();

  // Find selected role
  const role = useMemo(() => {
    if (!story) return null;
    const roles = rolesCatalog[story.title] || defaultRoles(story.title, story.characterRole);
    return roles.find((r) => r.id === selectedRoleId) || roles[0]; // fallback to first role if not found
  }, [story, selectedRoleId]);

  const handleStartGameplay = () => {
    // Navigate to Step 5: Exploration Map
    router.push(`/story/${storyId}/map` as never);
  };

  const renderHighlightedText = (text: string, concepts: string[]) => {
    if (!concepts || concepts.length === 0) {
      return (
        <ThemedText type="small" themeColor="textSecondary" style={styles.bioBody}>
          {text}
        </ThemedText>
      );
    }

    const escapedConcepts = concepts.map((c) => c.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    const regex = new RegExp(`(${escapedConcepts.join("|")})`, "gi");
    const parts = text.split(regex);

    return (
      <ThemedText type="small" themeColor="textSecondary" style={styles.bioBody}>
        {parts.map((part, index) => {
          const isMatch = concepts.some((concept) => concept.toLowerCase() === part.toLowerCase());
          if (isMatch) {
            return (
              <ThemedText key={index} style={{ color: theme.primary, fontWeight: "800" }}>
                {part}
              </ThemedText>
            );
          }
          return part;
        })}
      </ThemedText>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
            Đang chuẩn bị hồ sơ nhân vật...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !story || !role) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ThemedText type="subtitle" style={{ color: theme.danger }}>
            Lỗi nạp hồ sơ nhân vật
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", marginVertical: Spacing.three }}
          >
            Không thể xác thực thông tin nhân vật đã chọn.
          </ThemedText>
          <Button
            title="Quay lại chọn vai"
            onPress={() => router.replace(`/story/${storyId}/role-selection` as never)}
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
          onPress={() => router.replace(`/story/${storyId}/role-selection` as never)}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <ArrowLeft color={theme.text} size={20} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">Hồ sơ nhân vật</ThemedText>
          <ThemedText type="label" themeColor="textSecondary">
            Bước 4/7 • Thiết lập ban đầu
          </ThemedText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Identity Hero */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.avatarBadge,
              { backgroundColor: "rgba(217, 119, 6, 0.08)", borderColor: theme.primary + "33" },
            ]}
          >
            <Compass color={theme.primary} size={36} />
          </View>
          <ThemedText type="subtitle" style={styles.heroName}>
            {role.name}
          </ThemedText>
          <ThemedText type="label" themeColor="textSecondary" style={styles.heroSubtitle}>
            Vai trò: {role.roleName} • {role.age} tuổi
          </ThemedText>
        </View>

        {/* Philosophy Card */}
        <Card style={[styles.introCard, { borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Brain size={18} color={theme.primary} />
            <ThemedText type="smallBold" style={{ color: theme.primaryLight }}>
              Lý tưởng triết học chủ đạo
            </ThemedText>
          </View>
          <ThemedText type="smallBold" style={styles.idealTitle}>
            {role.ideal}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
            Đây là hệ thống thế giới quan cốt lõi mà nhân vật đại diện, định hình cách họ diễn giải
            thực tế và cân nhắc các quyết định đạo đức tiếp theo.
          </ThemedText>
        </Card>

        {/* Psychology Card */}
        <Card style={[styles.introCard, { borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color={theme.primaryLight} />
            <ThemedText type="smallBold" themeColor="textSecondary">
              Trạng thái tâm lý
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardText}>
            {role.psychology}
          </ThemedText>
        </Card>

        {/* Description Bio & Concept Highlights */}
        <Card style={[styles.introCard, { borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <BookOpen size={18} color={theme.textMuted} />
            <ThemedText type="smallBold" themeColor="textSecondary">
              Bối cảnh & Tình thế lựa chọn
            </ThemedText>
          </View>

          {renderHighlightedText(role.description, role.highlightConcepts)}

          {/* Highlighted Concepts Box */}
          <View style={styles.conceptBox}>
            <ThemedText
              type="label"
              themeColor="textSecondary"
              style={{ fontWeight: "700", marginBottom: Spacing.two }}
            >
              Khái niệm triết học cần lưu ý:
            </ThemedText>
            <View style={styles.tagGroup}>
              {role.highlightConcepts.map((concept) => (
                <View
                  key={concept}
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: "rgba(217, 119, 6, 0.08)",
                      borderColor: theme.primary + "33",
                    },
                  ]}
                >
                  <ThemedText type="label" style={{ color: theme.primary, fontWeight: "700" }}>
                    {concept}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Play Action Footer */}
        <View style={styles.footer}>
          <Button title="Vào câu chuyện" onPress={handleStartGameplay} fullWidth />
        </View>
      </ScrollView>
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
  scrollContainer: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: Spacing.two,
    gap: Spacing.one,
  },
  avatarBadge: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  heroName: {
    fontSize: 24,
    fontWeight: "900",
  },
  heroSubtitle: {
    fontWeight: "600",
  },
  introCard: {
    padding: Spacing.four,
    borderWidth: 1,
    borderRadius: Radius.md,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.half,
  },
  idealTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  cardDesc: {
    lineHeight: 18,
  },
  cardText: {
    lineHeight: 18,
  },
  bioBody: {
    lineHeight: 20,
    fontSize: 14,
  },
  conceptBox: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  tagGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  tagBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  footer: {
    marginTop: Spacing.two,
    marginBottom: Spacing.five,
  },
});
