import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getDevicesApi, deleteDeviceApi } from "../api/deviceApi";
import { getCategoriesApi } from "../api/categoryApi";
import type { Device, Category } from "../types";
import EmptyState from "../components/EmptyState";
import LoadingView from "../components/LoadingView";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusTag from "../components/StatusTag";
import AppIcon, { IconNames } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

export default function DeviceListScreen({ navigation }: any) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterId, setFilterId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const [devRes, catRes] = await Promise.all([
          getDevicesApi(filterId),
          getCategoriesApi(),
        ]);
        setDevices(devRes.data);
        setCategories(catRes.data);
      } catch (err: any) {
        Alert.alert("加载失败", err?.message || "网络错误");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filterId]
  );

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
      await deleteDeviceApi(deleteTarget.id);
      setDevices((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      Alert.alert("删除失败", err?.message || "网络错误");
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || "-";

  const renderItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("DeviceForm", { id: item.id })}
      onLongPress={() => setDeleteTarget(item)}
    >
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <AppIcon name={IconNames.desktop} size={20} color={Colors.success} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardModel}>型号：{item.model || "—"}</Text>
        </View>
        <TouchableOpacity
          style={styles.editIcon}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("DeviceForm", { id: item.id })}
        >
          <AppIcon name={IconNames.edit} size={16} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBottom}>
        <StatusTag label={getCategoryName(item.category_id)} variant="primary" />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.chip, !filterId && styles.chipActive]}
            onPress={() => setFilterId(undefined)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, !filterId && styles.chipTextActive]}>
              全部
            </Text>
          </TouchableOpacity>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, filterId === c.id && styles.chipActive]}
              onPress={() => setFilterId(c.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  filterId === c.id && styles.chipTextActive,
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          devices.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          <EmptyState
            message="暂无设备数据"
            actionLabel="新增设备"
            onAction={() => navigation.navigate("DeviceForm", {})}
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
        onPress={() => navigation.navigate("DeviceForm", {})}
      >
        <AppIcon name={IconNames.add} size={26} color="#fff" />
      </TouchableOpacity>

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="删除设备"
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
  filterBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: Colors.borderLight,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textInverse,
  },
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
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
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
  cardModel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  editIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBottom: {
    flexDirection: "row",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
});
