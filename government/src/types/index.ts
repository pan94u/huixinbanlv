export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  department?: string;
  email?: string;
  phone?: string;
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  NURSE = 'nurse',
  DOCTOR = 'doctor',
  SOCIAL_WORKER = 'social_worker'
}

export interface Elderly {
  id: string;
  name: string;
  age: number;
  roomNumber: string;
  healthStatus: HealthStatus;
  deviceStatus: DeviceStatus;
  lastActivity: string;
  avatar?: string;
  guardian?: string;
  guardianPhone?: string;
  medicalHistory?: string[];
  medications?: string[];
}

export enum HealthStatus {
  NORMAL = 'normal',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  LOW_BATTERY = 'low_battery'
}

export interface Alert {
  id: string;
  type: AlertType;
  level: AlertLevel;
  elderlyId: string;
  elderlyName: string;
  location: string;
  message: string;
  timestamp: string;
  status: AlertStatus;
  handler?: string;
  handledAt?: string;
}

export enum AlertType {
  FALL = 'fall',
  BLOOD_PRESSURE = 'blood_pressure',
  HEART_RATE = 'heart_rate',
  MEDICATION = 'medication',
  DEVICE = 'device',
  EMOTION = 'emotion',
  SLEEP = 'sleep'
}

export enum AlertLevel {
  EMERGENCY = 'emergency',
  WARNING = 'warning',
  INFO = 'info'
}

export enum AlertStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  serviceType: ServiceType;
  elderlyId: string;
  elderlyName: string;
  appointmentTime: string;
  status: OrderStatus;
  assignee?: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
  rating?: number;
}

export enum ServiceType {
  HOME_CARE = 'home_care',
  MEDICATION_DELIVERY = 'medication_delivery',
  MEDICAL_ESCORT = 'medical_escort',
  PSYCHOLOGICAL_COUNSELING = 'psychological_counseling',
  REHABILITATION = 'rehabilitation'
}

export enum OrderStatus {
  PENDING_CONFIRMATION = 'pending_confirmation',
  PENDING_ASSIGNMENT = 'pending_assignment',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Staff {
  id: string;
  name: string;
  department: string;
  position: string;
  status: StaffStatus;
  taskCount: number;
  avatar?: string;
  phone?: string;
  email?: string;
  rating?: number;
}

export enum StaffStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy'
}

export interface DashboardSummary {
  totalElderly: number;
  todayAlerts: number;
  pendingOrders: number;
  deviceOnlineRate: number;
  healthTrends: {
    bloodPressure: ChartDataPoint[];
    heartRate: ChartDataPoint[];
    activity: ChartDataPoint[];
  };
  alertDistribution: {
    emergency: number;
    warning: number;
    info: number;
  };
}

export interface ChartDataPoint {
  date: string;
  value: number;
  category?: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  elderlyId?: string;
  elderlyName?: string;
  status: RoomStatus;
}

export enum RoomStatus {
  NORMAL = 'normal',
  WARNING = 'warning',
  EMERGENCY = 'emergency',
  EMPTY = 'empty'
}