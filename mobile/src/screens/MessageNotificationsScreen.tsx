import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import MessageItem from "../components/MessageItem";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";

const MOCK_MESSAGES = [
  {
    id: 1,
    title: "系统升级通知",
    content: "系统将于本周六凌晨 2:00-6:00 进行升级维护，届时所有服务将暂停使用，请提前保存工作内容。",
    time: "10:30",
    unread: true,
  },
  {
    id: 2,
    title: "工单处理完成",
    content: "你的工单「网络连接不稳定」已处理完成，请确认并关闭工单。如有问题可重新提交。",
    time: "昨天",
    unread: true,
  },
  {
    id: 3,
    title: "新员工入职通知",
    content: "欢迎新同事王芳加入技术部，请各部门做好相关准备工作。",
    time: "05-20",
    unread: false,
  },
  {
    id: 4,
    title: "设备审批通知",
    content: "你申请的「机械键盘」已通过审批，请于本周五前到 IT 部领取。",
    time: "05-18",
    unread: false,
  },
  {
    id: 5,
    title: "安全提醒",
    content: "近期发现钓鱼邮件增多，请勿点击不明链接或下载可疑附件，如有疑问请联系 IT。",
    time: "05-15",
    unread: false,
  },
];

export default function MessageNotificationsScreen({ navigation }: any) {
  const [messages] = useState(MOCK_MESSAGES);

  return (
    <View style={styles.container}>
      <AppHeader title="消息通知" onBack={() => navigation.goBack()} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageItem
            title={item.title}
            content={item.content}
            time={item.time}
            unread={item.unread}
            onPress={() => {}}
          />
        )}
        ListEmptyComponent={<EmptyState message="暂无消息通知" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
