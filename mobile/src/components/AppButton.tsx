import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  type?: "primary" | "danger" | "outline";
  style?: ViewStyle;
}

export default function AppButton({
  title,
  onPress,
  loading,
  type = "primary",
  style,
}: Props) {
  const bgColor =
    type === "danger"
      ? Colors.danger
      : type === "outline"
        ? "transparent"
        : Colors.primary;

  const textColor = type === "outline" ? Colors.primary : "#fff";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        type === "outline" && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
});
