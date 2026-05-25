import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Device } from '../models/Device';
import { DeviceService } from '../services/deviceService';
import { CategoryService } from '../services/categoryService';
import { DateUtil } from '../utils/date';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';

@Entry
@Component
struct DeviceDetailPage {
  @State device: Device | null = null;
  @State categoryName: string = '';
  @State loading: boolean = true;
  @State error: string = '';
  private deviceId: number = 0;

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, Object>;
    if (params && params['id']) {
      this.deviceId = params['id'] as number;
      this.loadDetail();
    }
  }

  async loadDetail(): Promise<void> {
    this.loading = true;
    const response = await DeviceService.getById(this.deviceId);
    if (response.code === 200 && response.data) {
      this.device = response.data;
      // Load category name
      const catRes = await CategoryService.getList();
      if (catRes.code === 200 && catRes.data) {
        const cat = catRes.data.find((c) => c.id === this.device!.category_id);
        if (cat) {
          this.categoryName = cat.name;
        }
      }
    } else {
      this.error = response.message || '加载失败';
    }
    this.loading = false;
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

        Text('设备详情')
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
      } else if (this.error) {
        ErrorView({ message: this.error, onRetry: () => { this.loadDetail() } })
      } else if (this.device) {
        Scroll() {
          Column() {
            Column() {
              Text('🖥️')
                .fontSize(48)
            }
            .width(80)
            .height(80)
            .borderRadius(40)
            .backgroundColor(Colors.successLight)
            .justifyContent(FlexAlign.Center)
            .margin({ top: Spacing.xxl, bottom: Spacing.lg })

            Text(this.device.name)
              .fontSize(Typography.fontSizeXxl)
              .fontColor(Colors.textPrimary)
              .fontWeight(Typography.fontWeightBold)

            Column() {
              this.DetailRow('设备ID', String(this.device.id))
              this.Divider()
              this.DetailRow('设备名称', this.device.name)
              this.Divider()
              this.DetailRow('设备型号', this.device.model || '未填写')
              this.Divider()
              this.DetailRow('所属分类', this.categoryName)
              this.Divider()
              this.DetailRow('创建时间', DateUtil.formatDateTime(this.device.created_at))
              this.Divider()
              this.DetailRow('更新时间', DateUtil.formatDateTime(this.device.updated_at))
            }
            .width('100%')
            .backgroundColor(Colors.surface)
            .borderRadius(Spacing.borderRadiusLg)
            .padding(Spacing.lg)
            .margin({ top: Spacing.xxl, left: Spacing.pagePadding, right: Spacing.pagePadding })
            .border({ width: 1, color: Colors.borderLight })

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
                    url: 'pages/DeviceFormPage',
                    params: { id: this.device!.id }
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
