import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Task) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  addTask: (task: Task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTask: (id: string, task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? task : t)),
    }));
  },

  deleteTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  toggleComplete: (id: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },
}));