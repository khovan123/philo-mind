import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

import { QuizColors, quizStyles as styles } from "./ui";

type QuizSearchBoxProps = {
  onChange: (value: string) => void;
  value: string;
};

export function QuizSearchBox({ onChange, value }: QuizSearchBoxProps) {
  return (
    <View style={styles.searchBox}>
      <Search color={QuizColors.muted} size={18} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search quizzes by topic or lesson..."
        placeholderTextColor={QuizColors.locked}
        selectionColor={QuizColors.primaryLight}
        style={styles.searchInput}
      />
    </View>
  );
}
