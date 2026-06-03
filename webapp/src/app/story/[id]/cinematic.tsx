import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, ArrowRight, Film, Landmark, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useGetStoryDetailQuery } from "@/services/rtk-api/story.api";

export default function CinematicOpeningScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;

  const { data: story, isLoading, error } = useGetStoryDetailQuery(storyId || "");

  // Animation values using stable useState initializers to avoid ref-render warning
  const [fadeAnimEra] = useState(() => new Animated.Value(0));
  const [fadeAnimIntro] = useState(() => new Animated.Value(0));
  const [fadeAnimRole] = useState(() => new Animated.Value(0));
  const [fadeAnimBtn] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (story) {
      // Reset values
      fadeAnimEra.setValue(0);
      fadeAnimIntro.setValue(0);
      fadeAnimRole.setValue(0);
      fadeAnimBtn.setValue(0);

      Animated.sequence([
        Animated.timing(fadeAnimEra, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(400),
        Animated.timing(fadeAnimIntro, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(400),
        Animated.timing(fadeAnimRole, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(400),
        Animated.timing(fadeAnimBtn, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [story, fadeAnimEra, fadeAnimIntro, fadeAnimRole, fadeAnimBtn]);

  function handleContinue() {
    router.push(`/story/${storyId}/role-selection` as never);
  }

  function handleSkip() {
    router.push(`/story/${storyId}/role-selection` as never);
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, styles.centerContainer, { backgroundColor: "#000000" }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
          Đang chiếu chương kịch bản...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (error || !story) {
    return (
      <SafeAreaView
        style={[styles.safeArea, styles.centerContainer, { backgroundColor: "#000000" }]}
      >
        <Card style={styles.errorCard}>
          <AlertCircle color={theme.danger} size={32} />
          <ThemedText type="smallBold">Không thể tải bối cảnh điện ảnh</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            {error ? String(JSON.stringify(error)) : "Không tìm thấy dữ liệu kịch bản."}
          </ThemedText>
          <Button title="Quay lại" onPress={() => router.back()} variant="outline" />
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.safeArea, { backgroundColor: "#000000" }]}
    >
      {/* Top Header Controls */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Film color={theme.primary} size={18} />
          <ThemedText type="label" style={{ color: theme.primary, marginLeft: Spacing.one }}>
            CINEMATIC PROLOGUE
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleSkip}
          style={({ pressed }) => [
            styles.skipBtn,
            { backgroundColor: "rgba(255,255,255,0.06)" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <ThemedText type="label" style={{ color: theme.textSecondary }}>
            Bỏ qua
          </ThemedText>
          <ArrowRight color={theme.textSecondary} size={14} style={{ marginLeft: Spacing.one }} />
        </Pressable>
      </View>

      {/* Main Cinematic Scrolling Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* Phase 1: Era / Historical Setting */}
          <Animated.View style={{ opacity: fadeAnimEra, width: "100%", alignItems: "center" }}>
            <View style={[styles.badgeContainer, { backgroundColor: "rgba(217, 119, 6, 0.1)" }]}>
              <Landmark color={theme.primaryLight} size={16} />
              <ThemedText type="label" style={styles.badgeText}>
                {story.topic.title}
              </ThemedText>
            </View>
            <ThemedText style={styles.eraText}>
              {story.historicalContext || "Bối Cảnh Lịch Sử"}
            </ThemedText>
            <View style={styles.separator} />
          </Animated.View>

          {/* Phase 2: Narrative / Story Crisis Context */}
          <Animated.View style={{ opacity: fadeAnimIntro, width: "100%" }}>
            <Card style={[styles.contextCard, { backgroundColor: "rgba(26, 26, 26, 0.4)" }]}>
              <ThemedText type="default" style={styles.narrativeText}>
                {story.description}
              </ThemedText>
            </Card>
          </Animated.View>

          {/* Phase 3: Character Briefing */}
          {story.characterRole && (
            <Animated.View style={{ opacity: fadeAnimRole, width: "100%" }}>
              <Card
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: "rgba(32, 32, 36, 0.4)",
                    borderColor: "rgba(217, 119, 6, 0.2)",
                  },
                ]}
              >
                <View style={styles.roleHeader}>
                  <User color={theme.primary} size={18} />
                  <ThemedText
                    type="smallBold"
                    style={{ color: theme.primary, marginLeft: Spacing.two }}
                  >
                    VAI TRÒ CỦA BẠN
                  </ThemedText>
                </View>
                <ThemedText type="small" style={styles.roleText}>
                  {story.characterRole}
                </ThemedText>
              </Card>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Phase 4: Action Button */}
      <Animated.View style={[styles.footer, { opacity: fadeAnimBtn }]}>
        <Button title="Tiếp tục" onPress={handleContinue} fullWidth style={styles.continueBtn} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  contentWrapper: {
    alignItems: "center",
    gap: Spacing.four,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    marginBottom: Spacing.three,
  },
  badgeText: {
    color: "#FDBA74",
    marginLeft: Spacing.one,
  },
  eraText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#D97706",
    textAlign: "center",
    lineHeight: 30,
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.two,
  },
  separator: {
    width: 60,
    height: 2,
    backgroundColor: "#92400E",
    marginVertical: Spacing.four,
  },
  contextCard: {
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    borderRadius: Radius.lg,
  },
  narrativeText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#E4E4E7",
    textAlign: "justify",
  },
  roleCard: {
    padding: Spacing.four,
    borderWidth: 1,
    borderRadius: Radius.lg,
    marginTop: Spacing.two,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  roleText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#A1A1AA",
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  continueBtn: {
    backgroundColor: "#D97706",
  },
  errorCard: {
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.four,
  },
  centerText: {
    textAlign: "center",
  },
});
