# iOS IPA 爱思助手签名安装方案

## 一、为什么 Windows 不能直接生成 IPA

iOS App 的构建需要 Xcode（`xcodebuild`），Xcode 只能在 macOS 上运行。
Windows 上无法直接执行 iOS 编译、链接、打包流程。

## 二、为什么没有 Apple Developer 账号时不能走 EAS Ad Hoc

EAS Internal Distribution（Ad Hoc）需要在 Apple Developer 后台注册测试设备的 UDID，
然后将 UDID 写入 Provisioning Profile。这要求 Apple Developer Program 付费会员（$99/年）。
没有付费账号时，`eas device:create` 会报错：
`Your Apple ID is not eligible to use this application at this time`

## 三、当前采用方案

```
Expo 项目
  → Mac / 云 Mac / GitHub Actions macOS 环境
    → 生成 unsigned IPA（无签名）
      → 下载到 Windows
        → 爱思助手 Apple ID 签名
          → 安装到 iPhone 测试
```

### 方案前提条件

| 条件 | 说明 |
|------|------|
| 一台能运行 macOS 的设备 | 自己的 Mac / 云 Mac 租用 / GitHub Actions macOS runner |
| Xcode >= 16 | Mac App Store 免费下载 |
| CocoaPods | `brew install cocoapods` |
| Node.js >= 18 | `brew install node` |
| Apple ID（普通账号即可） | 爱思助手签名时使用，不需要付费开发者账号 |
| 爱思助手（Windows） | 官网下载 [i4.cn](https://www.i4.cn) |
| iPhone + 数据线 | 信任电脑、安装签名 App |

> Apple ID 签名有效期通常为 7 天，到期后需要重新签名安装。

## 四、Mac / 云 Mac 上生成 unsigned IPA

### 前置安装

```bash
# 安装 Xcode（从 App Store）
# 安装 Command Line Tools
xcode-select --install

# 安装 CocoaPods
brew install cocoapods

# 安装 Node.js
brew install node
```

### 执行构建

```bash
cd mobile
bash scripts/build-ios-unsigned-ipa.sh
```

### 构建产物

```
mobile/release/enterprise-office-assistant-unsigned.ipa
```

### 如果失败

```bash
# 检查 Node 版本
node -v          # >= 18

# 检查 Xcode 版本
xcodebuild -version

# 检查 CocoaPods
pod --version

# 手动执行预构建
cd mobile
npx expo prebuild --platform ios --clean
cd ios
pod install

# 查看可用 schemes
xcodebuild -workspace *.xcworkspace -list
```

## 五、把 unsigned IPA 拷贝到 Windows

- U 盘 / 网盘 / 微信文件传输 / SMB 共享
- 注意 IPA 文件较大（通常 50-150 MB）

## 六、爱思助手签名并安装

### 步骤

1. 打开爱思助手
2. 用数据线连接 iPhone
3. iPhone 上点击「信任此电脑」
4. 爱思助手菜单 → **工具箱** → **IPA 签名**
5. 选择 **Apple ID 签名**
6. 添加你的 Apple ID（普通账号即可，不需要开发者）
7. 点击「添加 IPA 文件」，选择 `enterprise-office-assistant-unsigned.ipa`
8. 选择当前设备 UDID（爱思助手会自动识别）
9. 点击「立即签名」
10. 签名完成后，打开 **我的设备** → **应用游戏** → **导入安装**，选择签名后的 IPA

### iPhone 上信任证书

安装后首次打开会提示「未受信任的开发者」：

```
设置 → 通用 → VPN 与设备管理 → 点击对应 Apple ID → 信任
```

此后即可正常打开 App。

## 七、测试账号

```
用户名: admin
密码:   admin123456
```

## 八、常见问题

### 没有 IPA

**原因**：macOS 构建脚本未执行或执行失败。
**解决**：检查构建日志，确认 `mobile/release/` 下有 IPA 文件。

### 签名失败

**原因**：Apple ID 密码错误、两步验证未完成、网络异常。
**解决**：确认 Apple ID 可用，尝试重新登录爱思助手中的 Apple ID。

### 安装失败

**原因**：签名无效、设备不匹配、IPA 打包异常。
**解决**：重新签名，确认选择的是正确的设备 UDID。

### 打开闪退

**原因**：Release 构建配置错误、API 地址不可达、ATS 限制。
**解决**：
- 检查 `app.json` 中 `NSAllowsArbitraryLoads` 为 `true`
- 确认后端 `http://114.55.171.7/api/v1` 可访问
- 在 Mac 上重新构建

### 登录失败

**原因**：HTTP ATS 配置未生效，或后端服务异常。
**解决**：
- 确认 `ios.infoPlist.NSAppTransportSecurity.NSAllowsArbitraryLoads = true` 已在 app.json 中配置
- 访问 `http://114.55.171.7/api/v1/health` 检查后端状态

### 签名 7 天后过期

**原因**：Apple ID 签名的 App 有效期只有 7 天。
**解决**：到期后重新用爱思助手签名安装即可（数据不会丢失）。

## 九、项目配置确认

| 配置项 | 值 |
|--------|----|
| Bundle Identifier | `com.enterprise.office.assistant` |
| Build Number | `1` |
| NSAppTransportSecurity | `NSAllowsArbitraryLoads: true` |
| API Base URL | `http://114.55.171.7/api/v1` |
| 签名方式 | 无签名（unsigned）→ 爱思助手 Apple ID 签名 |
| 安装方式 | 爱思助手 + 数据线 |
