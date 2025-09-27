import { create } from 'zustand';
import type {
  Guardian,
  ElderlyParent,
  HealthData,
  Alert,
  Reminder,
  ServiceBooking,
  Message,
  DashboardStats,
  AppScreen
} from '../types/index';

interface GuardianStore {
  // User state
  currentUser: Guardian | null;
  elderlyParents: ElderlyParent[];
  selectedParent: ElderlyParent | null;

  // Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;

  // Health data
  healthHistory: HealthData[];
  addHealthData: (data: HealthData) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminderId: string, updates: Partial<Reminder>) => void;
  deleteReminder: (reminderId: string) => void;

  // Services
  serviceBookings: ServiceBooking[];
  addServiceBooking: (booking: ServiceBooking) => void;
  updateBookingStatus: (bookingId: string, status: ServiceBooking['status']) => void;

  // Messages
  messages: Message[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markMessageAsRead: (messageId: string) => void;

  // Dashboard stats
  dashboardStats: DashboardStats | null;
  updateDashboardStats: (stats: DashboardStats) => void;

  // Actions
  setCurrentUser: (user: Guardian) => void;
  selectParent: (parent: ElderlyParent) => void;
  initializeApp: () => void;
}

export const useGuardianStore = create<GuardianStore>((set, get) => ({
  // Initial state
  currentUser: null,
  elderlyParents: [],
  selectedParent: null,
  currentScreen: 'dashboard',
  healthHistory: [],
  alerts: [],
  reminders: [],
  serviceBookings: [],
  messages: [],
  dashboardStats: null,

  // Navigation
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  // Health data management
  addHealthData: (data) => set((state) => ({
    healthHistory: [...state.healthHistory, data]
  })),

  // Alert management
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts]
  })),

  acknowledgeAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(a =>
      a.id === alertId ? { ...a, status: 'acknowledged' as const } : a
    )
  })),

  resolveAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(a =>
      a.id === alertId ? { ...a, status: 'resolved' as const } : a
    )
  })),

  // Reminder management
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder]
  })),

  updateReminder: (reminderId, updates) => set((state) => ({
    reminders: state.reminders.map(r =>
      r.id === reminderId ? { ...r, ...updates } : r
    )
  })),

  deleteReminder: (reminderId) => set((state) => ({
    reminders: state.reminders.filter(r => r.id !== reminderId)
  })),

  // Service booking management
  addServiceBooking: (booking) => set((state) => ({
    serviceBookings: [...state.serviceBookings, booking]
  })),

  updateBookingStatus: (bookingId, status) => set((state) => ({
    serviceBookings: state.serviceBookings.map(b =>
      b.id === bookingId ? { ...b, status } : b
    )
  })),

  // Message management
  sendMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),

  markMessageAsRead: (messageId) => set((state) => ({
    messages: state.messages.map(m =>
      m.id === messageId ? { ...m, read: true } : m
    )
  })),

  // Dashboard stats
  updateDashboardStats: (stats) => set({ dashboardStats: stats }),

  // User and parent management
  setCurrentUser: (user) => set({ currentUser: user }),
  selectParent: (parent) => set({ selectedParent: parent }),

  // Initialize with mock data
  initializeApp: () => {
    const mockParent: ElderlyParent = {
      id: '1',
      name: '张大爷',
      nickname: '爸爸',
      age: 75,
      deviceStatus: 'online',
      lastSeen: new Date(),
      location: '家中',
      healthStatus: 'normal',
      grandsonInteractions: [
        {
          id: '1',
          timestamp: new Date(Date.now() - 3600000),
          type: 'chat',
          content: '小智陪爷爷聊了会儿年轻时的故事',
          elderlyResponse: '爷爷很开心，讲了很多往事',
          duration: 20,
          emotionalState: 'happy'
        }
      ]
    };

    const mockUser: Guardian = {
      id: '1',
      name: '张小丽',
      phone: '13800138000',
      relationship: 'daughter'
    };

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'grandson_concern',
        severity: 'medium',
        title: '小智的观察报告',
        description: '小智发现爷爷今天情绪有些低落，可能是想您了',
        timestamp: new Date(Date.now() - 1800000),
        status: 'active',
        elderlyId: '1',
        grandsonMessage: '爷爷今天跟小智提到您好几次，要不要给他打个电话？',
        suggestedActions: [
          { label: '立即视频', action: 'video_call', icon: '📹' },
          { label: '发送留言', action: 'send_message', icon: '💌' }
        ]
      }
    ];

    const mockHealthData: HealthData[] = [
      {
        timestamp: new Date(),
        bloodPressure: { systolic: 130, diastolic: 85 },
        heartRate: 72,
        steps: 2856,
        sleep: { duration: 7.5, quality: 'good' },
        medicationTaken: true,
        grandsonHealthAdvice: '小智提醒：爷爷今天的健康状况良好，血压稳定'
      }
    ];

    const mockStats: DashboardStats = {
      parentStatus: {
        isOnline: true,
        lastActivity: new Date(),
        currentMood: '开心 - 刚和小智聊完天',
        grandsonCompanionTime: 45
      },
      healthSummary: {
        status: 'normal',
        latestMetrics: mockHealthData[0],
        trendsAnalysis: '最近一周血压稳定，睡眠质量改善'
      },
      todayInteractions: {
        callsMade: 0,
        messagesExchanged: 2,
        grandsonChats: 3
      },
      alerts: {
        unread: 1,
        critical: 0
      }
    };

    set({
      currentUser: mockUser,
      elderlyParents: [mockParent],
      selectedParent: mockParent,
      alerts: mockAlerts,
      healthHistory: mockHealthData,
      dashboardStats: mockStats,
      reminders: [
        {
          id: '1',
          type: 'medication',
          title: '降压药',
          description: '每日三次，饭后服用',
          time: '08:00',
          recurring: 'daily',
          elderlyId: '1',
          enabled: true,
          grandsonDeliveryMessage: '小智会温柔地提醒爷爷吃药'
        }
      ]
    });
  }
}));