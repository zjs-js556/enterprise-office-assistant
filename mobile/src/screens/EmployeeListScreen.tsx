import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getEmployeesApi, deleteEmployeeApi } from "../api/employeeApi";
import type { Employee } from "../types";
import EmptyState from "../components/EmptyState";
import LoadingView from "../components/LoadingView";
import ConfirmDialog from "../components/ConfirmDialog";
import UserAvatar from "../components/UserAvatar";
import StatusTag from "../components/StatusTag";
import AppIcon, { IconNames } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

export default function EmployeeListScreen({ navigation }: any) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await getEmployeesApi();
      setEmployees(res.data.items);
    } catch (err: any) {
      Alert.alert("加载失败", err?.message || "网络错误");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData])
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEmployeeApi(deleteTarget.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      Alert.alert("删除失败", err?.message || "网络错误");
    } finally {
      setDeleting(false);
    }
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("EmployeeDetail", { id: item.id })}
      onLongPress={() => setDeleteTarget(item)}
    >
      <View style={styles.cardTop}>
        <UserAvatar name={item.name} size={40} />
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <StatusTag label="在职" variant="success" />
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionView]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("EmployeeDetail", { id: item.id })}
        >
          <Text style={styles.actionViewText}>查看详情</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionEdit]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("EmployeeForm", { id: item.id })}
        >
          <Text style={styles.actionEditText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionDelete]}
          activeOpacity={0.7}
          onPress={() => setDeleteTarget(item)}
        >
          <Text style={styles.actionDeleteText}>删除</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          employees.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          <EmptyState
            message="暂无员工数据"
            actionLabel="立即添加"
            onAction={() => navigation.navigate("EmployeeForm", {})}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("EmployeeForm", {})}
      >
        <AppIcon name={IconNames.add} size={26} color="#fff" />
      </TouchableOpacity>

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="删除员工"
        message={`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        dangerous
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    marginBottom: 12,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  email: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  actionView: {
    backgroundColor: Colors.primaryLight,
  },
  actionViewText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.primary,
  },
  actionEdit: {
    backgroundColor: Colors.borderLight,
  },
  actionEditText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  actionDelete: {
    backgroundColor: Colors.dangerLight,
  },
  actionDeleteText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.danger,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.fab,
  },
  fabText: {
    fontSize: 26,
    color: "#fff",
    lineHeight: 28,
  },
});
