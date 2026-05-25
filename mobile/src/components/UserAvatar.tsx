import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Colors from "../theme/colors";

interface Props {
  name: string;
  size?: number;
}

export default function UserAvatar({ name, size = 40 }: Props) {
  const initial = name ? name[0] : "?";
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
