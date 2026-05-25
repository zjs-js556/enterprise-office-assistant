import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppIcon, { IconNames } from "./AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import AppButton from "./AppButton";

interface Props {
  icon?: React.ReactNode;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  message = "暂无数据",
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      {icon ? (
        <View style={styles.iconBox}>{icon}</View>
      ) : (
        <AppIcon name={IconNames.inbox} size={48} color={Colors.textTertiary} />
      )}
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  emoji: {
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  button: {
    minWidth: 120,
  },
});
