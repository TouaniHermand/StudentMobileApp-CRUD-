import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyScreenProps {
  message: string;
  subMessage?: string;
}

export default function EmptyScreen({ message, subMessage }: EmptyScreenProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="school-outline" size={64} color="#9ca3af" />
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
