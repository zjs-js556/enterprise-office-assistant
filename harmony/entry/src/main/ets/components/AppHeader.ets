import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct AppHeader {
  @Prop title: string = '';
  @Prop showBack: boolean = false;
  onBack?: () => void;

  build() {
    Row() {
      if (this.showBack) {
        Text('<')
          .fontSize(Typography.fontSizeXl)
          .fontColor(Colors.textInverse)
          .onClick(() => {
            if (this.onBack) {
              this.onBack();
            }
          })
      }

      Text(this.title)
        .fontSize(this.showBack ? Typography.fontSizeLg : Typography.fontSizeXl)
        .fontColor(Colors.textInverse)
        .fontWeight(Typography.fontWeightSemiBold)
        .layoutWeight(1)
        .textAlign(this.showBack ? TextAlign.Center : TextAlign.Start)
        .margin({ left: this.showBack ? Spacing.sm : 0 })
    }
    .width('100%')
    .height(56)
    .padding({ left: Spacing.lg, right: Spacing.lg })
    .backgroundColor(Colors.primary)
  }
}
