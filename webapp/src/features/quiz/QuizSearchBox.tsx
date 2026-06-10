import { useTranslation } from "react-i18next";
import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

import { QuizColors, quizStyles as styles } from "./ui";

type QuizSearchBoxProps = {
  onChange: (value: string) => void;
  value: string;
};

export function QuizSearchBox({ onChange, value }: QuizSearchBoxProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.searchBox}>
      <Search color={QuizColors.muted} size={18} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t("quiz.search_placeholder")}
        placeholderTextColor={QuizColors.locked}
        selectionColor={QuizColors.primaryLight}
        style={styles.searchInput}
      />
    </View>
  );
}
