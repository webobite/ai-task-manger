import { create } from 'zustand';
import { Task, TaskStatus, TaskHistoryActionType, TaskHistoryEntry } from '../types';
import { generateId } from '../lib/utils';
import { getMockTasks } from '../lib/mockData';
import { useAuthStore } from './authStore';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
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
    const taskId = generateId();
    const user = useAuthStore.getState().user;

    const task: Task = {
      ...taskData,
      id: taskId,
      history: [{
        id: generateId(),
        taskId,
        actionType: TaskHistoryActionType.Created,
        timestamp: new Date().toISOString(),
        changes: {
          field: 'task',
          newValue: {
            title: taskData.title,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate
          }
        },
        userId: user?.id || 'system',
        userName: user?.name || 'System'
      }]
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
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    try {
      set((state) => {
        const taskToUpdate = state.tasks.find(t => t.id === id);
        if (!taskToUpdate) {
          console.error('❌ TaskStore: Task not found:', id);
          return state;
        }

        const newHistory = [...(taskToUpdate.history || [])];

        // Handle subtasks changes
        if ('subtasks' in updates && updates.subtasks) {
          const oldSubtasks = new Set(taskToUpdate.subtasks.map(s => s.id));
          const newSubtasks = new Set(updates.subtasks.map(s => s.id));

          // Find added subtasks
          const addedSubtasks = updates.subtasks.filter(s => !oldSubtasks.has(s.id));
          addedSubtasks.forEach(subtask => {
            newHistory.push({
              id: generateId(),
              taskId: id,
              actionType: TaskHistoryActionType.SubtaskAdded,
              timestamp: new Date().toISOString(),
              changes: {
                field: 'Subtask',
                newValue: subtask.title
              },
              userId: user.id,
              userName: user.name
            });
          });

          // Find removed subtasks
          const removedSubtasks = taskToUpdate.subtasks.filter(s => !newSubtasks.has(s.id));
          removedSubtasks.forEach(subtask => {
            newHistory.push({
              id: generateId(),
              taskId: id,
              actionType: TaskHistoryActionType.SubtaskRemoved,
              timestamp: new Date().toISOString(),
              changes: {
                field: 'Subtask',
                oldValue: subtask.title
              },
              userId: user.id,
              userName: user.name
            });
          });

          // Find modified subtasks (completion status)
          const commonSubtasks = taskToUpdate.subtasks.filter(s => newSubtasks.has(s.id));
          commonSubtasks.forEach(oldSubtask => {
            const newSubtask = updates.subtasks.find(s => s.id === oldSubtask.id);
            if (newSubtask && oldSubtask.completed !== newSubtask.completed) {
              newHistory.push({
                id: generateId(),
                taskId: id,
                actionType: TaskHistoryActionType.SubtaskCompleted,
                timestamp: new Date().toISOString(),
                changes: {
                  field: 'Subtask',
                  oldValue: oldSubtask.title,
                  newValue: newSubtask.completed ? 'completed' : 'uncompleted'
                },
                userId: user.id,
                userName: user.name
              });
            }
          });
        }

        // Handle status change
        if ('status' in updates && updates.status !== taskToUpdate.status) {
          newHistory.push({
            id: generateId(),
            taskId: id,
            actionType: TaskHistoryActionType.StatusChanged,
            timestamp: new Date().toISOString(),
            changes: {
              field: 'Status',
              oldValue: taskToUpdate.status,
              newValue: updates.status
            },
            userId: user.id,
            userName: user.name
          });

          // Add start date when moving to InProgress
          if (taskToUpdate.status === TaskStatus.Todo && updates.status === TaskStatus.InProgress) {
            updates.startDate = new Date().toISOString();
            newHistory.push({
              id: generateId(),
              taskId: id,
              actionType: TaskHistoryActionType.Updated,
              timestamp: new Date().toISOString(),
              changes: {
                field: 'Start Date',
                oldValue: null,
                newValue: updates.startDate
              },
              userId: user.id,
              userName: user.name
            });
          }

          // Add end date when completing or blocking
          if (updates.status === TaskStatus.Completed || updates.status === TaskStatus.Blocked) {
            updates.endDate = new Date().toISOString();
            newHistory.push({
              id: generateId(),
              taskId: id,
              actionType: TaskHistoryActionType.Updated,
              timestamp: new Date().toISOString(),
              changes: {
                field: 'End Date',
                oldValue: taskToUpdate.endDate,
                newValue: updates.endDate
              },
              userId: user.id,
              userName: user.name
            });
          }
        }

        // Handle title change
        if ('title' in updates && updates.title !== taskToUpdate.title) {
          newHistory.push({
            id: generateId(),
            taskId: id,
            actionType: TaskHistoryActionType.Updated,
            timestamp: new Date().toISOString(),
            changes: {
              field: 'Title',
              oldValue: taskToUpdate.title,
              newValue: updates.title
            },
            userId: user.id,
            userName: user.name
          });
        }

        // Handle description change
        if ('description' in updates && updates.description !== taskToUpdate.description) {
          newHistory.push({
            id: generateId(),
            taskId: id,
            actionType: TaskHistoryActionType.Updated,
            timestamp: new Date().toISOString(),
            changes: {
              field: 'Description',
              oldValue: taskToUpdate.description,
              newValue: updates.description
            },
            userId: user.id,
            userName: user.name
          });
        }

        // Handle priority change
        if ('priority' in updates && updates.priority !== taskToUpdate.priority) {
          newHistory.push({
            id: generateId(),
            taskId: id,
            actionType: TaskHistoryActionType.PriorityChanged,
            timestamp: new Date().toISOString(),
            changes: {
              field: 'Priority',
              oldValue: taskToUpdate.priority,
              newValue: updates.priority
            },
            userId: user.id,
            userName: user.name
          });
        }

        // Handle due date change
        if ('dueDate' in updates && updates.dueDate !== taskToUpdate.dueDate) {
          newHistory.push({
            id: generateId(),
            taskId: id,
            actionType: TaskHistoryActionType.DueDateChanged,
            timestamp: new Date().toISOString(),
            changes: {
              field: 'Due Date',
              oldValue: taskToUpdate.dueDate,
              newValue: updates.dueDate
            },
            userId: user.id,
            userName: user.name
          });
        }

        // Create updated task with new history
        const updatedTask = {
          ...taskToUpdate,
          ...updates,
          history: newHistory
        };

        const updatedTasks = state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        );

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