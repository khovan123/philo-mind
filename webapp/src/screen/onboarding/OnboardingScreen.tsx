import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { markOnboardingComplete } from "@/lib/onboarding-state";

const onboardingImage = require("@/assets/images/onboarding.png");

const steps = [
  {
    title: "Nhập vai nhân vật lịch sử",
    description:
      "Đặt mình vào vị trí của Socrates, Napoleon hay Khổng Tử. Đưa ra quyết định và khám phá hậu quả.",
    action: "Tiếp tục",
    accent: "#D97706",
  },
  {
    title: "Học bằng lựa chọn",
    description:
      "Mỗi tình huống là một ngã rẽ. Chọn phản hồi, nhìn thấy hệ quả, rồi hiểu sâu hơn về tư tưởng phía sau.",
    action: "Tiếp tục",
    accent: "#F59E0B",
  },
  {
    title: "Theo dõi tiến bộ triết học",
    description:
      "Xây dựng streak, mở khóa huy hiệu và lưu lại những câu chuyện đã hoàn thành trong hành trình học của bạn.",
    action: "Bắt đầu",
    accent: "#FB923C",
  },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || steps[steps.length - 1];

  async function handleNext() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    await markOnboardingComplete();
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.illustrationWrap}>
          <Image
            source={onboardingImage}
            contentFit="cover"
            contentPosition="center"
            transition={220}
            style={styles.illustrationImage}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {steps.map((item, index) => (
              <View
                key={item.title}
                style={[
                  styles.dot,
                  {
                    width: index === stepIndex ? 18 : 6,
                    backgroundColor: index === stepIndex ? step.accent : "#52525B",
                  },
                ]}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? "#B45309" : "#D97706",
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text style={styles.buttonText}>{step.action}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C0C0E",
  },
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 18,
    backgroundColor: "#0C0C0E",
  },
  illustrationWrap: {
    width: "100%",
    height: "62%",
    minHeight: 420,
    marginTop: 0,
    overflow: "hidden",
    borderRadius: 0,
    backgroundColor: "#111113",
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    alignItems: "center",
    marginTop: 22,
    paddingHorizontal: 12,
  },
  title: {
    color: "#F4F4F5",
    textAlign: "center",
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "800",
  },
  description: {
    marginTop: 10,
    maxWidth: 360,
    color: "#C4C4C7",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    gap: 22,
    paddingTop: 22,
    paddingHorizontal: 8,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
  button: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
});
