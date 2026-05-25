import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

export enum StatusVariant {
  primary = 'primary',
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  default = 'default'
}

@Component
export struct StatusTag {
  @Prop label: string = '';
  @Prop variant: StatusVariant = StatusVariant.default;

  build() {
    Text(this.label)
      .fontSize(Typography.fontSizeXs)
      .fontWeight(Typography.fontWeightMedium)
      .fontColor(this.getTextColor())
      .padding({
        left: Spacing.sm,
        right: Spacing.sm,
        top: 2,
        bottom: 2
      })
      .borderRadius(4)
      .backgroundColor(this.getBgColor())
  }

  private getBgColor(): string {
    switch (this.variant) {
      case StatusVariant.primary:
        return Colors.primaryLight;
      case StatusVariant.success:
        return Colors.successLight;
      case StatusVariant.warning:
        return Colors.warningLight;
      case StatusVariant.danger:
        return Colors.dangerLight;
      default:
        return Colors.borderLight;
    }
  }

  private getTextColor(): string {
    switch (this.variant) {
      case StatusVariant.primary:
        return Colors.primary;
      case StatusVariant.success:
        return Colors.success;
      case StatusVariant.warning:
        return Colors.warning;
      case StatusVariant.danger:
        return Colors.danger;
      default:
        return Colors.textSecondary;
    }
  }
}
