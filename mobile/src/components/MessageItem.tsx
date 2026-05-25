import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";

interface Props {
  title: string;
  content: string;
  time: string;
  unread?: boolean;
  onPress: () => void;
}

export default function MessageItem({
  title,
  content,
  time,
  unread = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.item, unread && styles.unread]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.dotRow}>
        {unread && <View style={styles.dot} />}
        <View style={[styles.dotRow, !unread && { marginLeft: 0 }]}>
          {!unread && <View style={styles.dotPlaceholder} />}
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text
            style={[styles.title, unread && styles.titleUnread]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.content} numberOfLines={2}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  unread: {
    backgroundColor: Colors.primaryLight,
  },
  dotRow: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 10,
    paddingTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  dotPlaceholder: {
    width: 8,
    height: 8,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  titleUnread: {
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  content: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
