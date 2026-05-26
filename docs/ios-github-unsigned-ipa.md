# GitHub Actions 生成 iOS Unsigned IPA

## 方案说明

```
GitHub Actions (macOS runner)
  → npx expo prebuild --platform ios
    → pod install
      → xcodebuild (CODE_SIGNING_ALLOWED=NO)
        → 打包 Payload/*.app → .ipa
          → upload-artifact
            → 下载到 Windows
              → 爱思助手 Apple ID 签名
                → 安装到 iPhone 测试
```

## 为什么用 GitHub Actions

1. Windows 不能跑 Xcode，无法生成 iOS IPA
2. GitHub Actions 免费提供 macOS runner（公开仓库无限免费用量）
3. 不需要自己的 Mac，不需要 Apple Developer 账号

## 限制

| 限制项 | 说明 |
|--------|------|
| **签名** | 生成的 IPA 是 unsigned，不能直接安装 |
| **有效期** | 爱思助手 Apple ID 签名通常 7 天有效 |
| **可能掉签** | 免费 Apple ID 签名的 App 可能不定期掉签 |
| **仅测试用** | 不能用于 App Store 分发、TestFlight |
| **正式分发** | 需要 Apple Developer Program（$99/年） |

## 操作流程

### 第一步：运行 GitHub Actions

1. 打开 GitHub 仓库页面
2. 点击顶部 **Actions** tab
3. 左侧选择 **"Build iOS Unsigned IPA"**
4. 点击右侧 **"Run workflow"** 按钮
5. 直接点击绿色 **"Run workflow"**（不需要改参数）
6. 等待构建完成（约 15-25 分钟）

### 第二步：下载 IPA

1. 构建完成后，进入该 workflow run 页面
2. 滚动到底部 **Artifacts** 区域
3. 点击 **`enterprise-office-assistant-ios-unsigned-ipa`** 下载
4. 解压 ZIP 得到 `enterprise-office-assistant-unsigned.ipa`

### 第三步：爱思助手签名

1. Windows 上打开爱思助手
2. 用数据线连接 iPhone
3. iPhone 点「信任此电脑」
4. 菜单：**工具箱 → IPA 签名**
5. 选择 **Apple ID 签名**
6. 添加你的 Apple ID（免费账号即可）
7. 点击「添加 IPA 文件」，选择下载的 IPA
8. 确保选中了当前设备 UDID
9. 点击「立即签名」
10. 签名完成后 → **我的设备 → 应用游戏 → 导入安装**

### 第四步：iPhone 信任证书

安装后首次打开会提示「未受信任的开发者」：

```
设置 → 通用 → VPN 与设备管理 → 点击对应 Apple ID → 信任
```

### 第五步：测试

```
用户名: admin
密码:   admin123456
```

## 手动触发构建

在 GitHub 仓库的 Actions 页面手动触发，或使用 `gh` CLI：

```bash
gh workflow run "Build iOS Unsigned IPA"
```

## 本地 Mac 构建（可选）

如果自己有 Mac，也可以本地执行脚本生成 IPA：

```bash
cd mobile
bash scripts/build-ios-unsigned-ipa.sh
```

## 文件清单

| 文件 | 说明 |
|------|------|
| `.github/workflows/build-ios-unsigned-ipa.yml` | GitHub Actions workflow |
| `mobile/scripts/build-ios-unsigned-ipa.sh` | 本地 Mac 构建脚本 |
| `docs/ios-github-unsigned-ipa.md` | 本文档 |

## 常见问题

### 构建失败：prebuild 报错

检查 Expo SDK 版本和依赖是否完整。尝试在 workflow 中将 `npm ci` 改为 `npm install --legacy-peer-deps`。

### 构建成功但找不到 .app

`pod install` 可能未正确执行。检查 iOS 目录是否已生成 `.xcworkspace`。

### 签名失败

- 确认 Apple ID 密码正确
- 确认网络正常
- 尝试重新登录爱思助手中的 Apple ID

### 安装后闪退

- 确认后端 `http://114.55.171.7/api/v1` 可访问
- 确认 `app.json` 中 `NSAllowsArbitraryLoads = true`
- 用 Xcode 模拟器或 Console.app 查看崩溃日志

### 7 天到期后怎么办

重新用爱思助手签名即可（App 数据不丢失），或者重新从 GitHub Actions 下载最新 IPA 再签名。
