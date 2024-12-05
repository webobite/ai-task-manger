export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  recurrence?: RecurrencePattern;
  projectId: string;
  parentTaskId?: string;
  status: 'todo' | 'in-progress' | 'hold' | 'blocked' | 'done';
  startDate?: Date;
  endDate?: Date;
}

export interface Project {
  id: string;
  name: string;
  isDefault?: boolean;
  createdAt: Date;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'custom';
  interval?: number;
  daysOfWeek?: number[];
}