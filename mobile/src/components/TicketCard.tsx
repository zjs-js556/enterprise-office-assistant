import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import StatusTag from "./StatusTag";

interface Props {
  title: string;
  description: string;
  status: string;
  statusVariant?: "primary" | "success" | "warning" | "danger" | "default";
  time: string;
  onPress: () => void;
}

export default function TicketCard({
  title,
  description,
  status,
  statusVariant = "primary",
  time,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <StatusTag label={status} variant={statusVariant} />
      </View>
      <Text style={styles.desc} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  time: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  arrow: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
});
