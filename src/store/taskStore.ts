import { create } from 'zustand';
import { Task } from '../types';
import { generateId } from '../lib/utils';
import { getMockTasks } from '../lib/mockData';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task> | Task) => void;
  deleteTask: (id: string) => void;
  loadTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  loadTasks: () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      set({ tasks: JSON.parse(storedTasks) });
    } else {
      const mockTasks = getMockTasks();
      set({ tasks: mockTasks });
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
  },

  addTask: (taskData) => {
    const task: Task = {
      ...taskData,
      id: generateId(),
    };
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },

  updateTask: (id, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === id
          ? 'id' in updates
            ? updates as Task
            : { ...task, ...updates }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const filteredTasks = state.tasks.filter((task) => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
      return { tasks: filteredTasks };
    });
  },
}));