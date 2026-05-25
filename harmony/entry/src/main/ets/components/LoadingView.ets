import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct LoadingView {
  @Prop message: string = '加载中...';

  build() {
    Column() {
      LoadingProgress()
        .width(36)
        .height(36)
        .color(Colors.primary)

      Text(this.message)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textSecondary)
        .margin({ top: Spacing.md })
    }
    .width('100%')
    .height(300)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }
}
