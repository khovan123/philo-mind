import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { Spacing, Radius } from "@/constants/theme";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      router.push({ pathname: "/(auth)/verify-otp", params: { email } } as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Quên mật khẩu</ThemedText>
      <ThemedText type="small">Nhập email của bạn để nhận mã xác thực (OTP).</ThemedText>

      <Input value={email} onChangeText={setEmail} placeholder="Email" />
      {error ? (
        <ThemedText type="label" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Button title="Gửi mã" loading={loading} onPress={handleSubmit} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.three,
    borderRadius: Radius.lg,
  },
});
