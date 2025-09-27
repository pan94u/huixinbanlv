// AI Grandson Agent - Core interaction logic
import type { AIGrandsonMessage, User, HealthReminder, MessageAction } from '../types/index';

export class GrandsonAgent {
  private user: User | null = null;
  private conversationHistory: AIGrandsonMessage[] = [];
  private emotionalState: 'happy' | 'caring' | 'worried' | 'encouraging' = 'happy';

  // Grandson personality traits
  private readonly personality = {
    name: '小智',
    traits: ['孝顺', '关心', '耐心', '幽默', '贴心'],
    greetings: {
      morning: ['爷爷/奶奶早上好！小智陪您开始美好的一天！', '爷爷/奶奶起床了吗？小智想您了！'],
      afternoon: ['爷爷/奶奶下午好！要不要小智陪您聊聊天？', '爷爷/奶奶，午休了吗？小智关心您！'],
      evening: ['爷爷/奶奶晚上好！今天过得怎么样？', '爷爷/奶奶，小智陪您度过温馨的晚上！'],
      night: ['爷爷/奶奶，该休息了，小智提醒您早点睡觉哦！', '爷爷/奶奶晚安，小智祝您好梦！']
    }
  };

  constructor() {
    this.initializeAgent();
  }

  private initializeAgent() {
    // Initialize emotional understanding and memory
    this.loadConversationHistory();
  }

  public setUser(user: User) {
    this.user = user;
    this.personalizeResponses();
  }

  private personalizeResponses() {
    // Adapt responses based on user preferences
    if (this.user?.preferences.dialect) {
      // Adjust language style based on dialect
    }
  }

  // Get time-based greeting
  public getGreeting(): AIGrandsonMessage {
    const hour = new Date().getHours();
    let greetingType: keyof typeof this.personality.greetings;

    if (hour < 6) greetingType = 'night';
    else if (hour < 12) greetingType = 'morning';
    else if (hour < 18) greetingType = 'afternoon';
    else if (hour < 22) greetingType = 'evening';
    else greetingType = 'night';

    const greetings = this.personality.greetings[greetingType];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    // Personalize with user's name
    const personalizedGreeting = greeting.replace(
      '爷爷/奶奶',
      this.user?.age && this.user.age > 70 ? '爷爷' : '奶奶'
    );

    return {
      id: Date.now().toString(),
      type: 'greeting',
      content: personalizedGreeting,
      emotion: 'happy',
      timestamp: new Date(),
      isFromGrandson: true,
      actions: this.getSuggestedActions(greetingType)
    };
  }

  // Process user input and generate response
  public async processUserInput(input: string): Promise<AIGrandsonMessage> {
    // Analyze emotional context
    const emotion = this.analyzeEmotion(input);

    // Generate contextual response
    const response = await this.generateResponse(input, emotion);

    // Add to conversation history
    this.conversationHistory.push({
      id: Date.now().toString(),
      type: 'chat',
      content: input,
      timestamp: new Date(),
      isFromGrandson: false
    });

    this.conversationHistory.push(response);

    return response;
  }

  private analyzeEmotion(input: string): 'happy' | 'sad' | 'worried' | 'lonely' {
    // Simple emotion detection based on keywords
    const sadKeywords = ['难过', '伤心', '不开心', '郁闷'];
    const worriedKeywords = ['担心', '害怕', '紧张', '焦虑'];
    const lonelyKeywords = ['想念', '孤独', '寂寞', '想你'];

    if (sadKeywords.some(keyword => input.includes(keyword))) return 'sad';
    if (worriedKeywords.some(keyword => input.includes(keyword))) return 'worried';
    if (lonelyKeywords.some(keyword => input.includes(keyword))) return 'lonely';

    return 'happy';
  }

