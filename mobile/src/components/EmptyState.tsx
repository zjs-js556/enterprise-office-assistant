import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing } from "../utils/theme";
import AppButton from "./AppButton";

interface Props {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  message = "暂无数据",
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <AppButton title={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.lg,
    minWidth: 120,
  },
});
