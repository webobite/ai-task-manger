import { Task } from '../types/task';
import { addDays, addHours, subDays } from 'date-fns';

export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the Q2 project proposal for client review',
    dueDate: addHours(new Date(), 4),
    completed: false,
    priority: 'high',
    recurrence: {
      type: 'weekday',
      daysOfWeek: [1, 2, 3, 4, 5],
      time: '09:00'
    }
  },
  {
    id: 'task-2',
    title: 'Weekly Team Meeting',
    description: 'Discuss project progress and upcoming milestones',
    dueDate: addDays(new Date(), 1),
    completed: false,
    priority: 'medium',
    recurrence: {
      type: 'weekly',
      daysOfWeek: [2],
      time: '10:00'
    }
  },
  {
    id: 'task-3',
    title: 'Review Code Changes',
    description: 'Review and approve pending pull requests',
    dueDate: subDays(new Date(), 1),
    completed: true,
    priority: 'medium'
  },
  {
    id: 'task-4',
    title: 'Update Documentation',
    description: 'Update API documentation with recent changes',
    dueDate: addDays(new Date(), 2),
    completed: false,
    priority: 'low'
  },
  {
    id: 'task-5',
    title: 'Daily Standup',
    description: 'Daily team sync meeting',
    dueDate: addHours(new Date(), 1),
    completed: false,
    priority: 'medium',
    recurrence: {
      type: 'daily',
      interval: 1,
      time: '09:30'
    }
  },
  {
    id: 'task-6',
    title: 'System Backup',
    description: 'Perform weekly system backup',
    dueDate: addDays(new Date(), 3),
    completed: false,
    priority: 'high',
    recurrence: {
      type: 'weekly',
      daysOfWeek: [6],
      time: '23:00'
    }
  },
  {
    id: 'task-7',
    title: 'Client Meeting',
    description: 'Monthly progress review with client',
    dueDate: addDays(new Date(), 5),
    completed: false,
    priority: 'high'
  },
  {
    id: 'task-8',
    title: 'Update Dependencies',
    description: 'Review and update project dependencies',
    dueDate: subDays(new Date(), 2),
    completed: true,
    priority: 'low'
  },
  {
    id: 'task-9',
    title: 'Security Audit',
    description: 'Perform monthly security audit',
    dueDate: addDays(new Date(), 4),
    completed: false,
    priority: 'high',
    recurrence: {
      type: 'custom',
      daysOfWeek: [1, 15],
      time: '14:00'
    }
  },
  {
    id: 'task-10',
    title: 'Backup Verification',
    description: 'Verify integrity of backup data',
    dueDate: addDays(new Date(), 1),
    completed: false,
    priority: 'medium'
  },
  {
    id: 'task-11',
    title: 'Performance Review',
    description: 'Quarterly performance review meeting',
    dueDate: addDays(new Date(), 7),
    completed: false,
    priority: 'medium'
  },
  {
    id: 'task-12',
    title: 'Update Status Report',
    description: 'Update weekly status report',
    dueDate: addHours(new Date(), 6),
    completed: false,
    priority: 'low',
    recurrence: {
      type: 'weekly',
      daysOfWeek: [5],
      time: '16:00'
    }
  },
  {
    id: 'task-13',
    title: 'Code Review',
    description: 'Review team code submissions',
    dueDate: subDays(new Date(), 1),
    completed: true,
    priority: 'medium'
  },
  {
    id: 'task-14',
    title: 'Database Maintenance',
    description: 'Perform routine database maintenance',
    dueDate: addDays(new Date(), 2),
    completed: false,
    priority: 'high',
    recurrence: {
      type: 'weekend',
      daysOfWeek: [0, 6],
      time: '02:00'
    }
  },
  {
    id: 'task-15',
    title: 'Update Team Calendar',
    description: 'Update team calendar with upcoming events',
    dueDate: addHours(new Date(), 2),
    completed: false,
    priority: 'low'
  },
  {
    id: 'task-16',
    title: 'License Renewal',
    description: 'Renew software licenses',
    dueDate: addDays(new Date(), 10),
    completed: false,
    priority: 'high'
  },
  {
    id: 'task-17',
    title: 'Team Training',
    description: 'Conduct weekly team training session',
    dueDate: addDays(new Date(), 3),
    completed: false,
    priority: 'medium',
    recurrence: {
      type: 'weekly',
      daysOfWeek: [3],
      time: '15:00'
    }
  },
  {
    id: 'task-18',
    title: 'Infrastructure Review',
    description: 'Review and optimize infrastructure setup',
    dueDate: addDays(new Date(), 6),
    completed: false,
    priority: 'medium'
  },
  {
    id: 'task-19',
    title: 'Client Report',
    description: 'Prepare monthly client report',
    dueDate: addDays(new Date(), 8),
    completed: false,
    priority: 'high',
    recurrence: {
      type: 'custom',
      daysOfWeek: [25],
      time: '10:00'
    }
  },
  {
    id: 'task-20',
    title: 'Backup Review',
    description: 'Review backup logs and status',
    dueDate: subDays(new Date(), 3),
    completed: true,
    priority: 'low'
  }
];