import { Image } from "expo-image";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react-native";
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Fonts, Radius, Spacing } from "@/constants/theme";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  surfaceSoft: "#18181B",
  input: "#1E1E22",
  chip: "#27272A",
  border: "#353437",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  locked: "#52525B",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  primaryText: "#0C0C0E",
};

const featuredImage =
  "https://lh3.googleusercontent.com/aida/ADBb0uhB-BsNh_Qy7s6akK1COFe_ezvtoKv-rL3DQfw0HQaL96njTcP3KNp2pMCO15nzCnD0Bdkq3XO8B7uxVMIsK4jyNnJTRUnEeiN0BDMnsilmtR5ITDbnHNNgY1VmcZNNeMfHCWnKO10H-r0_bPpCvxFutPxvx7zn_Pxyr6bkr22qEzKFJ52m0XOKIlQqVl2kXiUzOxTREEGwi-z5HVNoGTTJIoNRL0pdLhSQ8tp_Y2rylPldVEoeheiiMfzw";

const filters = ["Tất cả", "Đạo đức", "Lịch sử", "Chính trị", "Xã hội"];

const featuredLessons = [
  {
    title: "Tự do là gì? Khám phá góc nhìn của Sartre",
    category: "Hiện sinh",
    duration: "5 phút",
    description:
      "Hành trình tìm kiếm ý nghĩa cá nhân trong một thế giới không có bản thiết kế sẵn.",
    image: featuredImage,
  },
  {
    title: "Khế ước xã hội hiện đại",
    category: "Xã hội",
    duration: "8 phút",
    description: "Vì sao con người chấp nhận giới hạn tự do để cùng sống trong trật tự?",
    image: null,
  },
];

const topics = [
  { title: "Đạo đức", lessons: "12 bài học", progress: 34 },
  { title: "Hạnh phúc", lessons: "8 bài học", progress: 66 },
  { title: "Công bằng", lessons: "15 bài học", progress: 25 },
  { title: "Hiện sinh", lessons: "20 bài học", progress: 100 },
  { title: "Logic", lessons: "10 bài học", progress: 50 },
  { title: "AI Ethics", lessons: "6 bài học", progress: 12 },
];

export default function ExploreScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.titleBlock}>
            <ThemedText style={styles.title}>Khám phá</ThemedText>
            <ThemedText style={styles.subtitle}>
              Tìm chủ đề, bài học và câu hỏi triết học để tiếp tục hành trình.
            </ThemedText>
          </View>

          <View style={styles.searchBox}>
            <Search color={Colors.locked} size={18} />
            <TextInput
              placeholder="Tìm chủ đề, triết gia..."
              placeholderTextColor={Colors.locked}
              selectionColor={Colors.primaryLight}
              style={styles.searchInput}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {filters.map((filter, index) => {
              const active = index === 0;

              return (
                <Pressable key={filter} style={[styles.filterChip, active && styles.filterActive]}>
                  <ThemedText style={[styles.filterText, active && styles.filterTextActive]}>
                    {filter}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Nổi bật</ThemedText>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {featuredLessons.map((lesson) => (
                <Pressable key={lesson.title} style={styles.featuredCard}>
                  {lesson.image ? (
                    <Image source={lesson.image} contentFit="cover" style={styles.featuredImage} />
                  ) : (
                    <View style={styles.featuredFallback}>
                      <BookOpen color={Colors.locked} size={40} />
                    </View>
                  )}

                  <View style={styles.featuredBody}>
                    <View style={styles.featuredMeta}>
                      <ThemedText style={styles.featuredCategory}>{lesson.category}</ThemedText>
                      <View style={styles.metaDot} />
                      <ThemedText style={styles.featuredDuration}>{lesson.duration}</ThemedText>
                    </View>

                    <ThemedText style={styles.featuredTitle}>{lesson.title}</ThemedText>
                    <ThemedText numberOfLines={2} style={styles.featuredDescription}>
                      {lesson.description}
                    </ThemedText>

                    <Pressable style={styles.startButton}>
                      <ThemedText style={styles.startButtonText}>Bắt đầu học</ThemedText>
                      <ArrowRight color={Colors.primaryText} size={16} />
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Chủ đề</ThemedText>

            <View style={styles.topicGrid}>
              {topics.map((topic) => (
                <Pressable key={topic.title} style={styles.topicCard}>
                  <View style={styles.topicCopy}>
                    <ThemedText style={styles.topicTitle}>{topic.title}</ThemedText>
                    <ThemedText style={styles.topicLessons}>{topic.lessons}</ThemedText>
                  </View>

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${topic.progress}%` }]} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.quoteCard}>
            <Sparkles color={Colors.primaryLight} size={16} />
            <View style={styles.quoteCopy}>
              <ThemedText style={styles.quoteText}>
                Cuộc đời không được khảo sát thì không đáng sống.
              </ThemedText>
              <ThemedText style={styles.quoteAuthor}>- Socrates</ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + 120,
    gap: Spacing.three,
    maxWidth: 820,
    width: "100%",
    alignSelf: "center",
  },

  titleBlock: {
    gap: Spacing.one,
  },

  title: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  searchBox: {
    minHeight: 46,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.input,
    borderWidth: 1,
    borderColor: "transparent",
  },

  searchInput: {
    flex: 1,
    minHeight: 44,
    color: Colors.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: "600",
    padding: 0,
  },

  filterList: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },

  filterChip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: Colors.input,
  },

  filterActive: {
    borderColor: Colors.primary,
  },

  filterText: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },

  filterTextActive: {
    color: Colors.primaryLight,
  },

  section: {
    gap: Spacing.two,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
  },

  featuredList: {
    gap: Spacing.three,
    paddingRight: Spacing.three,
  },

  featuredCard: {
    width: Platform.select({ web: 360, default: 300 }),
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    backgroundColor: Colors.surfaceSoft,
    overflow: "hidden",
  },

  featuredImage: {
    width: "100%",
    height: 190,
  },

  featuredFallback: {
    width: "100%",
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.input,
  },

  featuredBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },

  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  featuredCategory: {
    color: Colors.primaryLight,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  metaDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.locked,
  },

  featuredDuration: {
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
  },

  featuredTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },

  featuredDescription: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  startButton: {
    minHeight: 42,
    borderRadius: Radius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    backgroundColor: Colors.primary,
  },

  startButtonText: {
    color: Colors.primaryText,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },

  topicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },

  topicCard: {
    width: "48%",
    minHeight: 128,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.chip,
    padding: Spacing.three,
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
  },

  topicCopy: {
    gap: Spacing.half,
  },

  topicTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },

  topicLessons: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  progressTrack: {
    height: 4,
    borderRadius: Radius.full,
    overflow: "hidden",
    backgroundColor: Colors.input,
  },

  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  quoteCard: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Colors.chip,
  },

  quoteCopy: {
    flex: 1,
    paddingLeft: Spacing.two,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    gap: Spacing.one,
  },

  quoteText: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    fontWeight: "600",
  },

  quoteAuthor: {
    color: Colors.primaryLight,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
