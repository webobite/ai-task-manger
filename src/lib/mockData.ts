import { Task, Project } from '../types/task';
import { generateId } from './utils';
import { addDays, subDays } from 'date-fns';

const MOCK_PROJECTS: Omit<Project, 'id'>[] = [
  { name: 'Personal Tasks', createdAt: new Date() },
  { name: 'Work Projects', createdAt: new Date() },
  { name: 'Shopping List', createdAt: new Date() },
  { name: 'Home Renovation', createdAt: new Date() },
];

const MOCK_TASKS: Omit<Task, 'id' | 'projectId'>[] = [
  {
    title: 'Buy groceries',
    description: 'Get weekly groceries from the supermarket',
    dueDate: addDays(new Date(), 1),
    completed: false,
    priority: 'medium',
    status: 'todo',
  },
  {
    title: 'Finish presentation',
    description: 'Complete the quarterly review presentation',
    dueDate: addDays(new Date(), 2),
    completed: false,
    priority: 'high',
    status: 'in-progress',
  },
  {
    title: 'Pay bills',
    description: 'Pay utility bills and rent',
    dueDate: subDays(new Date(), 1),
    completed: true,
    priority: 'high',
    status: 'done',
  },
  {
    title: 'Call plumber',
    description: 'Schedule maintenance for bathroom leak',
    dueDate: addDays(new Date(), 3),
    completed: false,
    priority: 'medium',
    status: 'blocked',
  },
];

const SUBTASKS: Omit<Task, 'id' | 'projectId' | 'parentTaskId'>[] = [
  {
    title: 'Fruits and vegetables',
    description: 'Get fresh produce',
    dueDate: addDays(new Date(), 1),
    completed: false,
    priority: 'low',
    status: 'todo',
  },
  {
    title: 'Prepare slides',
    description: 'Create initial slide deck',
    dueDate: addDays(new Date(), 1),
    completed: true,
    priority: 'medium',
    status: 'done',
  },
];

export function generateMockData() {
  const projects: Project[] = MOCK_PROJECTS.map(project => ({
    ...project,
    id: generateId(),
  }));

  const tasks: Task[] = [];
  
  // Generate main tasks for each project
  projects.forEach(project => {
    const projectTasks = MOCK_TASKS.map(task => ({
      ...task,
      id: generateId(),
      projectId: project.id,
    }));
    tasks.push(...projectTasks);

    // Add subtasks to the first task of each project
    if (projectTasks.length > 0) {
      const parentTask = projectTasks[0];
      const subTasks = SUBTASKS.map(subtask => ({
        ...subtask,
        id: generateId(),
        projectId: project.id,
        parentTaskId: parentTask.id,
      }));
      tasks.push(...subTasks);
    }
  });

  return { projects, tasks };
} 