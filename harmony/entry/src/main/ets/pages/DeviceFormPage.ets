import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Device } from '../models/Device';
import { Category } from '../models/Category';
import { DeviceService } from '../services/deviceService';
import { CategoryService } from '../services/categoryService';
import { Validator } from '../utils/validator';
import { FormInput } from '../components/FormInput';
import { LoadingView } from '../components/LoadingView';

@Entry
@Component
struct DeviceFormPage {
  @State name: string = '';
  @State model: string = '';
  @State selectedCategoryId: number = 0;
  @State categories: Category[] = [];
  @State loading: boolean = true;
  @State submitting: boolean = false;
  @State formError: string = '';
  @State isEdit: boolean = false;
  @State showCategoryPicker: boolean = false;
  private deviceId: number = 0;

  async aboutToAppear(): Promise<void> {
    await this.loadCategories();

    const params = router.getParams() as Record<string, Object>;
    if (params && params['id']) {
      this.deviceId = params['id'] as number;
      this.isEdit = true;
      await this.loadDevice();
    } else {
      this.loading = false;
    }
  }

  async loadCategories(): Promise<void> {
    const response = await CategoryService.getList();
    if (response.code === 200 && response.data) {
      this.categories = response.data;
    }
  }

  async loadDevice(): Promise<void> {
    this.loading = true;
    const response = await DeviceService.getById(this.deviceId);
    if (response.code === 200 && response.data) {
      const device = response.data as Device;
      this.name = device.name;
      this.model = device.model || '';
      this.selectedCategoryId = device.category_id;
    }
    this.loading = false;
  }

  getSelectedCategoryName(): string {
    const cat = this.categories.find((c: Category) => c.id === this.selectedCategoryId);
    return cat ? cat.name : '请选择分类';
  }

  async handleSubmit(): Promise<void> {
    const validationError = Validator.validateDeviceForm(
      this.name, this.model, this.selectedCategoryId
    );
    if (validationError) {
      this.formError = validationError;
      return;
    }

    this.formError = '';
    this.submitting = true;

    const data = {
      name: this.name.trim(),
      model: this.model.trim() || undefined,
      category_id: this.selectedCategoryId
    };

    let response;
    if (this.isEdit) {
      response = await DeviceService.update(this.deviceId, data);
    } else {
      response = await DeviceService.create(data);
    }

    if (response.code === 200) {
      router.back();
    } else {
      this.formError = response.message || '操作失败';
    }

    this.submitting = false;
  }