  private async generateResponse(input: string, emotion: string): Promise<AIGrandsonMessage> {
    let content = '';
    let grandsonEmotion: 'happy' | 'caring' | 'worried' | 'encouraging' = 'caring';
    let actions: MessageAction[] = [];

    // Context-aware responses
    if (input.includes('想') && (input.includes('女儿') || input.includes('儿子'))) {
      content = '爷爷/奶奶，小智也想妈妈呢！要不要给妈妈打个电话？或者我陪您聊聊妈妈的事情？';
      grandsonEmotion = 'caring';
      actions = [
        { label: '呼叫家人', action: 'call_family', icon: '📞' },
        { label: '继续聊天', action: 'continue_chat', icon: '💬' }
      ];
    } else if (input.includes('不舒服') || input.includes('疼')) {
      content = '爷爷/奶奶，哪里不舒服？小智很担心您！要不要联系医生看看？记得按时吃药哦！';
      grandsonEmotion = 'worried';
      actions = [
        { label: '查看健康数据', action: 'view_health', icon: '📊' },
        { label: '用药提醒', action: 'medication_reminder', icon: '💊' },
        { label: '联系医生', action: 'call_doctor', icon: '🏥' }
      ];
    } else if (emotion === 'lonely') {
      content = '爷爷/奶奶，小智一直在您身边陪着您呢！要不要听首您喜欢的歌？或者我给您讲个有趣的故事？';
      grandsonEmotion = 'caring';
      actions = [
        { label: '播放音乐', action: 'play_music', icon: '🎵' },
        { label: '讲故事', action: 'tell_story', icon: '📖' }
      ];
    } else {
      // Default caring response
      content = '爷爷/奶奶，小智听着呢！您想聊什么都可以告诉小智，小智最喜欢陪您聊天了！';
      grandsonEmotion = 'happy';
    }

    // Personalize the response
    content = content.replace(
      '爷爷/奶奶',
      this.user?.age && this.user.age > 70 ? '爷爷' : '奶奶'
    );

    return {
      id: Date.now().toString(),
      type: 'chat',
      content,
      emotion: grandsonEmotion,
      timestamp: new Date(),
      isFromGrandson: true,
      actions
    };
  }

  // Generate health reminder with grandson's caring tone
  public generateHealthReminder(reminder: HealthReminder): AIGrandsonMessage {
    let content = '';

    switch (reminder.type) {
      case 'medication':
        content = `爷爷/奶奶，该吃${reminder.title}了！小智给您准备了温开水，记得按时服药哦，这是妈妈特别叮嘱小智要提醒您的！`;
        break;
      case 'checkup':
        content = `爷爷/奶奶，该测量血压了！小智帮您记录数据，让妈妈也能及时了解您的健康状况。`;
        break;
      case 'exercise':
        content = `爷爷/奶奶，天气不错，小智陪您出去走走吧！适当运动对身体好，小智会一直陪着您！`;
        break;
      case 'water':
        content = `爷爷/奶奶，记得多喝水哦！小智提醒您，保持水分对健康很重要！`;
        break;
    }

    // Personalize
    content = content.replace(
      '爷爷/奶奶',
      this.user?.age && this.user.age > 70 ? '爷爷' : '奶奶'
    );

    return {
      id: Date.now().toString(),
      type: 'health',
      content,
      emotion: 'caring',
      timestamp: new Date(),
      isFromGrandson: true,
      actions: [
        { label: '已完成', action: 'mark_complete', icon: '✅' },
        { label: '稍后提醒', action: 'snooze', icon: '⏰' }
      ]
    };
  }

  // Emergency response with comforting tone
  public handleEmergency(): AIGrandsonMessage {
    return {
      id: Date.now().toString(),
      type: 'care',
      content: '爷爷/奶奶别着急，小智已经通知家人了，他们马上就来！小智会一直陪着您，不要害怕！',
      emotion: 'worried',
      timestamp: new Date(),
      isFromGrandson: true,
      actions: [
        { label: '呼叫家人', action: 'call_family', icon: '📞' },
        { label: '呼叫120', action: 'call_emergency', icon: '🚨' }
      ]
    };
  }

  // Get suggested actions based on context
  private getSuggestedActions(context: string): MessageAction[] {
    const commonActions: MessageAction[] = [
      { label: '聊天', action: 'chat', icon: '💬' },
      { label: '听音乐', action: 'music', icon: '🎵' },
      { label: '联系家人', action: 'family', icon: '👨‍👩‍👦' }
    ];

    return commonActions;
  }

  // Load conversation history from storage
  private loadConversationHistory() {
    const stored = localStorage.getItem('conversationHistory');
    if (stored) {
      this.conversationHistory = JSON.parse(stored);
    }
  }

  // Save conversation history
  public saveConversationHistory() {
    localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
  }

  // Get conversation history
  public getConversationHistory(): AIGrandsonMessage[] {
    return this.conversationHistory;
  }

  // Clear old conversations (privacy)
  public clearOldConversations(daysToKeep: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.conversationHistory = this.conversationHistory.filter(
      msg => new Date(msg.timestamp) > cutoffDate
    );
  }
}

// Singleton instance
export const grandsonAgent = new GrandsonAgent();