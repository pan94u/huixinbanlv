import { create } from 'zustand';
import type { User, AppScreen, FamilyMember, AIGrandsonMessage, HealthReminder } from '../types/index';

interface AppStore {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;

  // AI Grandson state
  grandsonMood: 'happy' | 'caring' | 'worried' | 'encouraging';
  setGrandsonMood: (mood: 'happy' | 'caring' | 'worried' | 'encouraging') => void;

  // Messages
  messages: AIGrandsonMessage[];
  addMessage: (message: AIGrandsonMessage) => void;
  clearMessages: () => void;

  // Voice interaction
  isListening: boolean;
  setIsListening: (listening: boolean) => void;

  // Call state
  activeCall: FamilyMember | null;
  setActiveCall: (member: FamilyMember | null) => void;

  // Health reminders
  reminders: HealthReminder[];
  addReminder: (reminder: HealthReminder) => void;
  completeReminder: (id: string) => void;

  // Emergency state
  emergencyMode: boolean;
  setEmergencyMode: (mode: boolean) => void;

  // Initialization
  initializeApp: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  currentUser: null,
  currentScreen: 'home',
  grandsonMood: 'happy',
  messages: [],
  isListening: false,
  activeCall: null,
  reminders: [],
  emergencyMode: false,

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setGrandsonMood: (mood) => set({ grandsonMood: mood }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  clearMessages: () => set({ messages: [] }),

  setIsListening: (listening) => set({ isListening: listening }),

  setActiveCall: (member) => set({ activeCall: member }),

  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder]
  })),

  completeReminder: (id) => set((state) => ({
    reminders: state.reminders.map(r =>
      r.id === id ? { ...r, completed: true } : r
    )
  })),

  setEmergencyMode: (mode) => set({ emergencyMode: mode }),

  initializeApp: () => {
    // Initialize with mock user for demo
    const mockUser: User = {
      id: '1',
      name: '张大爷',
      age: 75,
      preferences: {
        dialect: 'mandarin',
        interests: ['京剧', '象棋', '散步'],
        favoriteMusic: ['经典老歌', '戏曲'],
        dailyRoutine: {
          wakeTime: '06:00',
          sleepTime: '22:00',
          mealTimes: ['07:00', '12:00', '18:00'],
          medicationTimes: ['08:00', '14:00', '20:00']
        }
      },
      healthData: {
        bloodPressure: {
          systolic: 130,
          diastolic: 85,
          timestamp: new Date()
        },
        heartRate: 72,
        medications: [
          {
            name: '降压药',
            dosage: '1片',
            frequency: '每日3次',
            times: ['08:00', '14:00', '20:00'],
            purpose: '控制血压'
          }
        ],
        emergencyContacts: [
          {
            name: '张小丽',
            phone: '13800138000',
            relationship: '女儿',
            priority: 1
          }
        ]
      },
      familyMembers: [
        {
          id: '2',
          name: '张小丽',
          relationship: 'daughter',
          phone: '13800138000',
          lastContact: new Date(Date.now() - 86400000)
        },
        {
          id: '3',
          name: '张小明',
          relationship: 'son',
          phone: '13900139000',
          lastContact: new Date(Date.now() - 172800000)
        }
      ]
    };

    // Initialize sample reminders
    const sampleReminders: HealthReminder[] = [
      {
        id: '1',
        type: 'medication',
        title: '降压药',
        description: '每日3次，饭后服用',
        time: '08:00',
        completed: false,
        grandsonMessage: '爷爷，该吃降压药了，小智给您准备了温开水！'
      },
      {
        id: '2',
        type: 'checkup',
        title: '血压测量',
        description: '每日早晚各一次',
        time: '09:00',
        completed: false,
        grandsonMessage: '爷爷，测量一下血压吧，小智帮您记录！'
      }
    ];

    set({
      currentUser: mockUser,
      reminders: sampleReminders
    });
  }
}));