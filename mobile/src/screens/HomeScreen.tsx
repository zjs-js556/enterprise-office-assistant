import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import AppButton from "../components/AppButton";
import { Colors, FontSize, Spacing, BorderRadius } from "../utils/theme";

const MENU_ITEMS = [
  { title: "员工管理", desc: "管理企业员工信息", icon: "👥", screen: "Employees", color: "#E8F4FD" },
  { title: "设备分类", desc: "管理设备分类目录", icon: "📂", screen: "Categories", color: "#F0F5FF" },
  { title: "设备管理", desc: "管理企业设备资产", icon: "💻", screen: "Devices", color: "#F6FFED" },
];

export default function HomeScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("确认退出", "确定要退出登录吗？", [
      { text: "取消", style: "cancel" },
      { text: "退出", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>你好，{user?.username}</Text>
            <Text style={styles.role}>系统管理员</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.[0]?.toUpperCase() || "A"}
            </Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能菜单</Text>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: item.color }]}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出 */}
      <AppButton
        title="退出登录"
        type="outline"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl + 8,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: "#fff",
  },
  role: {
    fontSize: FontSize.md,
    color: "rgba(255,255,255,0.7)",
    marginTop: Spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: "#fff",
  },
  section: {
    margin: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 24,
  },
  menuInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  menuDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
  logoutBtn: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
