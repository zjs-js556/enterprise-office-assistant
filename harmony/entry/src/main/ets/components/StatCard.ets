import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct StatCard {
  @Prop label: string = '';
  @Prop value: string = '0';
  @Prop bgColor: string = '#FFFFFF';
  @Prop textColor: string = Colors.primary;

  build() {
    Column() {
      Text(this.value)
        .fontSize(Typography.fontSizeXxl)
        .fontColor(this.textColor)
        .fontWeight(Typography.fontWeightBold)

      Text(this.label)
        .fontSize(Typography.fontSizeSm)
        .fontColor(Colors.textSecondary)
        .fontWeight(Typography.fontWeightRegular)
        .margin({ top: Spacing.xs })
    }
    .width('30%')
    .padding({ top: Spacing.lg, bottom: Spacing.lg })
    .borderRadius(Spacing.borderRadiusLg)
    .backgroundColor(this.bgColor)
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center)
  }
}
