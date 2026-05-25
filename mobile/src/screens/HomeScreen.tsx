import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import AppIcon, { IconNames, type IconName } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";
import { Shadows } from "../theme";

interface FeatureItem {
  label: string;
  desc: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  screen: string;
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    label: "员工管理", desc: "管理员工信息",
    icon: IconNames.employees, iconBg: Colors.primaryLight, iconColor: Colors.primary,
    screen: "Employees",
  },
  {
    label: "设备分类", desc: "管理设备类别",
    icon: IconNames.categories, iconBg: Colors.successLight, iconColor: Colors.success,
    screen: "Categories",
  },
  {
    label: "设备管理", desc: "管理办公设备",
    icon: IconNames.devices, iconBg: Colors.purpleLight, iconColor: Colors.purple,
    screen: "Devices",
  },
  {
    label: "系统日志", desc: "查看操作记录",
    icon: IconNames.logs, iconBg: Colors.warningLight, iconColor: Colors.warning,
    screen: "ErrorStates",
  },
  {
    label: "个人中心", desc: "账号与设置",
    icon: IconNames.profile, iconBg: Colors.cyanLight, iconColor: Colors.cyan,
    screen: "Profile",
  },
  {
    label: "AI 助手", desc: "智能办公助手",
    icon: IconNames.ai, iconBg: Colors.dangerLight, iconColor: Colors.danger,
    screen: "AIAssistant",
  },
];

function getTodayString() {
  const d = new Date();
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日，星期${days[d.getDay()]}`;
}

// ============================================================
// Stats Card
// ============================================================
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ============================================================
// Feature Card with Pressable feedback
// ============================================================
function FeatureCard({ item, onPress }: { item: FeatureItem; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.featureCard,
        pressed && styles.featureCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.featureIconBox, { backgroundColor: item.iconBg }]}>
        <AppIcon name={item.icon} size={22} color={item.iconColor} />
      </View>
      <Text style={styles.featureLabel}>{item.label}</Text>
      <Text style={styles.featureDesc}>{item.desc}</Text>
    </Pressable>
  );
}

// ============================================================
// HomeScreen
// ============================================================
export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const handleLogout = useCallback(() => {
    Alert.alert("确认退出", "确定要退出登录吗？", [
      { text: "取消", style: "cancel" },
      { text: "退出", style: "destructive", onPress: signOut },
    ]);
  }, [signOut]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerDecor1} />
          <View style={styles.headerDecor2} />

          <View style={styles.headerTop}>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>欢迎回来</Text>
              <Text style={styles.userName}>{user?.username || "管理员"}</Text>
              <Text style={styles.date}>{getTodayString()}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
                onPress={() => navigation.navigate("MessageNotifications")}
              >
                <AppIcon name={IconNames.bell} size={18} color="#fff" />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
                onPress={handleLogout}
              >
                <AppIcon name={IconNames.logout} size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatCard value="--" label="在职员工" />
            <StatCard value="--" label="设备总数" />
            <StatCard value="--" label="设备分类" />
          </View>
        </View>

        {/* ── Feature Grid ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>功能入口</Text>
          <View style={styles.grid}>
            {FEATURE_ITEMS.map((item) => (
              <FeatureCard
                key={item.screen}
                item={item}
                onPress={() => navigation.navigate(item.screen)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl + 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  headerDecor1: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerDecor2: {
    position: "absolute",
    right: 48,
    top: 64,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
    zIndex: 1,
  },
  headerInfo: {},
  greeting: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 4,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  date: {
    fontSize: Typography.xs,
    color: "rgba(255,255,255,0.55)",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 8,
    zIndex: 1,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: "rgba(255,255,255,0.7)",
  },

  // Feature section
  section: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textTertiary,
    letterSpacing: 3,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  featureCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  featureIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  featureLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    lineHeight: 18,
  },
});
