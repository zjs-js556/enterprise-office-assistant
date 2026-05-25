import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "primary" | "danger" | "outline" | "ghost";
  style?: ViewStyle;
}

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  type = "primary",
  style,
}: Props) {
  const isDisabled = loading || disabled;

  const bgColor =
    type === "danger"
      ? Colors.danger
      : type === "outline"
        ? Colors.surface
        : type === "ghost"
          ? "transparent"
          : Colors.primary;

  const textColor =
    type === "outline"
      ? Colors.textPrimary
      : type === "ghost"
        ? Colors.textSecondary
        : "#fff";

  const borderStyle =
    type === "outline"
      ? { borderWidth: 1, borderColor: Colors.borderLight }
      : type === "ghost"
        ? {}
        : {};

  const shadowStyle =
    type === "primary" && !isDisabled ? Shadows.button : {};

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, borderStyle, shadowStyle, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
});
