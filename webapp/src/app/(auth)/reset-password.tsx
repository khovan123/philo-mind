import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { Spacing, Radius } from "@/constants/theme";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || "";
  const resetToken = (params.resetToken as string) || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword(email, resetToken, password);
      router.replace("/(auth)/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Đặt lại mật khẩu</ThemedText>
      <ThemedText type="small">Cho tài khoản {email}</ThemedText>

      <Input value={password} onChangeText={setPassword} placeholder="Mật khẩu mới" secureTextEntry />
      {error ? <ThemedText type="label" themeColor="danger">{error}</ThemedText> : null}

      <Button title="Đặt lại mật khẩu" loading={loading} onPress={handleReset} fullWidth />
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
