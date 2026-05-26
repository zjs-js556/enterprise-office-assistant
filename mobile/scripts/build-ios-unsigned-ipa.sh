#!/bin/bash
#
# 爱思助手方案 — 生成 unsigned IPA
#
# 使用场景：
#   没有 Apple Developer 账号，但需要在 iPhone 上测试 iOS App。
#   在 Mac / 云 Mac / macOS CI 上执行此脚本，生成 unsigned IPA，
#   然后拷贝到 Windows 用爱思助手进行 Apple ID 签名并安装。
#
# 用法：
#   cd mobile
#   bash scripts/build-ios-unsigned-ipa.sh
#
# 前置条件（macOS）：
#   - Node.js >= 18
#   - Xcode >= 16（含 Command Line Tools）
#   - CocoaPods（gem install cocoapods 或 brew install cocoapods）
#
# 输出：
#   mobile/release/enterprise-office-assistant-unsigned.ipa
# ------------------------------------------------------------------

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── 1. 平台检测 ──────────────────────────────────────────────────────────────
OS="$(uname -s)"
if [ "$OS" != "Darwin" ]; then
  err "此脚本必须在 macOS 上运行，当前系统: $OS
  请使用 Mac / 云 Mac / GitHub Actions macOS runner 执行。
  推荐方案:
    - 自己的 Mac
    - GitHub Actions (macos-latest)
    - 云 Mac 租用服务"
fi

# ── 2. 定位 mobile 目录 ──────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MOBILE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
RELEASE_DIR="$MOBILE_DIR/release"
APP_NAME="enterprise-office-assistant"
IPA_OUT="$RELEASE_DIR/${APP_NAME}-unsigned.ipa"

info "mobile 目录: $MOBILE_DIR"
info "输出路径:   $IPA_OUT"

# ── 3. 环境检查 ──────────────────────────────────────────────────────────────
command -v node   >/dev/null 2>&1 || err "未找到 Node.js，请先安装: brew install node"
command -v npx    >/dev/null 2>&1 || err "未找到 npx"
command -v pod    >/dev/null 2>&1 || err "未找到 CocoaPods，请先安装: brew install cocoapods"
command -v xcodebuild >/dev/null 2>&1 || err "未找到 xcodebuild，请安装 Xcode"

# ── 4. 安装依赖 ──────────────────────────────────────────────────────────────
info "安装 npm 依赖..."
cd "$MOBILE_DIR"
npm install --legacy-peer-deps

# ── 5. 生成 iOS 原生项目 ─────────────────────────────────────────────────────
info "生成 iOS 原生项目 (expo prebuild)..."
npx expo prebuild --platform ios --clean

# ── 6. 安装 CocoaPods 依赖 ──────────────────────────────────────────────────
IOS_DIR="$MOBILE_DIR/ios"
cd "$IOS_DIR"
info "安装 CocoaPods 依赖..."
pod install

# ── 7. 自动检测 workspace ────────────────────────────────────────────────────
WORKSPACE=$(find "$IOS_DIR" -maxdepth 1 -name "*.xcworkspace" -not -name "*.xcodeproj" | head -1)
if [ -z "$WORKSPACE" ]; then
  # fallback: 尝试找 xcodeproj
  PROJECT=$(find "$IOS_DIR" -maxdepth 1 -name "*.xcodeproj" | head -1)
  if [ -z "$PROJECT" ]; then
    err "未找到 .xcworkspace 或 .xcodeproj，prebuild 可能未成功生成 iOS 项目"
  fi
  info "使用 .xcodeproj: $(basename "$PROJECT")"
  BUILD_ARG="-project $PROJECT"
else
  info "使用 .xcworkspace: $(basename "$WORKSPACE")"
  BUILD_ARG="-workspace $WORKSPACE"
fi

# ── 8. 自动检测 scheme ──────────────────────────────────────────────────────
if [ -n "${WORKSPACE:-}" ]; then
  SCHEMES=$(xcodebuild $BUILD_ARG -list -json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for scheme in data.get('workspace',{}).get('schemes',[]) or data.get('project',{}).get('schemes',[]):
        print(scheme)
except: pass
" 2>/dev/null)
else
  SCHEMES=$(xcodebuild $BUILD_ARG -list -json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for scheme in data.get('project',{}).get('schemes',[]):
        print(scheme)
except: pass
" 2>/dev/null)
fi

# 优先匹配 slug 名，否则取第一个
SCHEME=$(echo "$SCHEMES" | grep -i "$APP_NAME" | head -1 || echo "$SCHEMES" | head -1)
if [ -z "$SCHEME" ]; then
  err "无法自动检测 scheme，请手动指定。\n  可用 schemes:\n$SCHEMES"
fi
info "使用 scheme: $SCHEME"

# ── 9. xcodebuild — 无签名构建 ──────────────────────────────────────────────
info "开始构建 (Release, 无签名) ..."
BUILD_DIR="$IOS_DIR/build"

xcodebuild \
  $BUILD_ARG \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath "$BUILD_DIR" \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  PROVISIONING_PROFILE="" \
  DEVELOPMENT_TEAM="" \
  -quiet 2>&1 | tail -20

info "构建完成，查找 .app ..."

# ── 10. 定位 .app ────────────────────────────────────────────────────────────
APP_PATH=$(find "$BUILD_DIR/Build/Products/Release-iphoneos" \
  -maxdepth 1 -name "*.app" -type d | head -1)

if [ -z "$APP_PATH" ]; then
  # 尝试更宽泛的搜索
  APP_PATH=$(find "$BUILD_DIR" -name "*.app" -type d -path "*/Release-iphoneos/*" | head -1)
fi

if [ -z "$APP_PATH" ]; then
  err "未找到 .app 产物，xcodebuild 可能失败了。请检查上方日志。"
fi

info ".app 路径: $APP_PATH"
info "App 名称:  $(basename "$APP_PATH")"

# ── 11. 打包成 unsigned IPA ──────────────────────────────────────────────────
info "打包 IPA ..."
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

TEMP_DIR="$RELEASE_DIR/tmp"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR/Payload"
cp -R "$APP_PATH" "$TEMP_DIR/Payload/"

cd "$TEMP_DIR"
zip -rq "$IPA_OUT" Payload
cd "$MOBILE_DIR"
rm -rf "$TEMP_DIR"

# ── 12. 输出结果 ─────────────────────────────────────────────────────────────
IPA_SIZE=$(du -sh "$IPA_OUT" | cut -f1)
echo ""
echo "============================================="
info "✅ unsigned IPA 已生成"
echo ""
echo "  文件: $IPA_OUT"
echo "  大小: $IPA_SIZE"
echo ""
echo "  ── 下一步 ─────────────────────────────────"
echo "  1. 将 IPA 文件拷贝到 Windows"
echo "  2. 用爱思助手 Apple ID 签名"
echo "  3. 安装到 iPhone 测试"
echo ""
echo "  详细说明: docs/ios-ipa-aisi-install.md"
echo "============================================="
