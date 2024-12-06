import { create } from 'zustand';
import { Task, TaskStatus } from '../types';
import { getMockTasks } from '../lib/mockData';

interface TaskStore {
  tasks: Task[];
  loadTasks: () => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  loadTasks: () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (user?.email === 'demo@example.com') {
      // Load mock data for demo account
      const storedTasks = localStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : getMockTasks();
      set({ tasks });
    } else {
      // For other users, load from localStorage without mock data fallback
      const storedTasks = localStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      set({ tasks });
    }
  },

  addTask: (task) => {
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
}));