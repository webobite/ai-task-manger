import { create } from 'zustand';
import { Project } from '../types/task';
import { generateId } from '../lib/utils';
import { generateMockData } from '../lib/mockData';
import { useTaskStore } from './taskStore';

interface ProjectStore {
  projects: Project[];
  activeProjectId: string;
  addProject: (name: string) => void;
  deleteProject: (id: string) => boolean;
  setActiveProject: (id: string) => void;
  initializeWithMockData: () => void;
}

const DEFAULT_PROJECT: Project = {
  id: 'default',
  name: 'Default Project',
  isDefault: true,
  createdAt: new Date(),
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [DEFAULT_PROJECT],
  activeProjectId: DEFAULT_PROJECT.id,

  addProject: (name: string) => {
    const newProject: Project = {
      id: generateId(),
      name,
      createdAt: new Date(),
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },

  deleteProject: (id: string) => {
    const { projects } = get();
    const project = projects.find((p) => p.id === id);
    
    if (!project || project.isDefault) {
      return false;
    }

    // Move all tasks from the deleted project to the default project
    const updateTask = useTaskStore.getState().updateTask;
    const tasks = useTaskStore.getState().tasks;
    
    tasks.forEach(task => {
      if (task.projectId === id) {
        updateTask(task.id, {
          ...task,
          projectId: DEFAULT_PROJECT.id
        });
      }
    });

    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProjectId: state.activeProjectId === id ? DEFAULT_PROJECT.id : state.activeProjectId,
    }));
    return true;
  },

  setActiveProject: (id: string) => {
    set({ activeProjectId: id });
  },

  initializeWithMockData: () => {
    const { projects, tasks } = generateMockData();
    const addTask = useTaskStore.getState().addTask;
    
    // Add mock projects
    set((state) => ({
      projects: [DEFAULT_PROJECT, ...projects],
    }));

    // Add mock tasks
    tasks.forEach(task => {
      addTask(task);
    });
  },
})); 