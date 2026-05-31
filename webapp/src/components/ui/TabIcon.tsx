import { BookOpen, Compass, Home, MessageSquare, UserRound } from "lucide-react-native";
import { StyleSheet, View, type ColorValue } from "react-native";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const Icons = {
  home: Home,
  explore: Compass,
  learn: BookOpen,
  debate: MessageSquare,
  profile: UserRound,
} as const;

export type TabIconName = keyof typeof Icons;

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
  focused: boolean;
};

export function TabIcon({ name, color, focused }: TabIconProps) {
  const theme = useTheme();
  const Icon = Icons[name];

  return (
    <View
      style={[
        styles.container,
        focused && {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.border,
        },
      ]}
    >
      <Icon color={String(color)} size={focused ? 23 : 21} strokeWidth={focused ? 2.6 : 2.1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 30,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: Spacing.half,
  },
});
