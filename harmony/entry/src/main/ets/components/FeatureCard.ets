import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct FeatureCard {
  @Prop icon: string = '';
  @Prop label: string = '';
  @Prop iconBgColor: string = Colors.primaryLight;
  @Prop iconColor: string = Colors.primary;
  onCardClick?: () => void;

  build() {
    Column() {
      Row() {
        Text(this.icon)
          .fontSize(28)
      }
      .width(48)
      .height(48)
      .borderRadius(Spacing.borderRadius)
      .backgroundColor(this.iconBgColor)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)

      Text(this.label)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textPrimary)
        .fontWeight(Typography.fontWeightMedium)
        .margin({ top: Spacing.md })
    }
    .width('47%')
    .padding({ top: Spacing.xl, bottom: Spacing.xl })
    .borderRadius(Spacing.borderRadiusLg)
    .backgroundColor(Colors.surface)
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      if (this.onCardClick) {
        this.onCardClick();
      }
    })
    .border({
      width: 1,
      color: Colors.borderLight
    })
  }
}
