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
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

function Avatar({ name }: { name: string }) {
  const colors = ["#1677FF", "#52C41A", "#FAAD14", "#FF4D4F", "#722ED1"];
  const idx = name.charCodeAt(0) % colors.length;
  const initial = name[0] || "?";

  return (
    <View style={[avatarStyles.circle, { backgroundColor: colors[idx] }]}>
      <Text style={avatarStyles.text}>{initial}</Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: "#fff",
  },
});

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
      <Avatar name={item.name} />
      <View style={styles.cardBody}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.age}>{item.age} 岁</Text>
        <Text style={styles.arrow}>›</Text>
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
            actionLabel="新增员工"
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
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="删除员工"
        message={`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
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
    paddingTop: Spacing.sm,
    paddingBottom: 80,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  email: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  age: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginTop: 2,
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
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 26,
    color: "#fff",
    lineHeight: 28,
  },
});
