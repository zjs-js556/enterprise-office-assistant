import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { LogEntry } from '../models/Device';
import { LogService } from '../services/logService';
import { DateUtil } from '../utils/date';
import { LoadingView } from '../components/LoadingView';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';
import { StatusTag, StatusVariant } from '../components/StatusTag';

@Entry
@Component
struct LogPage {
  @State logs: LogEntry[] = [];
  @State loading: boolean = true;
  @State error: string = '';
  @State refreshing: boolean = false;

  async aboutToAppear(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.error = '';

    const response = await LogService.getList();
    if (response.code === 200 && response.data) {
      this.logs = response.data;
    } else {
      this.error = response.message || '加载失败';
    }

    this.loading = false;
  }

  async onRefresh(): Promise<void> {
    this.refreshing = true;
    await this.loadData();
    this.refreshing = false;
  }

  getMethodVariant(method: string): StatusVariant {
    switch (method.toUpperCase()) {
      case 'GET':
        return StatusVariant.success;
      case 'POST':
        return StatusVariant.primary;
      case 'PUT':
        return StatusVariant.warning;
      case 'DELETE':
        return StatusVariant.danger;
      default:
        return StatusVariant.default;
    }
  }

  getHttpMethodLabel(method: string): string {
    return method.toUpperCase();
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

        Text('系统日志')
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
        ErrorView({ message: this.error, onRetry: () => { this.loadData() } })
      } else if (this.logs.length === 0) {
        EmptyState({ icon: '📋', message: '暂无日志记录' })
      } else {
        List() {
          ForEach(this.logs, (item: LogEntry) => {
            ListItem() {
              Column() {
                Row() {
                  StatusTag({
                    label: this.getHttpMethodLabel(item.method),
                    variant: this.getMethodVariant(item.method)
                  })

                  Text(item.path)
                    .fontSize(Typography.fontSizeBase)
                    .fontColor(Colors.textPrimary)
                    .fontWeight(Typography.fontWeightMedium)
                    .margin({ left: Spacing.sm })
                    .layoutWeight(1)
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                }
                .width('100%')

                Row() {
                  Text(`IP: ${item.ip_address || '-'}`)
                    .fontSize(Typography.fontSizeXs)
                    .fontColor(Colors.textTertiary)

                  Text(`耗时: ${item.duration_ms || 0}ms`)
                    .fontSize(Typography.fontSizeXs)
                    .fontColor(Colors.textTertiary)
                    .margin({ left: Spacing.md })

                  Text(String(item.status_code))
                    .fontSize(Typography.fontSizeXs)
                    .fontColor(
                      item.status_code >= 400 ? Colors.danger :
                      item.status_code >= 300 ? Colors.warning : Colors.success
                    )
                    .margin({ left: Spacing.md })
                }
                .width('100%')
                .margin({ top: Spacing.sm })

                Text(DateUtil.formatDateTime(item.created_at))
                  .fontSize(Typography.fontSizeXs)
                  .fontColor(Colors.textTertiary)
                  .margin({ top: Spacing.xs })
                  .alignSelf(ItemAlign.Start)
              }
              .width('100%')
              .padding(Spacing.lg)
              .backgroundColor(Colors.surface)
              .borderRadius(Spacing.borderRadius)
              .border({ width: 1, color: Colors.borderLight })
            }
            .margin({
              left: Spacing.pagePadding,
              right: Spacing.pagePadding,
              top: Spacing.sm
            })
          }, (item: LogEntry, index: number) => `${index}-${item.id}`)
        }
        .layoutWeight(1)
        .edgeEffect(EdgeEffect.Spring)
        .onScrollIndex(() => {
          // Pull to refresh
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
