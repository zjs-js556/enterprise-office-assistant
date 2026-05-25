import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

interface Props {
  message?: string;
}

export default function LoadingView({ message = "加载中..." }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xxl,
  },
  text: {
    marginTop: Spacing.md,
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
});
