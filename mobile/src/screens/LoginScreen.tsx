import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/authApi";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import AppIcon, { IconNames } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const res = await loginApi(username.trim(), password);
      const { token, admin_id, username: uname, role } = res.data;
      await signIn(token, { admin_id, username: uname, role });
    } catch (err: any) {
      const msg = err?.message || "网络错误";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.body, { paddingBottom: insets.bottom + 16 }]}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <AppIcon name={IconNames.shield} size={28} color="#fff" />
          </View>
          <View style={styles.logoDot} />
        </View>

        <Text style={styles.appName}>企业移动办公助手</Text>
        <Text style={styles.subtitle}>请使用管理员账号登录</Text>

        {/* Form */}
        <View style={styles.form}>
          <AppInput
            label="用户名"
            value={username}
            onChangeText={(v) => {
              setUsername(v);
              setError("");
            }}
            placeholder="请输入用户名"
            icon={<AppIcon name={IconNames.user} size={16} color={Colors.textTertiary} />}
          />
          <AppInput
            label="密码"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError("");
            }}
            placeholder="请输入登录密码"
            secureTextEntry={!showPassword}
            icon={<AppIcon name={IconNames.lock} size={16} color={Colors.textTertiary} />}
          />
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowPassword((v) => !v)}
          >
            <AppIcon
              name={showPassword ? IconNames.eyeOff : IconNames.eye}
              size={18}
              color={Colors.textTertiary}
            />
          </Pressable>

          <AppButton
            title="登 录"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitBtn}
          />

          {error ? (
            <View style={styles.errorBox}>
              <AppIcon name={IconNames.alert} size={14} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          {new Date().getFullYear()} 企业信息管理系统  v2.4.1
        </Text>
        <Text style={styles.footerSubtext}>技术支持：IT 运维部</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoWrap: {
    alignSelf: "center",
    marginBottom: 28,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.fab,
  },
  logoDot: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  appName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 78,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: "#FFCCC7",
    borderRadius: 12,
    marginTop: 12,
  },
  errorText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.danger,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  footerLine: {
    width: 64,
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  footerSubtext: {
    fontSize: Typography.xs,
    color: Colors.border,
    marginTop: 2,
  },
});
