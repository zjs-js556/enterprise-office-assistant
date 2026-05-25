import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

@Component
export struct FormInput {
  @Prop label: string = '';
  @Prop placeholder: string = '';
  @Prop value: string = '';
  @Prop error: string = '';
  @Prop inputType: InputType = InputType.Normal;
  @Prop maxLength: number = 100;
  onChange?: (value: string) => void;

  build() {
    Column() {
      if (this.label) {
        Text(this.label)
          .fontSize(Typography.fontSizeBase)
          .fontColor(Colors.textPrimary)
          .fontWeight(Typography.fontWeightMedium)
          .margin({ bottom: Spacing.sm })
          .alignSelf(ItemAlign.Start)
      }

      TextInput({ text: this.value, placeholder: this.placeholder })
        .type(this.inputType)
        .maxLength(this.maxLength)
        .height(Spacing.inputHeight)
        .backgroundColor(Colors.background)
        .borderRadius(Spacing.borderRadius)
        .padding({ left: Spacing.md, right: Spacing.md })
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textPrimary)
        .placeholderColor(Colors.textTertiary)
        .border({
          width: 1,
          color: this.error ? Colors.danger : Colors.border
        })
        .onChange((value: string) => {
          if (this.onChange) {
            this.onChange(value);
          }
        })

      if (this.error) {
        Text(this.error)
          .fontSize(Typography.fontSizeSm)
          .fontColor(Colors.danger)
          .margin({ top: Spacing.xs })
          .alignSelf(ItemAlign.Start)
      }
    }
    .width('100%')
  }
}
