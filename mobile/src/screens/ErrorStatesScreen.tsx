import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import AppButton from "../components/AppButton";
import AppIcon, { IconNames, type IconName } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

interface ErrorStateItem {
  id: string;
  label: string;
  icon: IconName;
  color: string;
  bg: string;
  title: string;
  desc: string;
  btnLabel: string;
}

const STATES: ErrorStateItem[] = [
  {
    id: "auth",
    label: "未登录",
    icon: IconNames.shield,
    color: "#FA8C16",
    bg: "#FFF7E6",
    title: "登录状态已过期",
    desc: "您的登录凭证已失效，请重新登录以继续使用系统。",
    btnLabel: "返回登录",
  },
  {
    id: "empty",
    label: "空数据",
    icon: IconNames.inbox,
    color: "#1677FF",
    bg: "#EBF4FF",
    title: "暂无数据",
    desc: "当前列表为空，您可以点击下方按钮立即添加第一条记录。",
    btnLabel: "立即添加",
  },
  {
    id: "network",
    label: "网络异常",
    icon: IconNames.wifiOff,
    color: "#FF4D4F",
    bg: "#FFF1F0",
    title: "网络连接失败",
    desc: "无法连接到服务器，请检查网络连接后稍后重试。",
    btnLabel: "重新加载",
  },
];

export default function ErrorStatesScreen({ navigation }: any) {
  const [activeId, setActiveId] = useState("auth");
  const state = STATES.find((s) => s.id === activeId)!;

  return (
    <View style={styles.container}>
      <AppHeader title="异常状态" onBack={() => navigation.goBack()} />

      <View style={styles.tabsBar}>
        {STATES.map((s) => (
          <Pressable
            key={s.id}
            style={({ pressed }) => [
              styles.tab,
              activeId === s.id && styles.tabActive,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => setActiveId(s.id)}
          >
            <Text style={[styles.tabText, activeId === s.id && styles.tabTextActive]}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.body}>
        <View style={[styles.iconBox, { backgroundColor: state.bg }]}>
          <AppIcon name={state.icon} size={40} color={state.color} />
        </View>
        <Text style={styles.title}>{state.title}</Text>
        <Text style={styles.desc}>{state.desc}</Text>
        <AppButton
          title={state.btnLabel}
          onPress={() => {
            if (state.id === "auth") {
              navigation.goBack();
            }
          }}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabsBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    marginBottom: 0,
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 14,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  tabText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 64,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  desc: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  actionBtn: {
    minWidth: 160,
  },
});
