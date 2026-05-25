import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Colors from "../theme/colors";

type StatusVariant = "primary" | "success" | "warning" | "danger" | "default";

interface Props {
  label: string;
  variant?: StatusVariant;
}

const variantStyles: Record<
  StatusVariant,
  { bg: string; color: string }
> = {
  primary: { bg: Colors.primaryLight, color: Colors.primary },
  success: { bg: Colors.successLight, color: Colors.success },
  warning: { bg: Colors.warningLight, color: Colors.warning },
  danger: { bg: Colors.dangerLight, color: Colors.danger },
  default: { bg: Colors.borderLight, color: Colors.textSecondary },
};

export default function StatusTag({ label, variant = "default" }: Props) {
  const style = variantStyles[variant];
  return (
    <View style={[styles.tag, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 100,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
