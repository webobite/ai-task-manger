import { DraggableLocation } from '@hello-pangea/dnd';

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Completed = 'Completed',
  OnHold = 'OnHold',
  Blocked = 'Blocked'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum RecurrenceType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  endDate?: string;
  daysOfWeek?: number[]; // For weekly recurrence (0 = Sunday, 6 = Saturday)
  dayOfMonth?: number; // For monthly recurrence
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  subtasks: Subtask[];
  parentTaskId?: string;
  recurrence?: RecurrencePattern;
  startDate?: string;
  endDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: DraggableLocation;
  destination: DraggableLocation | null;
  reason: 'DROP' | 'CANCEL';
  mode: 'FLUID' | 'SNAP';
} 