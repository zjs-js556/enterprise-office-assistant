import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { getEmployeeApi } from "../api/employeeApi";
import type { Employee } from "../types";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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

  const colors = ["#1677FF", "#52C41A", "#FAAD14", "#FF4D4F", "#722ED1"];
  const avatarColor = colors[employee.name.charCodeAt(0) % colors.length];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{employee.name[0]}</Text>
        </View>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.subtitle}>{employee.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>基本信息</Text>
        <DetailRow label="年龄" value={`${employee.age} 岁`} />
        <DetailRow label="邮箱" value={employee.email} />
        <DetailRow label="创建时间" value={employee.created_at.slice(0, 10)} />
        <DetailRow label="更新时间" value={employee.updated_at.slice(0, 10)} />
      </View>

      <AppButton
        title="编辑员工"
        onPress={() => navigation.navigate("EmployeeForm", { id: employee.id })}
        style={styles.editBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    alignItems: "center",
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.title,
    color: "#fff",
    fontWeight: "700",
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  card: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  editBtn: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
