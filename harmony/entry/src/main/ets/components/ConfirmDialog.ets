import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@CustomDialog
export struct ConfirmDialog {
  controller: CustomDialogController;
  title: string = '确认操作';
  message: string = '';
  confirmText: string = '确定';
  cancelText: string = '取消';
  dangerous: boolean = false;
  loading: boolean = false;
  onConfirm?: () => void;

  build() {
    Column() {
      Text(this.title)
        .fontSize(Typography.fontSizeLg)
        .fontColor(Colors.textPrimary)
        .fontWeight(Typography.fontWeightSemiBold)
        .margin({ bottom: Spacing.md })

      Text(this.message)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textSecondary)
        .margin({ bottom: Spacing.xl })

      Row() {
        Button(this.cancelText)
          .fontSize(Typography.fontSizeBase)
          .fontColor(Colors.textSecondary)
          .backgroundColor(Colors.background)
          .borderRadius(Spacing.borderRadius)
          .height(44)
          .layoutWeight(1)
          .onClick(() => {
            this.controller.close();
          })

        Button() {
          if (this.loading) {
            LoadingProgress()
              .width(18)
              .height(18)
              .color(Colors.textInverse)
          } else {
            Text(this.confirmText)
              .fontSize(Typography.fontSizeBase)
              .fontColor(Colors.textInverse)
          }
        }
        .height(44)
        .layoutWeight(1)
        .backgroundColor(this.dangerous ? Colors.danger : Colors.primary)
        .borderRadius(Spacing.borderRadius)
        .margin({ left: Spacing.md })
        .enabled(!this.loading)
        .onClick(() => {
          if (this.onConfirm) {
            this.onConfirm();
          }
        })
      }
      .width('100%')
    }
    .padding(Spacing.xxl)
  }
}
