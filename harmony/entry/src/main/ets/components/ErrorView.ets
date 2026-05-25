import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct ErrorView {
  @Prop message: string = '加载失败，请重试';
  onRetry?: () => void;

  build() {
    Column() {
      Text('⚠️')
        .fontSize(48)
        .margin({ bottom: Spacing.lg })

      Text(this.message)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textSecondary)
        .textAlign(TextAlign.Center)
        .maxLines(3)

      if (this.onRetry) {
        Button('重试')
          .fontSize(Typography.fontSizeBase)
          .fontColor(Colors.primary)
          .backgroundColor(Colors.primaryLight)
          .borderRadius(Spacing.borderRadius)
          .margin({ top: Spacing.lg })
          .height(40)
          .onClick(() => {
            if (this.onRetry) {
              this.onRetry();
            }
          })
      }
    }
    .width('100%')
    .height(300)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .padding({ left: Spacing.xxl, right: Spacing.xxl })
  }
}
