import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { Spacing, Radius } from "@/constants/theme";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp);
      const resetToken = (res as any).resetToken;
      router.push({ pathname: "/(auth)/reset-password", params: { email, resetToken } } as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Nhập mã OTP</ThemedText>
      <ThemedText type="small">Mã đã được gửi tới {email}</ThemedText>

      <Input value={otp} onChangeText={setOtp} placeholder="Mã OTP" />
      {error ? (
        <ThemedText type="label" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Button title="Xác minh" loading={loading} onPress={handleVerify} fullWidth />
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
