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
    const storedProjects = localStorage.getItem('projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : getMockProjects();
    set({ projects });
  },

  loadTasks: () => {
    const storedTasks = localStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : getMockTasks();
    set({ tasks });
  },

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === project.id ? project : p
      ),
    })),

  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('projects');
    localStorage.removeItem('tasks');
    set({ user: null, projects: [], tasks: [] });
  },
})); 