import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import StatusTag from "../components/StatusTag";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function TicketDetailScreen({ route, navigation }: any) {
  const { id } = route.params;

  // Mock data — in production, fetch from API by id
  const ticket = {
    title: "办公电脑无法开机",
    description: "早上到办公室后发现电脑无法正常启动，电源灯不亮，尝试多次无果。已检查电源线连接正常，但按下电源键没有任何反应。需要 IT 协助排查。",
    status: "处理中",
    statusVariant: "primary" as const,
    priority: "中",
    category: "硬件故障",
    creator: "李明",
    assignee: "张工",
    createdAt: "2024-05-22 09:30",
    updatedAt: "2024-05-23 14:15",
  };

  return (
    <View style={styles.container}>
      <AppHeader title="工单详情" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <Text style={styles.title}>{ticket.title}</Text>
          <View style={styles.tags}>
            <StatusTag label={ticket.status} variant={ticket.statusVariant} />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>工单描述</Text>
          <Text style={styles.descText}>{ticket.description}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>详细信息</Text>
          <InfoRow label="优先级" value={ticket.priority} />
          <InfoRow label="分类" value={ticket.category} />
          <InfoRow label="创建人" value={ticket.creator} />
          <InfoRow label="负责人" value={ticket.assignee} />
          <InfoRow label="创建时间" value={ticket.createdAt} />
          <InfoRow label="更新时间" value={ticket.updatedAt} />
        </Card>
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
  headerCard: {},
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
  },
  sectionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
  },
  descText: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
});
