import {
  Bookmark,
  BookOpen,
  Compass,
  GraduationCap,
  Home,
  MessageCircle,
  UserRound,
} from "lucide-react-native";
import { StyleSheet, View, type ColorValue } from "react-native";

const Icons = {
  home: Home,
  explore: Compass,
  learn: GraduationCap,
  debate: Bookmark,
  profile: UserRound,
  story: BookOpen,
  chat: MessageCircle,
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
