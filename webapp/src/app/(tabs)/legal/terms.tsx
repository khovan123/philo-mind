import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppHeader } from "@/components/app-header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Spacing } from "@/constants/theme";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  primary: "#D97706",
};

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Terms of Service from data file
    // In a real app, this would be fetched from an API
    // For now, we'll use inline content
    const tosContent = `# Điều Khoản Dịch Vụ (Terms of Service)

## 1. Giới Thiệu

Chào mừng bạn đến với **PhiloMind** ("Ứng dụng"). Chúng tôi là một nền tảng học tập triết học tương tác được thiết kế để giúp bạn khám phá các khái niệm triết học thông qua các câu chuyện, trò chơi và cuộc tranh luận.

Bằng cách sử dụng ứng dụng này, bạn đồng ý tuân theo các điều khoản và điều kiện này ("Điều khoản"). Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng ứng dụng.

## 2. Giấy phép Sử dụng

Chúng tôi cấp cho bạn giấy phép hạn chế, không độc quyền, không chuyển nhượng để sử dụng Ứng dụng cho mục đích giáo dục cá nhân. Bạn không được:
- Sao chép, sửa đổi hoặc phân phối Ứng dụng
- Sử dụng Ứng dụng để phục vụ các mục đích thương mại
- Cố gắng truy cập trái phép vào các hệ thống của chúng tôi

## 3. Tài Khoản Người Dùng

Khi tạo tài khoản, bạn đồng ý:
- Cung cấp thông tin chính xác, hiện tại và đầy đủ
- Bảo vệ mật khẩu của bạn và duy trì tính bảo mật
- Chịu trách nhiệm cho tất cả hoạt động dưới tài khoản của bạn

## 4. Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua [support@philomind.com](mailto:support@philomind.com).`;

    // setTimeout to avoid synchronous setState inside useEffect warning
    setTimeout(() => {
      setMarkdown(tosContent);
      setLoading(false);
    }, 0);
  }, []);

  function handleLinkPress(href: string) {
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      // Open external link
      Linking.openURL(href);
    } else {
      // Navigate internal
      router.back();
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader title="Điều Khoản Dịch Vụ" showBackButton={true} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <MarkdownRenderer markdown={markdown || ""} onLinkPress={handleLinkPress} />
          </ScrollView>
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  errorText: {
    color: "#EF4444",
  },
});
