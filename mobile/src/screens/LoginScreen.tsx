import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/authApi";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("提示", "请输入用户名");
      return;
    }
    if (!password) {
      Alert.alert("提示", "请输入密码");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(username.trim(), password);
      const { token, admin_id, username: uname, role } = res.data;
      await signIn(token, { admin_id, username: uname, role });
    } catch (err: any) {
      Alert.alert("登录失败", err?.message || "网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topSection}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>🏢</Text>
        </View>
        <Text style={styles.appName}>企业办公助手</Text>
        <Text style={styles.appSubtitle}>Enterprise Office Assistant</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>账号登录</Text>
        <AppInput
          label="用户名"
          value={username}
          onChangeText={setUsername}
          placeholder="请输入用户名"
        />
        <AppInput
          label="密码"
          value={password}
          onChangeText={setPassword}
          placeholder="请输入密码"
          secureTextEntry
        />
        <AppButton
          title="登录"
          onPress={handleLogin}
          loading={loading}
          style={styles.submitBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSection: {
    backgroundColor: Colors.primary,
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: "center",
    borderBottomLeftRadius: BorderRadius.lg * 2,
    borderBottomRightRadius: BorderRadius.lg * 2,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: FontSize.title,
    fontWeight: "700",
    color: "#fff",
  },
  appSubtitle: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.65)",
    marginTop: Spacing.xs,
  },
  formCard: {
    marginHorizontal: Spacing.lg,
    marginTop: -28,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
});
