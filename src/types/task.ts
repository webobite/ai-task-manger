export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  recurrence?: RecurrencePattern;
  notifications?: NotificationPreference[];
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'weekday' | 'weekend' | 'custom';
  interval?: number;
  daysOfWeek?: number[];
  time?: string;
}

export interface NotificationPreference {
  type: 'push' | 'email';
  timing: 'at-time' | 'before';
  minutes?: number;
  enabled: boolean;
}