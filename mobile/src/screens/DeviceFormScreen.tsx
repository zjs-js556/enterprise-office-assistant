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
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{isEdit ? "编辑设备" : "新增设备"}</Text>

        <AppInput
          label="设备名称"
          value={name}
          onChangeText={setName}
          placeholder="请输入设备名称"
          error={errors.name}
        />
        <AppInput
          label="型号"
          value={model}
          onChangeText={setModel}
          placeholder="请输入型号（选填）"
        />

        <Text style={styles.label}>所属分类</Text>
        <TouchableOpacity
          style={[styles.pickerBtn, errors.category_id && styles.pickerBtnError]}
          onPress={() => setShowPicker(!showPicker)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: selectedCat ? Colors.textPrimary : Colors.textSecondary,
              fontSize: FontSize.md,
            }}
          >
            {selectedCat ? selectedCat.name : "请选择分类"}
          </Text>
          <Text style={styles.pickerArrow}>{showPicker ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        {errors.category_id && (
          <Text style={styles.errorText}>{errors.category_id}</Text>
        )}

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
              </TouchableOpacity>
            ))}
          </View>
        )}

        <AppButton
          title={isEdit ? "保存修改" : "创建设备"}
          onPress={handleSubmit}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontWeight: "500",
  },
  pickerBtn: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  pickerBtnError: { borderColor: Colors.danger },
  pickerArrow: { fontSize: 10, color: Colors.textSecondary },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  pickerItem: {
    padding: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  pickerItemActive: { backgroundColor: Colors.primary },
  pickerItemText: { fontSize: FontSize.md, color: Colors.textPrimary },
  pickerItemTextActive: { color: "#fff" },
});
