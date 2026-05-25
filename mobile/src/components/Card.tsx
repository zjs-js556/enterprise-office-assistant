import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import { Shadows } from "../theme";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export default function Card({ children, style, padded = true }: Props) {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  padded: {
    padding: Spacing.lg,
  },
});
