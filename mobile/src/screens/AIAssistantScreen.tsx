import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppHeader from "../components/AppHeader";
import AppIcon, { IconNames } from "../components/AppIcon";
import * as Colors from "../theme/colors";
import * as Spacing from "../theme/spacing";
import * as Typography from "../theme/typography";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const QUICK_ACTIONS = [
  { label: "设备报修流程", prompt: "设备报修的流程是什么？" },
  { label: "员工信息查询", prompt: "如何查询员工信息？" },
  { label: "权限申请", prompt: "如何申请系统权限？" },
];

export default function AIAssistantScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "你好！我是企业办公助手 AI，有什么可以帮你的吗？",
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(msg),
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.bubbleRow, item.role === "user" && styles.bubbleRowUser]}>
      {item.role === "assistant" && (
        <View style={styles.avatar}>
          <AppIcon name={IconNames.ai} size={16} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.bubble, item.role === "user" ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, item.role === "user" && styles.bubbleTextUser]}>
          {item.content}
        </Text>
        <Text style={styles.bubbleTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <AppHeader title="AI 助手" onBack={() => navigation.goBack()} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListHeaderComponent={
          messages.length <= 1 ? (
            <View style={styles.quickActions}>
              <Text style={styles.quickTitle}>常见问题</Text>
              {QUICK_ACTIONS.map((action) => (
                <Pressable
                  key={action.label}
                  style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.6 }]}
                  onPress={() => sendMessage(action.prompt)}
                >
                  <Text style={styles.quickBtnText}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="输入你的问题..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          maxLength={500}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendBtn,
            !input.trim() && styles.sendBtnDisabled,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => sendMessage()}
          disabled={!input.trim()}
        >
          <AppIcon name={IconNames.send} size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function getAIResponse(msg: string): string {
  if (msg.includes("报修")) return "设备报修流程：\n1. 在「设备管理」页面找到故障设备\n2. 点击设备进入详情\n3. 选择「报修」提交报修申请\n4. IT 运维人员将审核并安排维修";
  if (msg.includes("员工")) return "查询员工信息：\n1. 进入「员工管理」页面\n2. 使用搜索栏按姓名或邮箱搜索\n3. 点击员工卡片查看详细信息\n4. 或使用筛选条件快速定位";
  if (msg.includes("权限")) return "权限申请流程：\n1. 进入「个人中心」页面\n2. 选择「权限管理」\n3. 提交所需权限申请\n4. 等待管理员审批";
  return "收到你的问题，我会尽快为你查询相关信息。你也可以在功能菜单中找到对应的操作入口。";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing.lg, paddingBottom: 16 },
  quickActions: { alignItems: "center", marginBottom: Spacing.xxl },
  quickTitle: { fontSize: Typography.sm, color: Colors.textTertiary, marginBottom: 12 },
  quickBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    backgroundColor: Colors.surface, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.borderLight, marginBottom: 8,
  },
  quickBtnText: { fontSize: Typography.md, color: Colors.primary },
  bubbleRow: { flexDirection: "row", marginBottom: 16, alignItems: "flex-end" },
  bubbleRowUser: { justifyContent: "flex-end" },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center", marginRight: 8,
  },
  bubble: { maxWidth: "75%", padding: 12, borderRadius: 16 },
  bubbleAI: { backgroundColor: Colors.surface, borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.primary, borderTopRightRadius: 4 },
  bubbleText: { fontSize: Typography.md, color: Colors.textPrimary, lineHeight: 22 },
  bubbleTextUser: { color: Colors.textInverse },
  bubbleTime: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 4 },
  inputBar: {
    flexDirection: "row", alignItems: "flex-end",
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  input: {
    flex: 1, maxHeight: 96, backgroundColor: Colors.background,
    borderRadius: 20, paddingHorizontal: Spacing.lg, paddingVertical: 10,
    fontSize: Typography.md, color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center", alignItems: "center", marginLeft: 8,
  },
  sendBtnDisabled: { backgroundColor: Colors.borderLight },
});
