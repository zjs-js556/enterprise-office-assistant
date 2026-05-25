import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employeeService';
import { LoadingView } from '../components/LoadingView';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';
import { ConfirmDialog } from '../components/ConfirmDialog';

@Entry
@Component
struct EmployeePage {
  @State employees: Employee[] = [];
  @State loading: boolean = true;
  @State error: string = '';
  @State refreshing: boolean = false;
  @State page: number = 1;
  @State total: number = 0;
  @State searchText: string = '';
  private deleteDialogController: CustomDialogController = new CustomDialogController({
    builder: ConfirmDialog({
      title: '确认删除',
      message: '',
      dangerous: true,
      confirmText: '删除',
      onConfirm: () => {
        this.confirmDelete();
      }
    }),
    autoCancel: true,
    alignment: DialogAlignment.Center
  });
  private deleteTargetId: number = 0;
  private deleteTargetName: string = '';

  async aboutToAppear(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.error = '';

    const response = await EmployeeService.getList(this.page);
    if (response.code === 200 && response.data) {
      this.employees = response.data.items;
      this.total = response.data.total;
    } else {
      this.error = response.message || '加载失败';
    }

    this.loading = false;
  }

  async onRefresh(): Promise<void> {
    this.refreshing = true;
    this.page = 1;
    await this.loadData();
    this.refreshing = false;
  }

  getFilteredEmployees(): Employee[] {
    if (!this.searchText.trim()) {
      return this.employees;
    }
    const keyword = this.searchText.trim().toLowerCase();
    return this.employees.filter((emp: Employee) => {
      return emp.name.toLowerCase().includes(keyword) ||
        emp.email.toLowerCase().includes(keyword);
    });
  }

  navigateToDetail(id: number): void {
    router.pushUrl({ url: 'pages/EmployeeDetailPage', params: { id } });
  }

  navigateToForm(id?: number): void {
    if (id) {
      router.pushUrl({ url: 'pages/EmployeeFormPage', params: { id } });
    } else {
      router.pushUrl({ url: 'pages/EmployeeFormPage' });
    }
  }

  showDeleteDialog(id: number, name: string): void {
    this.deleteTargetId = id;
    this.deleteTargetName = name;
    // Update the dialog message before showing
    this.deleteDialogController = new CustomDialogController({
      builder: ConfirmDialog({
        title: '确认删除',
        message: `确定要删除员工「${name}」吗？此操作不可撤销。`,
        dangerous: true,
        confirmText: '删除',
        onConfirm: () => {
          this.confirmDelete();
        }
      }),
      autoCancel: true,
      alignment: DialogAlignment.Center
    });
    this.deleteDialogController.open();
  }

  async confirmDelete(): Promise<void> {
    const response = await EmployeeService.delete(this.deleteTargetId);
    if (response.code === 200) {
      this.loadData();
    }
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

        Text('员工管理')
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

      // Search bar
      Row() {
        TextInput({ text: this.searchText, placeholder: '搜索员工姓名或邮箱...' })
          .height(40)
          .backgroundColor(Colors.background)
          .borderRadius(20)
          .padding({ left: Spacing.lg, right: Spacing.lg })
          .fontSize(Typography.fontSizeBase)
          .layoutWeight(1)
          .onChange((value: string) => {
            this.searchText = value;
          })

        if (this.searchText) {
          Text('✕')
            .fontSize(Typography.fontSizeBase)
            .fontColor(Colors.textSecondary)
            .margin({ left: Spacing.sm })
            .onClick(() => {
              this.searchText = '';
            })
        }
      }
      .width('100%')
      .padding({
        left: Spacing.pagePadding,
        right: Spacing.pagePadding,
        top: Spacing.md,
        bottom: Spacing.md
      })
      .backgroundColor(Colors.surface)

      // Content area
      if (this.loading) {
        LoadingView({ message: '加载中...' })
      } else if (this.error) {
        ErrorView({ message: this.error, onRetry: () => { this.loadData() } })
      } else if (this.getFilteredEmployees().length === 0) {
        EmptyState({ icon: '👥', message: this.searchText ? '未找到匹配的员工' : '暂无员工数据' })
      } else {
        List() {
          ForEach(this.getFilteredEmployees(), (item: Employee) => {
            ListItem() {
              Row() {
                Column() {
                  Text(item.name)
                    .fontSize(Typography.fontSizeLg)
                    .fontColor(Colors.textPrimary)
                    .fontWeight(Typography.fontWeightMedium)

                  Text(item.email)
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.textSecondary)
                    .margin({ top: 2 })

                  Text(`年龄: ${item.age}`)
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.textTertiary)
                    .margin({ top: 2 })
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Column() {
                  Text('编辑')
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.primary)
                    .padding({ left: Spacing.sm, right: Spacing.sm, top: 4, bottom: 4 })
                    .backgroundColor(Colors.primaryLight)
                    .borderRadius(4)
                    .onClick(() => { this.navigateToForm(item.id) })

                  Text('删除')
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.danger)
                    .padding({ left: Spacing.sm, right: Spacing.sm, top: 4, bottom: 4 })
                    .backgroundColor(Colors.dangerLight)
                    .borderRadius(4)
                    .margin({ top: Spacing.sm })
                    .onClick(() => { this.showDeleteDialog(item.id, item.name) })
                }
                .margin({ left: Spacing.md })
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
          }, (item: Employee) => String(item.id))
        }
        .layoutWeight(1)
        .edgeEffect(EdgeEffect.Spring)
        .onScrollIndex((start, end) => {
          // Check if scrolled to bottom for pagination
          if (end >= this.employees.length - 3 &&
            this.employees.length < this.total &&
            !this.loading) {
            this.page++;
            this.loadData();
          }
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
