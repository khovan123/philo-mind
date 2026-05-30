import { BookOpen, Bookmark, Home, UserRound } from "lucide-react-native";
import { StyleSheet, View, type ColorValue } from "react-native";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const Icons = {
  home: Home,
  learn: BookOpen,
  debate: Bookmark,
  profile: UserRound,
  story: BookOpen,
} as const;

export type TabIconName = keyof typeof Icons;

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
  focused: boolean;
};

export function TabIcon({ name, color, focused }: TabIconProps) {
  const Icon = Icons[name];

  return (
    <View style={styles.container}>
      <Icon color={String(color)} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
