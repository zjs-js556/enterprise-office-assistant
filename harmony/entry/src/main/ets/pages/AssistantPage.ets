import { router } from '@kit.ArkUI';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { AssistantService } from '../services/assistantService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

@Entry
@Component
struct AssistantPage {
  @State messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: '您好！我是企业办公助手AI 🤖\n\n我可以帮您：\n• 查询员工、设备信息\n• 解答系统使用问题\n• 提供操作建议\n\n请问有什么可以帮助您的？',
      timestamp: ''
    }
  ];
  @State inputText: string = '';
  @State loading: boolean = false;
  private scroller: Scroller = new Scroller();

  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.loading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };

    this.messages.push(userMessage);
    this.inputText = '';
    this.loading = true;

    // Scroll to bottom
    setTimeout(() => {
      this.scroller.scrollEdge(Edge.Bottom);
    }, 100);

    try {
      const response = await AssistantService.ask(text);

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.code === 200 ? response.data.answer : '抱歉，服务暂时不可用，请稍后重试。',
        timestamp: new Date().toLocaleTimeString()
      };

      this.messages.push(aiMessage);
    } catch (err) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '网络错误，请检查网络连接后重试。',
        timestamp: new Date().toLocaleTimeString()
      };
      this.messages.push(errorMessage);
    }

    this.loading = false;

    setTimeout(() => {
      this.scroller.scrollEdge(Edge.Bottom);
    }, 100);
  }

  handleQuickAction(action: string): void {
    this.inputText = action;
    this.sendMessage();
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

        Text('AI 助手')
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

      // Quick actions
      Row() {
        Scroll() {
          Row() {
            this.QuickChip('员工总数')
            this.QuickChip('设备统计')
            this.QuickChip('设备分类')
            this.QuickChip('你好')
            this.QuickChip('帮助')
          }
          .padding({ left: Spacing.pagePadding, right: Spacing.pagePadding })
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .padding({ top: Spacing.sm, bottom: Spacing.sm })
      .backgroundColor(Colors.surface)

      // Chat messages
      List({ scroller: this.scroller }) {
        ForEach(this.messages, (msg: ChatMessage, index: number) => {
          ListItem() {
            Row() {
              if (msg.role === 'assistant') {
                // AI avatar
                Column() {
                  Text('🤖')
                    .fontSize(24)
                }
                .width(36)
                .height(36)
                .borderRadius(18)
                .backgroundColor(Colors.primaryLight)
                .justifyContent(FlexAlign.Center)
                .alignSelf(ItemAlign.Start)
              }

              Column() {
                Text(msg.content)
                  .fontSize(Typography.fontSizeBase)
                  .fontColor(msg.role === 'user' ? Colors.textInverse : Colors.textPrimary)
                  .textAlign(TextAlign.Start)
                  .padding(Spacing.md)
                  .borderRadius(Spacing.borderRadius)
                  .backgroundColor(
                    msg.role === 'user' ? Colors.primary : Colors.background
                  )
                  .constraintSize({ maxWidth: '70%' })

                if (msg.timestamp) {
                  Text(msg.timestamp)
                    .fontSize(Typography.fontSizeXs)
                    .fontColor(Colors.textTertiary)
                    .margin({ top: 4 })
                }
              }
              .alignItems(msg.role === 'user' ? HorizontalAlign.End : HorizontalAlign.Start)
              .layoutWeight(1)

              if (msg.role === 'user') {
                Column() {
                  Text('👤')
                    .fontSize(20)
                }
                .width(36)
                .height(36)
                .borderRadius(18)
                .backgroundColor(Colors.borderLight)
                .justifyContent(FlexAlign.Center)
                .alignSelf(ItemAlign.Start)
              }
            }
            .width('100%')
            .justifyContent(msg.role === 'user' ? FlexAlign.End : FlexAlign.Start)
            .alignItems(VerticalAlign.Top)
            .padding({
              left: Spacing.pagePadding,
              right: Spacing.pagePadding,
              top: Spacing.sm,
              bottom: Spacing.sm
            })
          }
        }, (msg: ChatMessage, index: number) => `${index}`)
      }
      .layoutWeight(1)
      .edgeEffect(EdgeEffect.Spring)

      // Typing indicator
      if (this.loading) {
        Row() {
          LoadingProgress()
            .width(16)
            .height(16)
            .color(Colors.primary)

          Text('AI 思考中...')
            .fontSize(Typography.fontSizeSm)
            .fontColor(Colors.textSecondary)
            .margin({ left: Spacing.sm })
        }
        .padding({
          left: Spacing.pagePadding,
          right: Spacing.pagePadding,
          bottom: Spacing.sm
        })
      }

      // Input bar
      Row() {
        TextInput({ text: this.inputText, placeholder: '输入您的问题...' })
          .height(44)
          .backgroundColor(Colors.background)
          .borderRadius(22)
          .padding({ left: Spacing.lg, right: Spacing.lg })
          .fontSize(Typography.fontSizeBase)
          .layoutWeight(1)
          .onChange((value: string) => { this.inputText = value })
          .onSubmit(() => { this.sendMessage() })

        Button('发送')
          .fontSize(Typography.fontSizeBase)
          .fontColor(this.inputText.trim() && !this.loading ? Colors.primary : Colors.textTertiary)
          .backgroundColor('transparent')
          .margin({ left: Spacing.sm })
          .onClick(() => { this.sendMessage() })
      }
      .width('100%')
      .padding({
        left: Spacing.pagePadding,
        right: Spacing.pagePadding,
        top: Spacing.md,
        bottom: Spacing.md
      })
      .backgroundColor(Colors.surface)
      .border({
        width: { top: 1 },
        color: Colors.borderLight
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.background)
  }

  @Builder
  QuickChip(label: string) {
    Text(label)
      .fontSize(Typography.fontSizeSm)
      .fontColor(Colors.primary)
      .padding({ left: Spacing.md, right: Spacing.md, top: 6, bottom: 6 })
      .backgroundColor(Colors.primaryLight)
      .borderRadius(16)
      .margin({ right: Spacing.sm })
      .onClick(() => { this.handleQuickAction(label) })
  }
}
