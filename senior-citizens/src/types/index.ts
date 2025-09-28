// Core type definitions for the Senior Citizens App
// Barrel exports for all types

export interface User {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  age: number;
  preferences: UserPreferences;
  healthData: HealthData;
  familyMembers: FamilyMember[];
}

export interface UserPreferences {
  dialect?: 'mandarin' | 'cantonese' | 'sichuan' | 'northeast' | 'shanghai';
  interests: string[];
  favoriteMusic?: string[];
  dailyRoutine: {
    wakeTime: string;
    sleepTime: string;
    mealTimes: string[];
    medicationTimes: string[];
  };
}

export interface HealthData {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    timestamp: Date;
  };
  heartRate?: number;
  medications: Medication[];
  lastCheckup?: Date;
  emergencyContacts: EmergencyContact[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  purpose?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'son' | 'daughter' | 'grandson' | 'granddaughter' | 'other';
  phone: string;
  avatar?: string;
  lastContact?: Date;
}

export interface FamilyMessage {
  id: string;
  sender: string;
  senderRelationship: 'son' | 'daughter' | 'grandson' | 'granddaughter' | 'other';
  content: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

export interface AIGrandsonMessage {
  id: string;
  type: 'greeting' | 'reminder' | 'care' | 'chat' | 'story' | 'health' | 'family';
  content: string;
  emotion?: 'happy' | 'caring' | 'worried' | 'encouraging';
  timestamp: Date;
  isFromGrandson: boolean;
  actions?: MessageAction[];
}

export interface MessageAction {
  label: string;
  action: string;
  icon?: string;
}

export interface HealthReminder {
  id: string;
  type: 'medication' | 'checkup' | 'exercise' | 'water';
  title: string;
  description: string;
  time: string;
  completed: boolean;
  grandsonMessage?: string;
}

export interface EmergencyAlert {
  type: 'fall' | 'sos' | 'health';
  location?: string;
  timestamp: Date;
  status: 'pending' | 'notified' | 'resolved';
}

export type AppScreen = 'home' | 'chat' | 'health' | 'family' | 'call' | 'settings';

export interface AppState {
  currentUser: User | null;
  currentScreen: AppScreen;
  isListening: boolean;
  grandsonMood: 'happy' | 'caring' | 'worried' | 'encouraging';
  unreadMessages: number;
  activeCall?: FamilyMember;
}