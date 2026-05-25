import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

interface Props {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function AppHeader({ title, onBack, rightAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.6}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  side: {
    width: 36,
  },
  sideRight: {
    alignItems: "flex-end",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -4,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  title: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
});
