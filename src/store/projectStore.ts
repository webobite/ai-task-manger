import { create } from 'zustand';
import { Project, Task } from '../types';
import { generateId } from '../lib/utils';
import { getMockProjects } from '../lib/mockData';
import { useTaskStore } from './taskStore';

interface ProjectStore {
  projects: Project[];
  selectedProjectId: string | null;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  moveTask: (taskId: string, targetProjectId: string) => void;
  loadProjects: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProjectId: null,

  loadProjects: () => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      set({ projects: JSON.parse(storedProjects) });
    } else {
      const mockProjects = getMockProjects();
      set({ projects: mockProjects });
    }
  },

  addProject: (projectData) => {
    const project: Project = {
      ...projectData,
      id: generateId(),
    };
    set((state) => ({
      projects: [...state.projects, project],
    }));
    localStorage.setItem('projects', JSON.stringify(get().projects));
  },

  updateProject: (project) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === project.id ? project : p
      ),
    }));
    localStorage.setItem('projects', JSON.stringify(get().projects));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
    }));
    localStorage.setItem('projects', JSON.stringify(get().projects));
  },

  selectProject: (id) => {
    set({ selectedProjectId: id });
  },

  moveTask: (taskId: string, targetProjectId: string) => {
    const { updateTask } = useTaskStore.getState();
    const task = useTaskStore.getState().tasks.find(t => t.id === taskId);
    
    if (task) {
      updateTask(taskId, { ...task, projectId: targetProjectId });
    }
  },
})); 