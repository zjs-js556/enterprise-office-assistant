import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppIcon, { IconNames } from "./AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";

interface Props {
  message: string;
  type?: "success" | "error";
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  visible,
  onHide,
  duration = 2500,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor =
    type === "error" ? Colors.danger : Colors.textPrimary;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity, transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={0.9}
        onPress={onHide}
      >
        <AppIcon name={type === "error" ? IconNames.alert : IconNames.check} size={16} color={Colors.textInverse} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 100,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  icon: {
    fontSize: 15,
    color: Colors.textInverse,
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textInverse,
  },
});
