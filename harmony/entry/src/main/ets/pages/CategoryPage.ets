import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Category, CategoryCreateRequest } from '../models/Category';
import { CategoryService } from '../services/categoryService';
import { Validator } from '../utils/validator';
import { LoadingView } from '../components/LoadingView';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';
import { ConfirmDialog } from '../components/ConfirmDialog';

@Entry
@Component
struct CategoryPage {
  @State categories: Category[] = [];
  @State loading: boolean = true;
  @State error: string = '';
  @State showCreateDialog: boolean = false;
  @State categoryNameInput: string = '';
  @State dialogError: string = '';
  @State dialogLoading: boolean = false;
  @State editingId: number = 0;
  @State editNameInput: string = '';
  private deleteTargetId: number = 0;
  private deleteTargetName: string = '';

  async aboutToAppear(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.error = '';
    const response = await CategoryService.getList();
    if (response.code === 200 && response.data) {
      this.categories = response.data;
    } else {
      this.error = response.message || '加载失败';
    }
    this.loading = false;
  }

  showCreate(): void {
    this.categoryNameInput = '';
    this.dialogError = '';
    this.showCreateDialog = true;
  }

  async handleCreate(): Promise<void> {
    const validationError = Validator.validateCategoryForm(this.categoryNameInput);
    if (validationError) {
      this.dialogError = validationError;
      return;
    }

    this.dialogError = '';
    this.dialogLoading = true;

    const data: CategoryCreateRequest = { name: this.categoryNameInput.trim() };
    const response = await CategoryService.create(data);

    if (response.code === 200) {
      this.showCreateDialog = false;
      this.categoryNameInput = '';
      await this.loadData();
    } else {
      this.dialogError = response.message || '创建失败';
    }

    this.dialogLoading = false;
  }

  startEdit(item: Category): void {
    this.editingId = item.id;
    this.editNameInput = item.name;
  }

  cancelEdit(): void {
    this.editingId = 0;
    this.editNameInput = '';
  }

  async handleEdit(id: number): Promise<void> {
    const validationError = Validator.validateCategoryForm(this.editNameInput);
    if (validationError) {
      return;
    }

    const response = await CategoryService.update(id, { name: this.editNameInput.trim() });
    if (response.code === 200) {
      this.editingId = 0;
      this.editNameInput = '';
      await this.loadData();
    }
  }

