import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

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
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Shadows.card,
  },
  title: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: Typography.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
});
