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
import StatusTag from "../components/StatusTag";
import AppIcon, { IconNames } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

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
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <AppIcon name={IconNames.folder} size={20} color={Colors.purple} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardCount}>{item.device_count} 台设备</Text>
        </View>
        <StatusTag
          label={`${item.device_count} 台`}
          variant={item.device_count > 0 ? "primary" : "default"}
        />
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionView]}
          activeOpacity={0.7}
        >
          <Text style={styles.actionViewText}>查看设备</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionEdit]}
          activeOpacity={0.7}
          onPress={() => openModal(item)}
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
            actionLabel="立即添加"
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
        <AppIcon name={IconNames.add} size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <View style={styles.handle} />
            <Text style={styles.dialogTitle}>
              {editItem ? "编辑分类" : "新增分类"}
            </Text>
            <AppInput
              label="分类名称 *"
              value={formName}
              onChangeText={setFormName}
              placeholder="请输入分类名称（1-20 字符）"
              error={formError}
            />
            <View style={styles.dialogActions}>
              <AppButton
                title="取消"
                type="outline"
                onPress={() => setModalVisible(false)}
                style={styles.dialogBtn}
              />
              <AppButton
                title="保存"
                onPress={handleSubmit}
                loading={submitting}
                style={styles.dialogBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="删除分类"
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
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing.lg, paddingBottom: 96 },
  emptyList: { flexGrow: 1 },
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
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.purpleLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardName: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  cardCount: {
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
  actionView: { backgroundColor: Colors.primaryLight },
  actionViewText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.primary,
  },
  actionEdit: { backgroundColor: Colors.borderLight },
  actionEditText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  actionDelete: { backgroundColor: Colors.dangerLight },
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
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  dialog: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    alignSelf: "center",
    marginBottom: Spacing.xl,
  },
  dialogTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  dialogActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: Spacing.sm,
  },
  dialogBtn: { flex: 1 },
});