  showDeleteDialog(id: number, name: string): void {
    this.deleteTargetId = id;
    this.deleteTargetName = name;

    AlertDialog.show({
      title: '确认删除',
      message: `确定要删除分类「${name}」吗？${name}下的所有设备也将受到影响。`,
      autoCancel: true,
      alignment: DialogAlignment.Center,
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '删除',
        fontColor: Colors.danger,
        action: async () => {
          await this.handleDelete();
        }
      }
    });
  }

  async handleDelete(): Promise<void> {
    const response = await CategoryService.delete(this.deleteTargetId);
    if (response.code === 200) {
      await this.loadData();
    }
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

        Text('设备分类')
          .fontSize(Typography.fontSizeXl)
          .fontColor(Colors.textInverse)
          .fontWeight(Typography.fontWeightSemiBold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
          .margin({ right: 36 })

        Text('＋')
          .fontSize(24)
          .fontColor(Colors.textInverse)
          .onClick(() => { this.showCreate() })
      }
      .width('100%')
      .height(56)
      .padding({ left: Spacing.lg, right: Spacing.lg })
      .backgroundColor(Colors.primary)

      if (this.loading) {
        LoadingView({ message: '加载中...' })
      } else if (this.error) {
        ErrorView({ message: this.error, onRetry: () => { this.loadData() } })
      } else if (this.categories.length === 0) {
        EmptyState({ icon: '📂', message: '暂无分类数据' })
      } else {
        List() {
          ForEach(this.categories, (item: Category) => {
            ListItem() {
              if (this.editingId === item.id) {
                // Edit mode
                Row() {
                  TextInput({ text: this.editNameInput, placeholder: '分类名称' })
                    .height(40)
                    .backgroundColor(Colors.background)
                    .borderRadius(Spacing.borderRadius)
                    .padding({ left: Spacing.md, right: Spacing.md })
                    .fontSize(Typography.fontSizeBase)
                    .layoutWeight(1)
                    .onChange((value: string) => {
                      this.editNameInput = value;
                    })

                  Text('保存')
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.textInverse)
                    .padding({ left: Spacing.md, right: Spacing.md, top: 6, bottom: 6 })
                    .backgroundColor(Colors.primary)
                    .borderRadius(4)
                    .margin({ left: Spacing.sm })
                    .onClick(() => { this.handleEdit(item.id) })

                  Text('取消')
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.textSecondary)
                    .padding({ left: Spacing.sm, right: Spacing.sm, top: 6, bottom: 6 })
                    .margin({ left: Spacing.xs })
                    .onClick(() => { this.cancelEdit() })
                }
                .width('100%')
                .padding(Spacing.lg)
                .backgroundColor(Colors.surface)
                .borderRadius(Spacing.borderRadius)
                .border({ width: 1, color: Colors.primaryLight })
              } else {
                // Display mode
                Row() {
                  Row() {
                    Text('📂')
                      .fontSize(24)
                  }
                  .width(44)
                  .height(44)
                  .borderRadius(Spacing.borderRadius)
                  .backgroundColor(Colors.purpleLight)
                  .justifyContent(FlexAlign.Center)

                  Column() {
                    Text(item.name)
                      .fontSize(Typography.fontSizeLg)
                      .fontColor(Colors.textPrimary)
                      .fontWeight(Typography.fontWeightMedium)

                    Text(`${item.device_count} 台设备`)
                      .fontSize(Typography.fontSizeSm)
                      .fontColor(Colors.textSecondary)
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
                    .onClick(() => { this.startEdit(item) })

                  Text('删除')
                    .fontSize(Typography.fontSizeSm)
                    .fontColor(Colors.danger)
                    .padding({ left: Spacing.sm, right: Spacing.sm, top: 4, bottom: 4 })
                    .backgroundColor(Colors.dangerLight)
                    .borderRadius(4)
                    .margin({ left: Spacing.xs })
                    .onClick(() => { this.showDeleteDialog(item.id, item.name) })
                }
                .width('100%')
                .padding(Spacing.lg)
                .backgroundColor(Colors.surface)
                .borderRadius(Spacing.borderRadius)
                .border({ width: 1, color: Colors.borderLight })
              }
            }
            .margin({
              left: Spacing.pagePadding,
              right: Spacing.pagePadding,
              top: Spacing.sm
            })
          }, (item: Category) => String(item.id))
        }
        .layoutWeight(1)
        .edgeEffect(EdgeEffect.Spring)
      }

      // Create dialog
      if (this.showCreateDialog) {
        Column() {
          Column() {
            Text('新增分类')
              .fontSize(Typography.fontSizeLg)
              .fontColor(Colors.textPrimary)
              .fontWeight(Typography.fontWeightSemiBold)
              .margin({ bottom: Spacing.lg })

            TextInput({ text: this.categoryNameInput, placeholder: '请输入分类名称' })
              .height(Spacing.inputHeight)
              .backgroundColor(Colors.background)
              .borderRadius(Spacing.borderRadius)
              .padding({ left: Spacing.md, right: Spacing.md })
              .fontSize(Typography.fontSizeBase)
              .maxLength(20)
              .onChange((value: string) => { this.categoryNameInput = value })

            if (this.dialogError) {
              Text(this.dialogError)
                .fontSize(Typography.fontSizeSm)
                .fontColor(Colors.danger)
                .margin({ top: Spacing.sm })
            }

            Row() {
              Button('取消')
                .fontSize(Typography.fontSizeBase)
                .fontColor(Colors.textSecondary)
                .backgroundColor(Colors.background)
                .borderRadius(Spacing.borderRadius)
                .height(44)
                .layoutWeight(1)
                .onClick(() => {
                  this.showCreateDialog = false;
                })

              Button() {
                if (this.dialogLoading) {
                  LoadingProgress()
                    .width(18)
                    .height(18)
                    .color(Colors.textInverse)
                } else {
                  Text('确认创建')
                    .fontSize(Typography.fontSizeBase)
                    .fontColor(Colors.textInverse)
                }
              }
              .height(44)
              .layoutWeight(1)
              .backgroundColor(Colors.primary)
              .borderRadius(Spacing.borderRadius)
              .margin({ left: Spacing.md })
              .enabled(!this.dialogLoading)
              .onClick(() => { this.handleCreate() })
            }
            .width('100%')
            .margin({ top: Spacing.xl })
          }
          .padding(Spacing.xl)
          .backgroundColor(Colors.surface)
          .borderRadius(Spacing.borderRadiusLg)
          .width('85%')
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor(Colors.overlay)
        .position({ x: 0, y: 0 })
        .onClick(() => { this.showCreateDialog = false })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
