import { httpClient, HttpResponse } from './http';

export interface AIRequest {
  question: string;
}

export interface AIResponse {
  answer: string;
  conversation_id?: string;
}

export class AssistantService {
  static async ask(question: string): Promise<HttpResponse<AIResponse>> {
    // When the backend AI endpoint is ready, uncomment the line below:
    // return httpClient.post<AIResponse>('/assistant/ask', { question });

    // Mock response for now
    return new Promise<HttpResponse<AIResponse>>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'ok',
          data: {
            answer: AssistantService.getMockAnswer(question),
            conversation_id: 'mock-session'
          }
        });
      }, 800);
    });
  }

  private static getMockAnswer(question: string): string {
    const q = question.toLowerCase();
    if (q.includes('员工') && q.includes('总数')) {
      return '您可以通过"员工管理"页面查看所有员工信息。在首页的统计卡片中也展示了在职员工总数。';
    }
    if (q.includes('设备') && (q.includes('总数') || q.includes('统计'))) {
      return '您可以通过"设备管理"页面查看所有设备信息。首页展示了设备总数统计。';
    }
    if (q.includes('分类')) {
      return '设备分类管理页面可以创建、编辑和删除分类。每个分类下关联了具体的设备。';
    }
    if (q.includes('你好') || q.includes('hello') || q.includes('hi')) {
      return '您好！我是企业办公助手AI，有什么可以帮助您的吗？';
    }
    if (q.includes('帮助') || q.includes('help')) {
      return `我可以帮您完成以下操作：\n1. 员工管理 - 增删改查员工信息\n2. 设备分类 - 管理设备分类\n3. 设备管理 - 管理公司设备\n4. 查看系统操作日志\n\n请问您需要什么帮助？`;
    }
    return `收到您的问题：「${question}」\n\n目前AI助手功能正在完善中，后续将支持更智能的问答。如有紧急问题，请联系系统管理员。`;
  }
}
