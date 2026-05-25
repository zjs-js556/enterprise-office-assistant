import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import UserAvatar from "../components/UserAvatar";
import AppIcon, { IconNames, type IconName } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

interface MenuItemData {
  icon: IconName;
  label: string;
  onPress: () => void;
}

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("确认退出", "确定要退出登录吗？", [
      { text: "取消", style: "cancel" },
      { text: "退出", style: "destructive", onPress: signOut },
    ]);
  };

  const menuSections: { title: string; items: MenuItemData[] }[] = [
    {
      title: "工作台",
      items: [
        { icon: IconNames.logs, label: "我的工单", onPress: () => navigation.navigate("MyTickets") },
        { icon: IconNames.bell, label: "消息通知", onPress: () => navigation.navigate("MessageNotifications") },
        { icon: IconNames.ai, label: "AI 助手", onPress: () => navigation.navigate("AIAssistant") },
      ],
    },
    {
      title: "设置",
      items: [
        { icon: IconNames.lock, label: "修改密码", onPress: () => Alert.alert("提示", "功能开发中") },
        { icon: IconNames.info, label: "关于系统", onPress: () => Alert.alert("关于", "企业移动办公助手 v2.4.1\n\n企业内部办公管理系统") },
        { icon: IconNames.logout, label: "退出登录", onPress: handleLogout },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="个人中心" />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <UserAvatar name={user?.username || "?"} size={64} />
          <Text style={styles.userName}>{user?.username || "管理员"}</Text>
          <Text style={styles.userRole}>
            {user?.role === "admin" ? "系统管理员" : "普通用户"}
          </Text>
        </Card>

        {menuSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card padded={false}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.menuItem,
                    index < section.items.length - 1 && styles.menuItemBorder,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={item.onPress}
                >
                  <AppIcon name={item.icon} size={20} color={Colors.textSecondary} style={styles.menuIcon} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <AppIcon name={IconNames.arrowForward} size={18} color={Colors.textTertiary} />
                </Pressable>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 12,
  },
  userRole: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: 15,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
});
