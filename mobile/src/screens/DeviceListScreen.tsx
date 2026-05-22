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
import { getDevicesApi, deleteDeviceApi } from "../api/deviceApi";
import { getCategoriesApi } from "../api/categoryApi";
import type { Device, Category } from "../types";
import EmptyState from "../components/EmptyState";
import LoadingView from "../components/LoadingView";
import ConfirmDialog from "../components/ConfirmDialog";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

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
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>💻</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardModel}>{item.model || "无型号"}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getCategoryName(item.category_id)}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <Scrollable
          data={[
            { id: undefined, name: "全部" },
            ...categories.map((c) => ({ id: c.id as number | undefined, name: c.name })),
          ]}
          activeId={filterId}
          onSelect={setFilterId}
        />
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
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="删除设备"
        message={`确定要删除「${deleteTarget?.name}」吗？`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </View>
  );
}

function Scrollable({
  data,
  activeId,
  onSelect,
}: {
  data: { id: number | undefined; name: string }[];
  activeId: number | undefined;
  onSelect: (id: number | undefined) => void;
}) {
  return (
    <View style={filterStyles.row}>
      {data.map((item) => {
        const active = item.id === activeId;
        return (
          <TouchableOpacity
            key={String(item.id)}
            style={[filterStyles.chip, active && filterStyles.chipActive]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[filterStyles.text, active && filterStyles.textActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const filterStyles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: { fontSize: FontSize.sm, color: Colors.textSecondary },
  textActive: { color: "#fff", fontWeight: "500" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingTop: Spacing.sm, paddingBottom: 80 },
  emptyList: { flexGrow: 1 },
  filterBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
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
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconText: { fontSize: 22 },
  cardBody: { flex: 1, marginLeft: Spacing.sm },
  cardName: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.textPrimary },
  cardModel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  cardRight: { alignItems: "flex-end" },
  badge: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: { fontSize: FontSize.sm, color: Colors.primary },
  arrow: { fontSize: 20, color: Colors.textSecondary, marginTop: 2 },
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
});
