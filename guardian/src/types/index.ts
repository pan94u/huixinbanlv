// Guardian App Type Definitions
// Barrel exports for all types

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relationship: 'son' | 'daughter' | 'other';
  avatar?: string;
}

export interface ElderlyParent {
  id: string;
  name: string;
  nickname?: string;
  age: number;
  avatar?: string;
  deviceStatus: 'online' | 'offline' | 'sleeping';
  lastSeen: Date;
  location: string;
  healthStatus: 'normal' | 'attention' | 'warning';
  grandsonInteractions: GrandsonInteraction[];
}

export interface GrandsonInteraction {
  id: string;
  timestamp: Date;
  type: 'chat' | 'reminder' | 'health_check' | 'emergency';
  content: string;
  elderlyResponse?: string;
  duration?: number; // in minutes
  emotionalState?: 'happy' | 'worried' | 'lonely' | 'normal';
}

export interface HealthData {
  timestamp: Date;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  steps?: number;
  sleep?: {
    duration: number; // hours
    quality: 'good' | 'fair' | 'poor';
  };
  medicationTaken?: boolean;
  grandsonHealthAdvice?: string;
}

export interface Alert {
  id: string;
  type: 'emergency' | 'health' | 'activity' | 'device' | 'grandson_concern';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  elderlyId: string;
  grandsonMessage?: string;
  suggestedActions?: AlertAction[];
}

export interface AlertAction {
  label: string;
  action: string;
  icon?: string;
}

export interface Reminder {
  id: string;
  type: 'medication' | 'checkup' | 'exercise' | 'family_call';
  title: string;
  description: string;
  time: string;
  recurring?: 'daily' | 'weekly' | 'monthly';
  elderlyId: string;
  enabled: boolean;
  grandsonDeliveryMessage?: string;
}

export interface ServiceBooking {
  id: string;
  serviceType: 'nursing' | 'medication_delivery' | 'counseling' | 'companion';
  serviceName: string;
  price: number;
  scheduledTime: Date;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
  elderlyId: string;
  providerInfo?: {
    name: string;
    rating: number;
    reviews: number;
  };
}

export interface Message {
  id: string;
  type: 'voice' | 'text' | 'video';
  content: string;
  fromGuardian: boolean;
  timestamp: Date;
  read: boolean;
  grandsonRelayed?: boolean;
  grandsonResponse?: string;
}

export interface DashboardStats {
  parentStatus: {
    isOnline: boolean;
    lastActivity: Date;
    currentMood: string;
    grandsonCompanionTime: number; // minutes today
  };
  healthSummary: {
    status: 'normal' | 'attention' | 'warning';
    latestMetrics: HealthData;
    trendsAnalysis?: string;
  };
  todayInteractions: {
    callsMade: number;
    messagesExchanged: number;
    grandsonChats: number;
  };
  alerts: {
    unread: number;
    critical: number;
  };
}

export type AppScreen =
  | 'dashboard'
  | 'health'
  | 'alerts'
  | 'messages'
  | 'reminders'
  | 'services'
  | 'settings';