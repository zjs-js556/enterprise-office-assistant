import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct PrimaryButton {
  @Prop title: string = '';
  @Prop loading: boolean = false;
  @Prop disabled: boolean = false;
  @Prop type: 'primary' | 'danger' | 'outline' = 'primary';
  onButtonClick?: () => void;

  build() {
    Button() {
      if (this.loading) {
        LoadingProgress()
          .width(20)
          .height(20)
          .color(this.type === 'outline' ? Colors.primary : Colors.textInverse)
      } else {
        Text(this.title)
          .fontSize(Typography.fontSizeLg)
          .fontColor(this.getTextColor())
          .fontWeight(Typography.fontWeightMedium)
      }
    }
    .width('100%')
    .height(Spacing.buttonHeight)
    .backgroundColor(this.getBgColor())
    .borderRadius(Spacing.borderRadius)
    .enabled(!this.disabled && !this.loading)
    .border(this.type === 'outline' ? { width: 1, color: Colors.primary } : {})
    .onClick(() => {
      if (this.onButtonClick) {
        this.onButtonClick();
      }
    })
  }

  private getBgColor(): string {
    if (this.disabled) {
      return '#CCCCCC';
    }
    switch (this.type) {
      case 'danger':
        return Colors.danger;
      case 'outline':
        return Colors.surface;
      default:
        return Colors.primary;
    }
  }

  private getTextColor(): string {
    if (this.disabled) {
      return Colors.textInverse;
    }
    switch (this.type) {
      case 'outline':
        return Colors.primary;
      default:
        return Colors.textInverse;
    }
  }
}
