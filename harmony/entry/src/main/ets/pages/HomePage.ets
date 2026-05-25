import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { AuthStore } from '../store/AuthStore';
import { DateUtil } from '../utils/date';
import { EmployeeService } from '../services/employeeService';
import { CategoryService } from '../services/categoryService';
import { DeviceService } from '../services/deviceService';
import { StatCard } from '../components/StatCard';
import { FeatureCard } from '../components/FeatureCard';

@Entry
@Component
struct HomePage {
  @State username: string = '';
  @State greeting: string = '';
  @State todayDate: string = '';
  @State employeeCount: string = '--';
  @State deviceCount: string = '--';
  @State categoryCount: string = '--';
  @State loading: boolean = true;
  private authStore: AuthStore = AuthStore.getInstance();

  async aboutToAppear(): Promise<void> {
    this.username = this.authStore.username;
    this.greeting = DateUtil.getGreeting();
    this.todayDate = DateUtil.getTodayChinese();
    await this.loadStats();
  }

  async loadStats(): Promise<void> {
    try {
      const empRes = await EmployeeService.getList(1, 1);
      const catRes = await CategoryService.getList();
      const devRes = await DeviceService.getList();

      if (empRes.code === 200 && empRes.data) {
        this.employeeCount = String(empRes.data.total);
      }
      if (catRes.code === 200 && catRes.data) {
        this.categoryCount = String(catRes.data.length);
      }
      if (devRes.code === 200 && devRes.data) {
        this.deviceCount = String(devRes.data.length);
      }
    } catch (err) {
      console.error('loadStats error:', JSON.stringify(err));
    } finally {
      this.loading = false;
    }
  }

  navigateTo(page: string): void {
    router.pushUrl({ url: page });
  }

  build() {
    Column() {
      // Blue header
      Column() {
        Row() {
          Text(this.greeting + '，' + this.username)
            .fontSize(Typography.fontSizeXl)
            .fontColor(Colors.textInverse)
            .fontWeight(Typography.fontWeightSemiBold)
            .layoutWeight(1)

          Text('👤')
            .fontSize(24)
        }
        .width('100%')
        .margin({ top: Spacing.lg })

        Text(this.todayDate)
          .fontSize(Typography.fontSizeSm)
          .fontColor('rgba(255,255,255,0.7)')
          .margin({ top: Spacing.xs })
          .alignSelf(ItemAlign.Start)
      }
      .width('100%')
      .padding({
        left: Spacing.pagePadding,
        right: Spacing.pagePadding,
        top: Spacing.xxl,
        bottom: Spacing.xxl
      })
      .backgroundColor(Colors.primary)
      .borderRadius({ bottomLeft: Spacing.borderRadiusXl, bottomRight: Spacing.borderRadiusXl })

      Scroll() {
        Column() {
          // Stats cards
          Row() {
            StatCard({
              label: '在职员工',
              value: this.employeeCount,
              bgColor: Colors.primaryLight,
              textColor: Colors.primary
            })

            StatCard({
              label: '设备总数',
              value: this.deviceCount,
              bgColor: Colors.successLight,
              textColor: Colors.success
            })

            StatCard({
              label: '设备分类',
              value: this.categoryCount,
              bgColor: Colors.purpleLight,
              textColor: Colors.purple
            })
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceBetween)
          .padding({
            left: Spacing.pagePadding,
            right: Spacing.pagePadding,
            top: Spacing.lg
          })

          // Feature grid title
          Text('功能入口')
            .fontSize(Typography.fontSizeLg)
            .fontColor(Colors.textPrimary)
            .fontWeight(Typography.fontWeightSemiBold)
            .margin({ top: Spacing.xxl, bottom: Spacing.md })
            .padding({ left: Spacing.pagePadding })
            .alignSelf(ItemAlign.Start)

          // Feature grid
          Column() {
            // Row 1
            Row() {
              FeatureCard({
                icon: '👥',
                label: '员工管理',
                iconBgColor: Colors.primaryLight,
                iconColor: Colors.primary,
                onCardClick: () => { this.navigateTo('pages/EmployeePage') }
              })

              FeatureCard({
                icon: '📂',
                label: '设备分类',
                iconBgColor: Colors.purpleLight,
                iconColor: Colors.purple,
                onCardClick: () => { this.navigateTo('pages/CategoryPage') }
              })
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)
            .padding({ left: Spacing.pagePadding, right: Spacing.pagePadding })
            .margin({ bottom: Spacing.md })

            // Row 2
            Row() {
              FeatureCard({
                icon: '🖥️',
                label: '设备管理',
                iconBgColor: Colors.successLight,
                iconColor: Colors.success,
                onCardClick: () => { this.navigateTo('pages/DevicePage') }
              })

              FeatureCard({
                icon: '📋',
                label: '系统日志',
                iconBgColor: Colors.warningLight,
                iconColor: Colors.warning,
                onCardClick: () => { this.navigateTo('pages/LogPage') }
              })
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)
            .padding({ left: Spacing.pagePadding, right: Spacing.pagePadding })
            .margin({ bottom: Spacing.md })

            // Row 3
            Row() {
              FeatureCard({
                icon: '👤',
                label: '个人中心',
                iconBgColor: Colors.cyanLight,
                iconColor: Colors.cyan,
                onCardClick: () => { this.navigateTo('pages/ProfilePage') }
              })

              FeatureCard({
                icon: '🤖',
                label: 'AI 助手',
                iconBgColor: Colors.dangerLight,
                iconColor: Colors.danger,
                onCardClick: () => { this.navigateTo('pages/AssistantPage') }
              })
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)
            .padding({ left: Spacing.pagePadding, right: Spacing.pagePadding })
          }
        }
        .padding({ bottom: Spacing.xxxl })
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }
}
