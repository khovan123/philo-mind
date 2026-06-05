import { Info, X } from "lucide-react-native";
import { Modal, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { ConceptName } from "./data";
import { fullLesson } from "./data";
import { Colors, styles } from "./ui";

type ConceptModalProps = {
  concept: ConceptName | null;
  onClose: () => void;
};

export function ConceptModal({ concept, onClose }: ConceptModalProps) {
  return (
    <Modal animationType="fade" transparent visible={concept !== null} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Info color={Colors.primaryLight} size={22} />
            <ThemedText style={styles.modalTitle}>{concept ?? "Khái niệm"}</ThemedText>
            <Pressable
              accessibilityLabel="Đóng"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <X color={Colors.body} size={20} />
            </Pressable>
          </View>
          <ThemedText style={styles.modalBody}>
            {concept ? fullLesson.concepts[concept] : ""}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.secondaryButtonText}>Đã hiểu</ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
