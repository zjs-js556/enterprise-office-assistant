import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import AppHeader from "../components/AppHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

export default function TicketCreateScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("提示", "请输入工单标题");
      return;
    }
    if (!description.trim()) {
      Alert.alert("提示", "请输入工单描述");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("成功", "工单已创建", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="创建工单" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Card>
          <Text style={styles.sectionLabel}>工单信息</Text>
          <AppInput
            label="工单标题 *"
            value={title}
            onChangeText={setTitle}
            placeholder="请输入工单标题"
          />
          <AppInput
            label="工单描述 *"
            value={description}
            onChangeText={setDescription}
            placeholder="请详细描述问题或需求"
            multiline
          />

          <Text style={styles.label}>优先级</Text>
          <View style={styles.priorityRow}>
            {[
              { key: "low", label: "低" },
              { key: "normal", label: "中" },
              { key: "high", label: "高" },
            ].map((p) => (
              <View
                key={p.key}
                style={[
                  styles.priorityBtn,
                  priority === p.key && styles.priorityBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === p.key && styles.priorityTextActive,
                  ]}
                  onPress={() => setPriority(p.key)}
                >
                  {p.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.actions}>
          <AppButton
            title="取消"
            type="outline"
            onPress={() => navigation.goBack()}
            style={styles.actionBtn}
          />
          <AppButton
            title="提交工单"
            onPress={handleSubmit}
            loading={loading}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  priorityBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  priorityText: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  priorityTextActive: {
    color: Colors.primary,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
});
