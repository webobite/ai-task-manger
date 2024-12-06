import { create } from 'zustand';
import { Project } from '../types';
import { projectApi } from '../lib/api';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  loadProjects: async () => {
    try {
      set({ loading: true, error: null });
      const projects = await projectApi.getProjects();
      set({ projects, loading: false });
    } catch (error) {
      console.error('Error loading projects:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load projects',
        loading: false 
      });
    }
  },

  createProject: async (project) => {
    try {
      set({ loading: true, error: null });
      const newProject = await projectApi.createProject(project);
      set(state => ({ 
        projects: [...state.projects, newProject],
        loading: false 
      }));
    } catch (error) {
      console.error('Error creating project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create project',
        loading: false 
      });
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const updatedProject = await projectApi.updateProject(id, updates);
      set(state => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updatedProject } : p
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update project',
        loading: false 
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      set({ loading: true, error: null });
      await projectApi.deleteProject(id);
      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete project',
        loading: false 
      });
      throw error;
    }
  },
})); 