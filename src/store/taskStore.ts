import { create } from 'zustand';
import { Task, TaskStatus } from '../types';
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
    console.log('🔄 Loading tasks...');
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      console.log('📥 Loaded tasks from storage:', parsedTasks);
      set({ tasks: parsedTasks });
    } else {
      const mockTasks = getMockTasks();
      console.log('📦 Using mock tasks:', mockTasks);
      set({ tasks: mockTasks });
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
  },

  addTask: (taskData) => {
    console.log('➕ Adding new task:', taskData);
    const task: Task = {
      ...taskData,
      id: generateId(),
    };
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      console.log('✅ Task added successfully:', task);
      return { tasks: newTasks };
    });
  },

  updateTask: (id, updates) => {
    console.log('🔄 TaskStore: Starting task update', { id, updates });
    
    try {
      set((state) => {
        const taskToUpdate = state.tasks.find(t => t.id === id);
        console.log('🔍 TaskStore: Found task to update:', taskToUpdate);

        if (!taskToUpdate) {
          console.error('❌ TaskStore: Task not found:', id);
          return state;
        }

        const updatedTasks = state.tasks.map((task) => {
          if (task.id === id) {
            const updatedTask = 'id' in updates ? updates : { ...task, ...updates };
            
            // Handle automatic date updates based on status changes
            if ('status' in updates) {
              const oldStatus = task.status;
              const newStatus = updates.status;
              
              // Set startDate when moving from todo to in-progress
              if (oldStatus === TaskStatus.Todo && newStatus === TaskStatus.InProgress) {
                console.log('📅 TaskStore: Setting startDate for task:', id);
                updatedTask.startDate = new Date().toISOString();
              }
              
              // Set endDate when moving to done or blocked
              if (newStatus === TaskStatus.Completed || newStatus === TaskStatus.Blocked) {
                console.log('📅 TaskStore: Setting endDate for task:', id);
                updatedTask.endDate = new Date().toISOString();
              }
              
              // Clear endDate if moving back to in-progress
              if ((oldStatus === TaskStatus.Completed || oldStatus === TaskStatus.Blocked) && 
                  newStatus === TaskStatus.InProgress) {
                console.log('🗑️ TaskStore: Clearing endDate for task:', id);
                updatedTask.endDate = undefined;
              }
            }
            
            console.log('✏️ TaskStore: Updated task:', updatedTask);
            return updatedTask as Task;
          }
          return task;
        });

        console.log('💾 TaskStore: Saving updated tasks to storage...');
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        console.log('✅ TaskStore: Task update complete');
        return { tasks: updatedTasks };
      });
    } catch (error) {
      console.error('❌ TaskStore: Error updating task:', error);
    }
  },

  deleteTask: (id) => {
    console.log('🗑️ Deleting task:', id);
    set((state) => {
      const filteredTasks = state.tasks.filter((task) => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
      console.log('✅ Task deleted successfully');
      return { tasks: filteredTasks };
    });
  },
}));