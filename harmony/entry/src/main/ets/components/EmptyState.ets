import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct EmptyState {
  @Prop icon: string = '📋';
  @Prop message: string = '暂无数据';

  build() {
    Column() {
      Text(this.icon)
        .fontSize(48)
        .margin({ bottom: Spacing.lg })

      Text(this.message)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textTertiary)
    }
    .width('100%')
    .height(300)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }
}
