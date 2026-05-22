# Enterprise Office Assistant - Mobile

## 技术栈

- React Native + Expo + TypeScript
- React Navigation
- axios + AsyncStorage
- 函数式组件 + React Hooks

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动 Expo 开发服务器
npx expo start

# 3. 使用 Expo Go 扫码 或 连接模拟器运行
```

## 项目结构

```
mobile/
├── src/
│   ├── api/          # HTTP 客户端与接口封装
│   ├── components/   # 可复用组件
│   ├── screens/      # 页面组件
│   ├── navigation/   # 导航配置
│   ├── context/      # React Context 状态管理
│   ├── hooks/        # 自定义 Hooks
│   ├── types/        # TypeScript 类型定义
│   └── utils/        # 工具函数
├── app.json          # Expo 配置
├── package.json
└── tsconfig.json
```
