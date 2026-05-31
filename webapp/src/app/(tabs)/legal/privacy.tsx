import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Spacing } from "@/constants/theme";

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  primary: "#D97706",
};

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Privacy Policy from data file
    // In a real app, this would be fetched from an API
    // For now, we'll use inline content
    const privacyContent = `# Chính Sách Bảo Mật (Privacy Policy)

## 1. Giới Thiệu

PhiloMind ("chúng tôi", "của chúng tôi", hoặc "công ty") cam kết bảo vệ quyền riêng tư của bạn. Chính sách Bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn.

## 2. Thông Tin Chúng Tôi Thu Thập

### 2.1 Thông Tin Bạn Cung Cấp Trực Tiếp
- **Tài khoản**: Tên, email, mật khẩu hashed
- **Hồ sơ**: Tiểu sử, ảnh đại diện
- **Nội dung**: Nhật ký triết học, bình luận, câu trả lời

### 2.2 Thông Tin Chúng Tôi Thu Thập Tự Động
- **Dữ liệu hoạt động**: Các bài học bạn đã hoàn thành, tính điểm, thành tích
- **Dữ liệu thiết bị**: Loại thiết bị, hệ điều hành, định danh duy nhất

## 3. Cách Chúng Tôi Sử Dụng Thông Tin

Chúng tôi sử dụng thông tin của bạn để:
- Cung cấp, duy trì và cải thiện Ứng dụng
- Cá nhân hóa trải nghiệm của bạn
- Gửi thông báo và cập nhật
- Tuân thủ các yêu cầu pháp lý

## 4. Bảo Mật Dữ Liệu

Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn công nghiệp để bảo vệ dữ liệu của bạn:
- Mã hóa dữ liệu đang truyền (HTTPS/TLS)
- Mã hóa dữ liệu lưu trữ tại cơ sở dữ liệu
- Kiểm soát truy cập dựa trên vai trò

## 5. Quyền Của Bạn

Bạn có quyền:
- **Truy cập**: Yêu cầu sao chép dữ liệu cá nhân của bạn
- **Sửa đổi**: Cập nhật hoặc sửa chữa thông tin không chính xác
- **Xóa**: Yêu cầu xóa tài khoản và dữ liệu liên quan

## 6. Liên Hệ

Nếu bạn có câu hỏi về Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi:
- Email: [privacy@philomind.com](mailto:privacy@philomind.com)`;
    
    setMarkdown(privacyContent);
    setLoading(false);
  }, []);

  function handleLinkPress(href: string) {
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      // Open external link
      require("react-native").Linking.openURL(href);
    } else {
      // Navigate internal
      router.push(href);
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <AppHeader title="Chính Sách Bảo Mật" showBackButton={true} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText type="label" style={styles.errorText}>
              {error}
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
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
