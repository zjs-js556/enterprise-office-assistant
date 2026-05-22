import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../api/categoryApi";
import type { Category, CategoryFormData } from "../types";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";
import LoadingView from "../components/LoadingView";
import ConfirmDialog from "../components/ConfirmDialog";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

export default function CategoryListScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await getCategoriesApi();
      setCategories(res.data);
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

  const openModal = (item?: Category) => {
    setEditItem(item || null);
    setFormName(item ? item.name : "");
    setFormError("");
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      setFormError("分类名称不能为空");
      return;
    }
    if (formName.trim().length > 20) {
      setFormError("分类名称不超过20个字符");
      return;
    }
    setSubmitting(true);
    try {
      const data: CategoryFormData = { name: formName.trim() };
      if (editItem) {
        await updateCategoryApi(editItem.id, data);
        setCategories((prev) =>
          prev.map((c) => (c.id === editItem.id ? { ...c, name: data.name } : c))
        );
      } else {
        const res = await createCategoryApi(data);
        setCategories((prev) => [res.data, ...prev]);
      }
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("操作失败", err?.message || "网络错误");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategoryApi(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      Alert.alert("删除失败", err?.message || "网络错误");
    } finally {
      setDeleting(false);
    }
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => openModal(item)}
      onLongPress={() => setDeleteTarget(item)}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📂</Text>
        </View>
        <Text style={styles.cardName}>{item.name}</Text>
      </View>
      <Text style={styles.cardCount}>{item.device_count} 台设备</Text>
    </TouchableOpacity>
  );

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          categories.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          <EmptyState
            message="暂无分类数据"
            actionLabel="新增分类"
            onAction={() => openModal()}
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
        onPress={() => openModal()}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              {editItem ? "编辑分类" : "新增分类"}
            </Text>
            <AppInput
              label="分类名称"
              value={formName}
              onChangeText={setFormName}
              placeholder="请输入分类名称"
              error={formError}
            />
            <View style={styles.dialogActions}>
              <AppButton
                title="取消"
                type="outline"
                onPress={() => setModalVisible(false)}
                style={styles.btn}
              />
              <AppButton
                title="保存"
                onPress={handleSubmit}
                loading={submitting}
                style={styles.btn}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="删除分类"
        message={`确定要删除「${deleteTarget?.name}」吗？`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingTop: Spacing.sm, paddingBottom: 80 },
  emptyList: { flexGrow: 1 },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontSize: 20 },
  cardName: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  cardCount: { fontSize: FontSize.sm, color: Colors.textSecondary },
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
  fabText: { fontSize: 26, color: "#fff", lineHeight: 28 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: 300,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  dialogTitle: {
    fontSize: FontSize.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  btn: { minWidth: 70, height: 36, paddingHorizontal: Spacing.md },
});
