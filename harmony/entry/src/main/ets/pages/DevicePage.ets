import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Device } from '../models/Device';
import { Category } from '../models/Category';
import { DeviceService } from '../services/deviceService';
import { CategoryService } from '../services/categoryService';
import { LoadingView } from '../components/LoadingView';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';

@Entry
@Component
struct DevicePage {
  @State devices: Device[] = [];
  @State categories: Category[] = [];
  @State loading: boolean = true;
  @State error: string = '';
  @State selectedCategoryId: number = 0;

  async aboutToAppear(): Promise<void> {
    await Promise.all([this.loadCategories(), this.loadDevices()]);
  }

  async loadCategories(): Promise<void> {
    const response = await CategoryService.getList();
    if (response.code === 200 && response.data) {
      this.categories = response.data;
    }
  }

  async loadDevices(): Promise<void> {
    this.loading = true;
    this.error = '';

    const catId = this.selectedCategoryId > 0 ? this.selectedCategoryId : undefined;
    const response = await DeviceService.getList(catId);

    if (response.code === 200 && response.data) {
      this.devices = response.data;
    } else {
      this.error = response.message || '加载失败';
    }

    this.loading = false;
  }

  async onCategoryFilter(catId: number): Promise<void> {
    this.selectedCategoryId = catId;
    await this.loadDevices();
  }

  navigateToDetail(id: number): void {
    router.pushUrl({ url: 'pages/DeviceDetailPage', params: { id } });
  }

  navigateToForm(id?: number): void {
    if (id) {
      router.pushUrl({ url: 'pages/DeviceFormPage', params: { id } });
    } else {
      router.pushUrl({ url: 'pages/DeviceFormPage' });
    }
  }

  getCategoryName(categoryId: number): string {
    const cat = this.categories.find((c: Category) => c.id === categoryId);
    return cat ? cat.name : '未知分类';
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

        Text('设备管理')
          .fontSize(Typography.fontSizeXl)
          .fontColor(Colors.textInverse)
          .fontWeight(Typography.fontWeightSemiBold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
          .margin({ right: 36 })

        Text('＋')
          .fontSize(24)
          .fontColor(Colors.textInverse)
          .onClick(() => { this.navigateToForm() })
      }
      .width('100%')
      .height(56)
      .padding({ left: Spacing.lg, right: Spacing.lg })
      .backgroundColor(Colors.primary)

      // Category filter chips
      Row() {
        Scroll() {
          Row() {
            Text('全部')
              .fontSize(Typography.fontSizeSm)
              .fontColor(this.selectedCategoryId === 0 ? Colors.textInverse : Colors.textSecondary)
              .fontWeight(Typography.fontWeightMedium)
              .padding({ left: Spacing.md, right: Spacing.md, top: 6, bottom: 6 })
              .backgroundColor(this.selectedCategoryId === 0 ? Colors.primary : Colors.background)
              .borderRadius(16)
              .onClick(() => { this.onCategoryFilter(0) })

            ForEach(this.categories, (cat: Category) => {
              Text(cat.name)
                .fontSize(Typography.fontSizeSm)
                .fontColor(this.selectedCategoryId === cat.id ? Colors.textInverse : Colors.textSecondary)
                .fontWeight(Typography.fontWeightMedium)
                .padding({ left: Spacing.md, right: Spacing.md, top: 6, bottom: 6 })
                .backgroundColor(this.selectedCategoryId === cat.id ? Colors.primary : Colors.background)
                .borderRadius(16)
                .margin({ left: Spacing.sm })
                .onClick(() => { this.onCategoryFilter(cat.id) })
            }, (cat: Category) => String(cat.id))
          }
          .padding({ left: Spacing.pagePadding, right: Spacing.pagePadding })
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .padding({ top: Spacing.md, bottom: Spacing.md })
      .backgroundColor(Colors.surface)

      // Device list
      if (this.loading) {
        LoadingView({ message: '加载中...' })
      } else if (this.error) {
        ErrorView({ message: this.error, onRetry: () => { this.loadDevices() } })
      } else if (this.devices.length === 0) {
        EmptyState({ icon: '🖥️', message: '暂无设备数据' })
      } else {
        List() {
          ForEach(this.devices, (item: Device) => {
            ListItem() {
              Row() {
                Row() {
                  Text('🖥️')
                    .fontSize(24)
                }
                .width(44)
                .height(44)
                .borderRadius(Spacing.borderRadius)
                .backgroundColor(Colors.successLight)
                .justifyContent(FlexAlign.Center)

                Column() {
                  Text(item.name)
                    .fontSize(Typography.fontSizeLg)
                    .fontColor(Colors.textPrimary)
                    .fontWeight(Typography.fontWeightMedium)

                  Row() {
                    Text(this.getCategoryName(item.category_id))
                      .fontSize(Typography.fontSizeXs)
                      .fontColor(Colors.primary)
                      .padding({ left: 6, right: 6, top: 1, bottom: 1 })
                      .backgroundColor(Colors.primaryLight)
                      .borderRadius(4)

                    if (item.model) {
                      Text(item.model)
                        .fontSize(Typography.fontSizeSm)
                        .fontColor(Colors.textTertiary)
                        .margin({ left: Spacing.sm })
                    }
                  }
                  .margin({ top: 2 })
                }
                .alignItems(HorizontalAlign.Start)
                .margin({ left: Spacing.md })
                .layoutWeight(1)

                Text('编辑')
                  .fontSize(Typography.fontSizeSm)
                  .fontColor(Colors.primary)
                  .padding({ left: Spacing.sm, right: Spacing.sm, top: 4, bottom: 4 })
                  .backgroundColor(Colors.primaryLight)
                  .borderRadius(4)
                  .onClick(() => { this.navigateToForm(item.id) })
              }
              .width('100%')
              .padding(Spacing.lg)
              .backgroundColor(Colors.surface)
              .borderRadius(Spacing.borderRadius)
              .border({ width: 1, color: Colors.borderLight })
              .onClick(() => { this.navigateToDetail(item.id) })
            }
            .margin({
              left: Spacing.pagePadding,
              right: Spacing.pagePadding,
              top: Spacing.sm
            })
          }, (item: Device) => String(item.id))
        }
        .layoutWeight(1)
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
