import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employeeService';
import { Validator } from '../utils/validator';
import { FormInput } from '../components/FormInput';

@Entry
@Component
struct EmployeeFormPage {
  @State name: string = '';
  @State age: string = '';
  @State email: string = '';
  @State loading: boolean = false;
  @State submitting: boolean = false;
  @State error: string = '';
  @State formError: string = '';
  @State isEdit: boolean = false;
  private employeeId: number = 0;

  async aboutToAppear(): Promise<void> {
    const params = router.getParams() as Record<string, Object>;
    if (params && params['id']) {
      this.employeeId = params['id'] as number;
      this.isEdit = true;
      await this.loadEmployee();
    }
  }

  async loadEmployee(): Promise<void> {
    this.loading = true;
    const response = await EmployeeService.getById(this.employeeId);
    if (response.code === 200 && response.data) {
      const emp = response.data as Employee;
      this.name = emp.name;
      this.age = String(emp.age);
      this.email = emp.email;
    } else {
      this.error = response.message || '加载失败';
    }
    this.loading = false;
  }

  async handleSubmit(): Promise<void> {
    const validationError = Validator.validateEmployeeForm(this.name, this.age, this.email);
    if (validationError) {
      this.formError = validationError;
      return;
    }

    this.formError = '';
    this.submitting = true;

    const data = {
      name: this.name.trim(),
      age: parseInt(this.age),
      email: this.email.trim()
    };

    let response;
    if (this.isEdit) {
      response = await EmployeeService.update(this.employeeId, data);
    } else {
      response = await EmployeeService.create(data);
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
      // Header
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

        Text(this.isEdit ? '编辑员工' : '新增员工')
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

      Scroll() {
        Column() {
          // Form card
          Column() {
            FormInput({
              label: '姓名',
              placeholder: '请输入员工姓名',
              value: this.name,
              maxLength: 20,
              onChange: (value: string) => { this.name = value }
            })
              .margin({ bottom: Spacing.lg })

            FormInput({
              label: '年龄',
              placeholder: '请输入年龄 (18-60)',
              value: this.age,
              inputType: InputType.Number,
              maxLength: 3,
              onChange: (value: string) => { this.age = value }
            })
              .margin({ bottom: Spacing.lg })

            FormInput({
              label: '邮箱',
              placeholder: '请输入邮箱地址',
              value: this.email,
              inputType: InputType.Email,
              maxLength: 120,
              onChange: (value: string) => { this.email = value }
            })

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
            .margin({ top: Spacing.xxl })
          }
          .width('100%')
          .backgroundColor(Colors.surface)
          .borderRadius(Spacing.borderRadiusLg)
          .padding(Spacing.xl)
          .border({ width: 1, color: Colors.borderLight })
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
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
