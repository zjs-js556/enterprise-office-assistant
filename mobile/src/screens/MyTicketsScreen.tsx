import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import TicketCard from "../components/TicketCard";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

const MOCK_TICKETS = [
  {
    id: 1,
    title: "办公电脑无法开机",
    description: "早上到办公室后发现电脑无法正常启动，电源灯不亮，尝试多次无果。",
    status: "处理中",
    statusVariant: "primary" as const,
    time: "2024-05-22 09:30",
  },
  {
    id: 2,
    title: "网络连接不稳定",
    description: "下午开始网络断断续续，影响了正常办公，需要排查网络问题。",
    status: "已完成",
    statusVariant: "success" as const,
    time: "2024-05-20 14:15",
  },
  {
    id: 3,
    title: "申请安装开发软件",
    description: "需要安装 VS Code 和相关开发工具用于新项目开发。",
    status: "待分配",
    statusVariant: "default" as const,
    time: "2024-05-21 11:00",
  },
];

const TABS = ["全部", "处理中", "待分配", "已完成"];

export default function MyTicketsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState("全部");
  const [tickets] = useState(MOCK_TICKETS);

  const filtered =
    activeTab === "全部"
      ? tickets
      : tickets.filter((t) => {
          if (activeTab === "处理中") return t.status === "处理中";
          if (activeTab === "待分配") return t.status === "待分配";
          if (activeTab === "已完成") return t.status === "已完成";
          return true;
        });

  return (
    <View style={styles.container}>
      <AppHeader title="我的工单" onBack={() => navigation.goBack()} />

      <View style={styles.tabsBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TicketCard
            title={item.title}
            description={item.description}
            status={item.status}
            statusVariant={item.statusVariant}
            time={item.time}
            onPress={() => navigation.navigate("TicketDetail", { id: item.id })}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          <EmptyState message="暂无工单数据" />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("TicketCreate")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: Colors.borderLight,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    fontSize: 26,
    color: "#fff",
    lineHeight: 28,
  },
});