  build() {
    Column() {
      Row() {
        Button() {
          Text('←')
            .fontSize(20)
            .fontColor(Colors.textInverse)
        }
        .width(36)
        .height(36)
        .backgroundColor('transparent')
        .onClick(() => { router.back() })

        Text(this.isEdit ? '编辑设备' : '新增设备')
          .fontSize(Typography.fontSizeXl)
          .fontColor(Colors.textInverse)
          .fontWeight(Typography.fontWeightSemiBold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
          .margin({ right: 36 })
      }
      .width('100%')
      .height(56)
      .padding({ left: Spacing.lg, right: Spacing.lg })
      .backgroundColor(Colors.primary)

      if (this.loading) {
        LoadingView()
      } else {
        Scroll() {
          Column() {
            Column() {
              FormInput({
                label: '设备名称',
                placeholder: '请输入设备名称',
                value: this.name,
                maxLength: 100,
                onChange: (value: string) => { this.name = value }
              })
                .margin({ bottom: Spacing.lg })

              FormInput({
                label: '设备型号（选填）',
                placeholder: '请输入设备型号',
                value: this.model,
                maxLength: 100,
                onChange: (value: string) => { this.model = value }
              })
                .margin({ bottom: Spacing.lg })

              // Category picker
              Column() {
                Text('设备分类')
                  .fontSize(Typography.fontSizeBase)
                  .fontColor(Colors.textPrimary)
                  .fontWeight(Typography.fontWeightMedium)
                  .margin({ bottom: Spacing.sm })
                  .alignSelf(ItemAlign.Start)

                Row() {
                  Text(this.getSelectedCategoryName())
                    .fontSize(Typography.fontSizeBase)
                    .fontColor(this.selectedCategoryId > 0 ? Colors.textPrimary : Colors.textTertiary)
                    .layoutWeight(1)

                  Text('▼')
                    .fontSize(12)
                    .fontColor(Colors.textSecondary)
                }
                .width('100%')
                .height(Spacing.inputHeight)
                .padding({ left: Spacing.md, right: Spacing.md })
                .backgroundColor(Colors.background)
                .borderRadius(Spacing.borderRadius)
                .border({ width: 1, color: Colors.border })
                .onClick(() => { this.showCategoryPicker = true })
              }
              .width('100%')

              if (this.showCategoryPicker) {
                Column() {
                  ForEach(this.categories, (cat: Category) => {
                    Row() {
                      Text(cat.name)
                        .fontSize(Typography.fontSizeBase)
                        .fontColor(
                          this.selectedCategoryId === cat.id ? Colors.primary : Colors.textPrimary
                        )
                        .fontWeight(
                          this.selectedCategoryId === cat.id ?
                          Typography.fontWeightSemiBold : Typography.fontWeightRegular
                        )

                      if (this.selectedCategoryId === cat.id) {
                        Text('✓')
                          .fontSize(Typography.fontSizeBase)
                          .fontColor(Colors.primary)
                          .margin({ left: Spacing.sm })
                      }
                    }
                    .width('100%')
                    .padding(Spacing.md)
                    .onClick(() => {
                      this.selectedCategoryId = cat.id;
                      this.showCategoryPicker = false;
                    })
                  }, (cat: Category) => String(cat.id))
                }
                .width('100%')
                .backgroundColor(Colors.surface)
                .borderRadius(Spacing.borderRadius)
                .border({ width: 1, color: Colors.border })
                .margin({ top: Spacing.xs })
                .padding({ top: Spacing.xs, bottom: Spacing.xs })
              }
            }
            .width('100%')
            .backgroundColor(Colors.surface)
            .borderRadius(Spacing.borderRadiusLg)
            .padding(Spacing.xl)
            .border({ width: 1, color: Colors.borderLight })

            if (this.formError) {
              Text(this.formError)
                .fontSize(Typography.fontSizeSm)
                .fontColor(Colors.danger)
                .padding({
                  left: Spacing.md,
                  right: Spacing.md,
                  top: Spacing.sm,
                  bottom: Spacing.sm
                })
                .backgroundColor(Colors.dangerLight)
                .borderRadius(Spacing.borderRadius)
                .width('100%')
                .margin({ top: Spacing.lg })
            }

            Row() {
              Button('取消')
                .fontSize(Typography.fontSizeBase)
                .fontColor(Colors.textSecondary)
                .backgroundColor(Colors.background)
                .borderRadius(Spacing.borderRadius)
                .height(Spacing.buttonHeight)
                .layoutWeight(1)
                .onClick(() => { router.back() })

              Button() {
                if (this.submitting) {
                  LoadingProgress()
                    .width(20)
                    .height(20)
                    .color(Colors.textInverse)
                } else {
                  Text(this.isEdit ? '保存修改' : '确认创建')
                    .fontSize(Typography.fontSizeBase)
                    .fontColor(Colors.textInverse)
                }
              }
              .height(Spacing.buttonHeight)
              .layoutWeight(1)
              .backgroundColor(Colors.primary)
              .borderRadius(Spacing.borderRadius)
              .margin({ left: Spacing.md })
              .enabled(!this.submitting)
              .onClick(() => { this.handleSubmit() })
            }
            .width('100%')
            .margin({ top: Spacing.xl })
          }
          .width('100%')
          .padding({
            left: Spacing.pagePadding,
            right: Spacing.pagePadding,
            top: Spacing.xl,
            bottom: Spacing.xxxl
          })
        }
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
