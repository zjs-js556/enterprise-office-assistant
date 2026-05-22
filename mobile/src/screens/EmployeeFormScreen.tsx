import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import {
  createEmployeeApi,
  updateEmployeeApi,
  getEmployeeApi,
} from "../api/employeeApi";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

interface Errors {
  name?: string;
  age?: string;
  email?: string;
}

function validate(data: { name: string; age: string; email: string }): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = "姓名不能为空";
  else if (data.name.trim().length > 20) errors.name = "姓名不超过20个字符";

  const age = parseInt(data.age, 10);
  if (!data.age) errors.age = "年龄不能为空";
  else if (isNaN(age) || age < 18 || age > 60) errors.age = "年龄需在18-60之间";

  if (!data.email.trim()) errors.email = "邮箱不能为空";
  else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())
  )
    errors.email = "邮箱格式不正确";

  return errors;
}

export default function EmployeeFormScreen({ route, navigation }: any) {
  const editId = route.params?.id;
  const isEdit = !!editId;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      (async () => {
        try {
          const res = await getEmployeeApi(editId);
          const e = res.data;
          setName(e.name);
          setAge(String(e.age));
          setEmail(e.email);
        } catch (err: any) {
          Alert.alert("加载失败", err?.message || "网络错误");
          navigation.goBack();
        } finally {
          setLoadingData(false);
        }
      })();
    }
  }, [editId]);

  const handleSubmit = async () => {
    const data = { name: name.trim(), age: age.trim(), email: email.trim() };
    const validation = validate(data);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      if (isEdit) {
        await updateEmployeeApi(editId, {
          name: data.name,
          age: data.age,
          email: data.email,
        });
      } else {
        await createEmployeeApi({
          name: data.name,
          age: data.age,
          email: data.email,
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

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{isEdit ? "编辑员工" : "新增员工"}</Text>
        <AppInput
          label="姓名"
          value={name}
          onChangeText={setName}
          placeholder="请输入姓名"
          error={errors.name}
        />
        <AppInput
          label="年龄"
          value={age}
          onChangeText={setAge}
          placeholder="请输入年龄"
          keyboardType="numeric"
          error={errors.age}
        />
        <AppInput
          label="邮箱"
          value={email}
          onChangeText={setEmail}
          placeholder="请输入邮箱"
          keyboardType="email-address"
          error={errors.email}
        />
        <AppButton
          title={isEdit ? "保存修改" : "创建员工"}
          onPress={handleSubmit}
          loading={loading}
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
  scrollContent: {
    padding: Spacing.md,
  },
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
});
