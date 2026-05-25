import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  createDeviceApi,
  updateDeviceApi,
  getDevicesApi,
} from "../api/deviceApi";
import { getCategoriesApi } from "../api/categoryApi";
import type { Category, Device } from "../types";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import Card from "../components/Card";
import AppIcon, { IconNames } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

interface Errors {
  name?: string;
  category_id?: string;
}

function validate(data: { name: string; category_id: number }): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = "设备名称不能为空";
  if (!data.category_id) errors.category_id = "请选择分类";
  return errors;
}

export default function DeviceFormScreen({ route, navigation }: any) {
  const editId = route.params?.id;
  const isEdit = !!editId;

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const catRes = await getCategoriesApi();
        setCategories(catRes.data);

        if (editId) {
          const devRes = await getDevicesApi();
          const device = devRes.data.find((d: Device) => d.id === editId);
          if (device) {
            setName(device.name);
            setModel(device.model || "");
            setCategoryId(device.category_id);
          }
        }
      } catch (err: any) {
        Alert.alert("加载失败", err?.message || "网络错误");
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    })();
  }, [editId]);

  const handleSubmit = async () => {
    const data = { name: name.trim(), category_id: categoryId };
    const validation = validate(data);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      if (isEdit) {
        await updateDeviceApi(editId, {
          name: data.name,
          model: model.trim(),
          category_id: data.category_id,
        });
      } else {
        await createDeviceApi({
          name: data.name,
          model: model.trim(),
          category_id: data.category_id,
        });
      }
      Alert.alert("成功", isEdit ? "修改成功" : "创建成功", [
        { text: "确定", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("操作失败", err?.message || "网络错误");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <LoadingView />;

  const selectedCat = categories.find((c) => c.id === categoryId);

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <Card>
        <Text style={styles.sectionLabel}>设备信息</Text>

        <AppInput
          label="设备名称 *"
          value={name}
          onChangeText={setName}
          placeholder="请输入设备名称"
          error={errors.name}
        />
        <AppInput
          label="型号（可选）"
          value={model}
          onChangeText={setModel}
          placeholder="请输入设备型号"
        />

        <Text style={styles.pickerLabel}>所属分类 *</Text>
        <TouchableOpacity
          style={[styles.pickerBtn, errors.category_id && styles.pickerBtnError]}
          onPress={() => setShowPicker(!showPicker)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pickerBtnText,
              !selectedCat && styles.pickerBtnPlaceholder,
            ]}
          >
            {selectedCat ? selectedCat.name : "请选择所属分类"}
          </Text>
          <AppIcon name={showPicker ? IconNames.arrowUp : IconNames.arrowDown} size={10} color={Colors.textTertiary} />
        </TouchableOpacity>
        {errors.category_id ? (
          <View style={styles.errorRow}>
            <AppIcon name={IconNames.alert} size={14} color={Colors.danger} />
            <Text style={styles.errorText}>{errors.category_id}</Text>
          </View>
        ) : null}

        {showPicker && (
          <View style={styles.pickerDropdown}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.pickerItem,
                  categoryId === cat.id && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setCategoryId(cat.id);
                  setShowPicker(false);
                  setErrors((prev) => ({ ...prev, category_id: undefined }));
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    categoryId === cat.id && styles.pickerItemTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
                {categoryId === cat.id && (
                  <AppIcon name={IconNames.check} size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <AppButton
          title="取消"
          type="outline"
          onPress={() => navigation.goBack()}
          style={styles.actionBtn}
        />
        <AppButton
          title={isEdit ? "保存修改" : "保存设备"}
          onPress={handleSubmit}
          loading={loading}
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg },
  sectionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  pickerLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pickerBtn: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  pickerBtnError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  pickerBtnText: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  pickerBtnPlaceholder: {
    color: Colors.textTertiary,
  },
  pickerArrow: {
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.danger,
    flex: 1,
  },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  pickerItem: {
    padding: 14,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  pickerItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  pickerItemText: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  pickerItemTextActive: {
    color: Colors.primary,
    fontWeight: Typography.medium,
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
