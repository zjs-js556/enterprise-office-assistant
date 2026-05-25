import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { AuthStore } from '../store/AuthStore';
import { Validator } from '../utils/validator';

@Entry
@Component
struct LoginPage {
  @State username: string = 'admin';
  @State password: string = 'admin123456';
  @State showPassword: boolean = false;
  @State loading: boolean = false;
  @State errorMessage: string = '';
  @State checkingAuth: boolean = true;
  private authStore: AuthStore = AuthStore.getInstance();

  async aboutToAppear(): Promise<void> {
    await this.authStore.initialize();
    if (this.authStore.getIsLoggedIn()) {
      this.navigateToHome();
    }
    this.checkingAuth = false;
  }

  navigateToHome(): void {
    router.replaceUrl({ url: 'pages/HomePage' });
  }

  async handleLogin(): Promise<void> {
    const validationError = Validator.validateLoginForm(this.username, this.password);
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    try {
      const result = await this.authStore.login(this.username.trim(), this.password);
      if (result.success) {
        this.navigateToHome();
      } else {
        this.errorMessage = result.message;
      }
    } catch (err) {
      this.errorMessage = '网络错误，请检查网络连接后重试';
    } finally {
      this.loading = false;
    }
  }

  build() {
    if (this.checkingAuth) {
      Column() {
        LoadingProgress()
          .width(36)
          .height(36)
          .color(Colors.primary)
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .backgroundColor(Colors.background)
    } else {
      Column() {
        // Header area
        Column() {
          Row() {
            Text('EA')
              .fontSize(Typography.fontSizeXxl)
              .fontColor(Colors.textInverse)
              .fontWeight(Typography.fontWeightBold)
          }
          .width(64)
          .height(64)
          .borderRadius(Spacing.borderRadiusLg)
          .backgroundColor('rgba(255,255,255,0.2)')
          .justifyContent(FlexAlign.Center)

          Text('企业办公助手')
            .fontSize(Typography.fontSizeTitle)
            .fontColor(Colors.textInverse)
            .fontWeight(Typography.fontWeightBold)
            .margin({ top: Spacing.md })

          Text('高效管理员工与设备')
            .fontSize(Typography.fontSizeBase)
            .fontColor('rgba(255,255,255,0.8)')
            .margin({ top: Spacing.xs })
        }
        .width('100%')
        .height('35%')
        .backgroundColor(Colors.primary)
        .borderRadius({ bottomLeft: Spacing.borderRadiusXl, bottomRight: Spacing.borderRadiusXl })
        .justifyContent(FlexAlign.Center)

        // Form area
        Column() {
          Column() {
            // Username
            Column() {
              Text('用户名')
                .fontSize(Typography.fontSizeBase)
                .fontColor(Colors.textPrimary)
                .fontWeight(Typography.fontWeightMedium)
                .margin({ bottom: Spacing.sm })
                .alignSelf(ItemAlign.Start)

              TextInput({ text: this.username, placeholder: '请输入用户名' })
                .height(Spacing.inputHeight)
                .backgroundColor(Colors.background)
                .borderRadius(Spacing.borderRadius)
                .padding({ left: Spacing.md, right: Spacing.md })
                .fontSize(Typography.fontSizeBase)
                .border({ width: 1, color: Colors.border })
                .onChange((value: string) => {
                  this.username = value;
                })
            }
            .width('100%')
            .margin({ bottom: Spacing.lg })

            // Password
            Column() {
              Text('密码')
                .fontSize(Typography.fontSizeBase)
                .fontColor(Colors.textPrimary)
                .fontWeight(Typography.fontWeightMedium)
                .margin({ bottom: Spacing.sm })
                .alignSelf(ItemAlign.Start)

              Row() {
                TextInput({
                  text: this.password,
                  placeholder: '请输入密码'
                })
                  .type(this.showPassword ? InputType.Normal : InputType.Password)
                  .height(Spacing.inputHeight)
                  .backgroundColor(Colors.background)
                  .borderRadius(0)
                  .padding({ left: Spacing.md })
                  .fontSize(Typography.fontSizeBase)
                  .layoutWeight(1)
                  .backgroundColor('transparent')
                  .onChange((value: string) => {
                    this.password = value;
                  })

                Text(this.showPassword ? '🙈' : '👁️')
                  .fontSize(18)
                  .padding({ left: Spacing.sm, right: Spacing.md })
                  .onClick(() => {
                    this.showPassword = !this.showPassword;
                  })
              }
              .width('100%')
              .height(Spacing.inputHeight)
              .backgroundColor(Colors.background)
              .borderRadius(Spacing.borderRadius)
              .border({ width: 1, color: Colors.border })
            }
            .width('100%')

            // Error message
            if (this.errorMessage) {
              Text(this.errorMessage)
                .fontSize(Typography.fontSizeSm)
                .fontColor(Colors.danger)
                .padding({
                  left: Spacing.md,
                  right: Spacing.md,
                  top: Spacing.sm,
                  bottom: Spacing.sm
                })
                .backgroundColor(Colors.dangerLight)
                .borderRadius(Spacing.borderRadius)
                .width('100%')
                .margin({ top: Spacing.lg })
            }

            // Login button
            Button() {
              if (this.loading) {
                LoadingProgress()
                  .width(20)
                  .height(20)
                  .color(Colors.textInverse)
              } else {
                Text('登 录')
                  .fontSize(Typography.fontSizeLg)
                  .fontColor(Colors.textInverse)
                  .fontWeight(Typography.fontWeightMedium)
              }
            }
            .width('100%')
            .height(Spacing.buttonHeight)
            .backgroundColor(Colors.primary)
            .borderRadius(Spacing.borderRadius)
            .enabled(!this.loading)
            .margin({ top: this.errorMessage ? Spacing.lg : Spacing.xxl })
            .onClick(() => {
              this.handleLogin();
            })
          }
          .width('100%')
          .padding({
            left: Spacing.xxl,
            right: Spacing.xxl,
            top: Spacing.xxxl,
            bottom: Spacing.xxl
          })
          .backgroundColor(Colors.surface)
          .borderRadius(Spacing.borderRadiusLg)
          .margin({ left: Spacing.pagePadding, right: Spacing.pagePadding })
          .offset({ y: -30 })
        }
        .width('100%')
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Colors.background)
    }
  }
}
