import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { AuthStore } from '../store/AuthStore';

@Entry
@Component
struct ProfilePage {
  @State username: string = '';
  @State role: string = '';
  private authStore: AuthStore = AuthStore.getInstance();

  aboutToAppear(): void {
    this.username = this.authStore.username;
    this.role = this.authStore.role;
  }

  async handleLogout(): Promise<void> {
    AlertDialog.show({
      title: '确认退出',
      message: '确定要退出登录吗？',
      autoCancel: true,
      alignment: DialogAlignment.Center,
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '退出',
        fontColor: Colors.danger,
        action: async () => {
          await this.authStore.logout();
          router.replaceUrl({ url: 'pages/LoginPage' });
        }
      }
    });
  }

  build() {
    Column() {
      // Header
      Row() {
        Button() {
          Text('←')
            .fontSize(20)
            .fontColor(Colors.textInverse)
        }
        .width(36)
        .height(36)
        .backgroundColor('transparent')
        .onClick(() => { router.back() })

        Text('个人中心')
          .fontSize(Typography.fontSizeXl)
          .fontColor(Colors.textInverse)
          .fontWeight(Typography.fontWeightSemiBold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
          .margin({ right: 36 })
      }
      .width('100%')
      .height(56)
      .padding({ left: Spacing.lg, right: Spacing.lg })
      .backgroundColor(Colors.primary)

      Scroll() {
        Column() {
          // Avatar and user info
          Column() {
            Column() {
              Text(this.username.charAt(0).toUpperCase())
                .fontSize(36)
                .fontColor(Colors.primary)
                .fontWeight(Typography.fontWeightBold)
            }
            .width(80)
            .height(80)
            .borderRadius(40)
            .backgroundColor(Colors.primaryLight)
            .justifyContent(FlexAlign.Center)
            .margin({ top: Spacing.xxl })

            Text(this.username)
              .fontSize(Typography.fontSizeXxl)
              .fontColor(Colors.textPrimary)
              .fontWeight(Typography.fontWeightBold)
              .margin({ top: Spacing.md })

            Text(this.role === 'admin' ? '系统管理员' : this.role)
              .fontSize(Typography.fontSizeSm)
              .fontColor(Colors.textInverse)
              .padding({ left: Spacing.md, right: Spacing.md, top: 2, bottom: 2 })
              .backgroundColor(Colors.primary)
              .borderRadius(12)
              .margin({ top: Spacing.sm })
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)

          // Info card
          Column() {
            this.MenuItem('用户名', this.username)
            this.Divider()
            this.MenuItem('角色', this.role === 'admin' ? '系统管理员' : this.role)
            this.Divider()
            this.MenuItem('应用版本', '1.0.0')
          }
          .width('100%')
          .backgroundColor(Colors.surface)
          .borderRadius(Spacing.borderRadiusLg)
          .padding({ top: Spacing.xs, bottom: Spacing.xs })
          .margin({
            top: Spacing.xxl,
            left: Spacing.pagePadding,
            right: Spacing.pagePadding
          })
          .border({ width: 1, color: Colors.borderLight })

          // Shortcuts
          Column() {
            this.ShortcutItem('📋', '系统日志', () => {
              router.pushUrl({ url: 'pages/LogPage' });
            })
            this.Divider()
            this.ShortcutItem('🤖', 'AI 助手', () => {
              router.pushUrl({ url: 'pages/AssistantPage' });
            })
          }
          .width('100%')
          .backgroundColor(Colors.surface)
          .borderRadius(Spacing.borderRadiusLg)
          .padding({ top: Spacing.xs, bottom: Spacing.xs })
          .margin({
            top: Spacing.lg,
            left: Spacing.pagePadding,
            right: Spacing.pagePadding
          })
          .border({ width: 1, color: Colors.borderLight })

          // Logout button
          Button('退出登录')
            .fontSize(Typography.fontSizeLg)
            .fontColor(Colors.danger)
            .fontWeight(Typography.fontWeightMedium)
            .width('100%')
            .height(Spacing.buttonHeight)
            .backgroundColor(Colors.surface)
            .borderRadius(Spacing.borderRadius)
            .border({ width: 1, color: Colors.danger })
            .margin({
              left: Spacing.pagePadding,
              right: Spacing.pagePadding,
              top: Spacing.xxl
            })
            .onClick(() => { this.handleLogout() })
        }
        .width('100%')
        .padding({ bottom: Spacing.xxxl })
      }
      .layoutWeight(1)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }

  @Builder
  MenuItem(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textSecondary)
        .width(100)

      Text(value)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textPrimary)
        .fontWeight(Typography.fontWeightMedium)
        .layoutWeight(1)
    }
    .width('100%')
    .padding({
      left: Spacing.lg,
      right: Spacing.lg,
      top: Spacing.md,
      bottom: Spacing.md
    })
  }

  @Builder
  ShortcutItem(icon: string, label: string, onClick: () => void) {
    Row() {
      Text(icon)
        .fontSize(20)

      Text(label)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textPrimary)
        .margin({ left: Spacing.md })
        .layoutWeight(1)

      Text('>')
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textTertiary)
    }
    .width('100%')
    .padding({
      left: Spacing.lg,
      right: Spacing.lg,
      top: Spacing.md,
      bottom: Spacing.md
    })
    .onClick(onClick)
  }

  @Builder
  Divider() {
    Divider()
      .color(Colors.borderLight)
      .strokeWidth(0.5)
  }
}
