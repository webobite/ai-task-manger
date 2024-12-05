import { create } from 'zustand';
import { Task, TaskStatus, Project } from '../types';
import { getMockProjects, getMockTasks } from '../lib/mockData';

interface User {
  id: number;
  email: string;
  name: string;
}

interface ProjectStore {
  projects: Project[];
  tasks: Task[];
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  logout: () => void;
  loadProjects: () => void;
  loadTasks: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  tasks: [],
  user: (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  })(),

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  loadProjects: () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (user?.email === 'demo@example.com') {
      // Load mock data for demo account
      const storedProjects = localStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : getMockProjects();
      set({ projects });
    } else {
      // For other users, load from localStorage without mock data fallback
      const storedProjects = localStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];
      set({ projects });
    }
  },

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

  addProject: (project) => {
    set((state) => {
      const newProjects = [...state.projects, project];
      localStorage.setItem('projects', JSON.stringify(newProjects));
      return { projects: newProjects };
    });
  },

  updateProject: (project) =>
    set((state) => {
      const newProjects = state.projects.map((p) =>
        p.id === project.id ? project : p
      );
      localStorage.setItem('projects', JSON.stringify(newProjects));
      return { projects: newProjects };
    }),

  deleteProject: (projectId) =>
    set((state) => {
      const newProjects = state.projects.filter((p) => p.id !== projectId);
      localStorage.setItem('projects', JSON.stringify(newProjects));
      return { projects: newProjects };
    }),

  addTask: (task) =>
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    }),

  updateTask: (task) =>
    set((state) => {
      const newTasks = state.tasks.map((t) => (t.id === task.id ? task : t));
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    }),

  deleteTask: (taskId) =>
    set((state) => {
      const newTasks = state.tasks.filter((t) => t.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    }),

  updateTaskStatus: (taskId, status) =>
    set((state) => {
      const newTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      );
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    }),

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('projects');
    localStorage.removeItem('tasks');
    set({ user: null, projects: [], tasks: [] });
  },
})); 