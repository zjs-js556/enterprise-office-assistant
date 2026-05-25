import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { getEmployeeApi } from "../api/employeeApi";
import type { Employee } from "../types";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import Card from "../components/Card";
import UserAvatar from "../components/UserAvatar";
import StatusTag from "../components/StatusTag";
import AppIcon, { IconNames, type IconName } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

function DetailRow({ icon, label, value }: { icon: IconName; label: string; value: string | number }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <AppIcon name={icon} size={14} color={Colors.textTertiary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function EmployeeDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployeeApi(id);
        setEmployee(res.data);
      } catch (err: any) {
        Alert.alert("加载失败", err?.message || "网络错误");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingView />;
  if (!employee) return null;

  const infoRows = [
    { icon: IconNames.user, label: "姓名", value: employee.name },
    { icon: IconNames.calendar, label: "年龄", value: `${employee.age} 岁` },
    { icon: IconNames.mail, label: "邮箱", value: employee.email },
    { icon: IconNames.clock, label: "创建时间", value: employee.created_at.slice(0, 10) },
    { icon: IconNames.refresh, label: "更新时间", value: employee.updated_at.slice(0, 10) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <UserAvatar name={employee.name} size={64} />
        <Text style={styles.profileName}>{employee.name}</Text>
        <StatusTag label="在职员工" variant="success" />
      </Card>

      <Card style={styles.infoCard}>
        {infoRows.map((row, i) => (
          <DetailRow key={row.label} {...row} />
        ))}
      </Card>

      <View style={styles.actions}>
        <AppButton
          title="编辑信息"
          onPress={() => navigation.navigate("EmployeeForm", { id: employee.id })}
          style={styles.actionBtn}
        />
        <AppButton
          title="删除"
          type="danger"
          onPress={() => {
            Alert.alert("删除员工", `确定要删除「${employee.name}」吗？`, [
              { text: "取消", style: "cancel" },
              { text: "删除", style: "destructive", onPress: () => navigation.goBack() },
            ]);
          }}
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
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
  profileCard: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  profileName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
