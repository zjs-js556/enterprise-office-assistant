import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

interface Props {
  title: string;
  value: string | number;
  icon?: string;
  onPress?: () => void;
}

export default function InfoCard({ title, value, onPress }: Props) {
  const content = (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
});
