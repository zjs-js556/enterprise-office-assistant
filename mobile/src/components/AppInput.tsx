import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import AppIcon, { IconNames } from "./AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

interface Props extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <TextInput
          style={[styles.input, rest.multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          {...rest}
        />
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <AppIcon name={IconNames.alert} size={14} color={Colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
  },
  inputRowError: {
    borderColor: Colors.danger,
    backgroundColor: "#FFF5F5",
  },
  iconWrap: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  inputMultiline: {
    height: 100,
    paddingTop: Spacing.md,
    textAlignVertical: "top",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.danger,
    flex: 1,
  },
});
