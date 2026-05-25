import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employeeService';
import { DateUtil } from '../utils/date';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';

@Entry
@Component
struct EmployeeDetailPage {
  @State employee: Employee | null = null;
  @State loading: boolean = true;
  @State error: string = '';
  private employeeId: number = 0;

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, Object>;
    if (params && params['id']) {
      this.employeeId = params['id'] as number;
      this.loadDetail();
    }
  }

  async loadDetail(): Promise<void> {
    this.loading = true;
    const response = await EmployeeService.getById(this.employeeId);
    if (response.code === 200 && response.data) {
      this.employee = response.data;
    } else {
      this.error = response.message || '加载失败';
    }
    this.loading = false;
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

        Text('员工详情')
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
        LoadingView({ message: '加载中...' })
      } else if (this.error) {
        ErrorView({ message: this.error, onRetry: () => { this.loadDetail() } })
      } else if (this.employee) {
        Scroll() {
          Column() {
            // Avatar area
            Column() {
              Text(this.employee.name.charAt(0).toUpperCase())
                .fontSize(36)
                .fontColor(Colors.primary)
                .fontWeight(Typography.fontWeightBold)
            }
            .width(80)
            .height(80)
            .borderRadius(40)
            .backgroundColor(Colors.primaryLight)
            .justifyContent(FlexAlign.Center)
            .margin({ top: Spacing.xxl, bottom: Spacing.lg })

            Text(this.employee.name)
              .fontSize(Typography.fontSizeXxl)
              .fontColor(Colors.textPrimary)
              .fontWeight(Typography.fontWeightBold)

            Text('在职')
              .fontSize(Typography.fontSizeSm)
              .fontColor(Colors.success)
              .padding({ left: Spacing.sm, right: Spacing.sm, top: 2, bottom: 2 })
              .backgroundColor(Colors.successLight)
              .borderRadius(4)
              .margin({ top: Spacing.sm })

            // Info card
            Column() {
              this.DetailRow('邮箱', this.employee.email)
              this.Divider()
              this.DetailRow('年龄', String(this.employee.age))
              this.Divider()
              this.DetailRow('员工ID', String(this.employee.id))
              this.Divider()
              this.DetailRow('创建时间', DateUtil.formatDateTime(this.employee.created_at))
              this.Divider()
              this.DetailRow('更新时间', DateUtil.formatDateTime(this.employee.updated_at))
            }
            .width('100%')
            .backgroundColor(Colors.surface)
            .borderRadius(Spacing.borderRadiusLg)
            .padding(Spacing.lg)
            .margin({ top: Spacing.xxl, left: Spacing.pagePadding, right: Spacing.pagePadding })
            .border({ width: 1, color: Colors.borderLight })

            // Action buttons
            Row() {
              Button('编辑')
                .fontSize(Typography.fontSizeBase)
                .fontColor(Colors.primary)
                .backgroundColor(Colors.primaryLight)
                .borderRadius(Spacing.borderRadius)
                .height(44)
                .layoutWeight(1)
                .onClick(() => {
                  router.pushUrl({
                    url: 'pages/EmployeeFormPage',
                    params: { id: this.employee!.id }
                  });
                })
            }
            .width('100%')
            .padding({ left: Spacing.pagePadding, right: Spacing.pagePadding, top: Spacing.lg })
          }
          .width('100%')
          .padding({ bottom: Spacing.xxxl })
        }
        .layoutWeight(1)
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }

  @Builder
  DetailRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textSecondary)
        .width(80)

      Text(value)
        .fontSize(Typography.fontSizeBase)
        .fontColor(Colors.textPrimary)
        .fontWeight(Typography.fontWeightMedium)
        .layoutWeight(1)
    }
    .width('100%')
    .padding({ top: Spacing.md, bottom: Spacing.md })
  }

  @Builder
  Divider() {
    Divider()
      .color(Colors.borderLight)
      .strokeWidth(0.5)
  }
}
