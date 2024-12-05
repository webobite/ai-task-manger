import { Project, Task, TaskStatus, TaskPriority } from '../types';
import { addDays, subDays } from 'date-fns';

export const getMockProjects = (): Project[] => [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    color: '#3B82F6' // blue
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'New mobile app for customer engagement',
    color: '#10B981' // green
  },
  {
    id: 'p3',
    name: 'Marketing Campaign',
    description: 'Q2 2024 marketing initiatives',
    color: '#F59E0B' // yellow
  },
  {
    id: 'p4',
    name: 'Product Launch',
    description: 'New product line launch preparation',
    color: '#EF4444' // red
  },
  {
    id: 'p5',
    name: 'Internal Tools',
    description: 'Development of internal productivity tools',
    color: '#8B5CF6' // purple
  }
];

export const getMockTasks = (): Task[] => {
  const today = new Date();
  
  return [
    // Website Redesign Tasks
    {
      id: 't1',
      title: 'Design System Creation',
      description: 'Create a comprehensive design system including color palette, typography, and components',
      projectId: 'p1',
      status: TaskStatus.InProgress,
      priority: TaskPriority.High,
      dueDate: addDays(today, 5).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st1', title: 'Color Palette Definition', completed: true },
        { id: 'st2', title: 'Typography Guidelines', completed: true },
        { id: 'st3', title: 'Component Library', completed: false }
      ]
    },
    {
      id: 't2',
      title: 'Homepage Redesign',
      description: 'Implement new homepage design with improved UX',
      projectId: 'p1',
      status: TaskStatus.Todo,
      priority: TaskPriority.High,
      dueDate: addDays(today, 10).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st4', title: 'Hero Section', completed: false },
        { id: 'st5', title: 'Feature Showcase', completed: false }
      ]
    },
    {
      id: 't3',
      title: 'Responsive Testing',
      description: 'Test website across different devices and screen sizes',
      projectId: 'p1',
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      dueDate: addDays(today, 15).toISOString(),
      completed: false,
      subtasks: []
    },

    // Mobile App Tasks
    {
      id: 't4',
      title: 'User Authentication',
      description: 'Implement secure user authentication system',
      projectId: 'p2',
      status: TaskStatus.InProgress,
      priority: TaskPriority.High,
      dueDate: addDays(today, 3).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st6', title: 'Login Screen', completed: true },
        { id: 'st7', title: 'Password Reset', completed: false }
      ]
    },
    {
      id: 't5',
      title: 'Push Notifications',
      description: 'Set up push notification system',
      projectId: 'p2',
      status: TaskStatus.Blocked,
      priority: TaskPriority.Medium,
      dueDate: addDays(today, 7).toISOString(),
      completed: false,
      subtasks: []
    },

    // Marketing Campaign Tasks
    {
      id: 't6',
      title: 'Social Media Strategy',
      description: 'Develop comprehensive social media strategy',
      projectId: 'p3',
      status: TaskStatus.InProgress,
      priority: TaskPriority.High,
      dueDate: addDays(today, 2).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st8', title: 'Content Calendar', completed: true },
        { id: 'st9', title: 'Platform Selection', completed: true }
      ]
    },
    {
      id: 't7',
      title: 'Email Campaign',
      description: 'Design and implement email marketing campaign',
      projectId: 'p3',
      status: TaskStatus.OnHold,
      priority: TaskPriority.Medium,
      dueDate: addDays(today, 8).toISOString(),
      completed: false,
      subtasks: []
    },

    // Product Launch Tasks
    {
      id: 't8',
      title: 'Market Research',
      description: 'Conduct market research for target audience',
      projectId: 'p4',
      status: TaskStatus.Completed,
      priority: TaskPriority.High,
      dueDate: subDays(today, 5).toISOString(),
      completed: true,
      subtasks: [
        { id: 'st10', title: 'Competitor Analysis', completed: true },
        { id: 'st11', title: 'Customer Surveys', completed: true }
      ]
    },
    {
      id: 't9',
      title: 'Launch Event Planning',
      description: 'Plan and organize product launch event',
      projectId: 'p4',
      status: TaskStatus.InProgress,
      priority: TaskPriority.High,
      dueDate: addDays(today, 20).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st12', title: 'Venue Selection', completed: true },
        { id: 'st13', title: 'Guest List', completed: false },
        { id: 'st14', title: 'Event Schedule', completed: false }
      ]
    },

    // Internal Tools Tasks
    {
      id: 't10',
      title: 'Task Management System',
      description: 'Develop internal task management system',
      projectId: 'p5',
      status: TaskStatus.InProgress,
      priority: TaskPriority.Medium,
      dueDate: addDays(today, 12).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st15', title: 'Database Design', completed: true },
        { id: 'st16', title: 'API Development', completed: false }
      ]
    },
    {
      id: 't11',
      title: 'Analytics Dashboard',
      description: 'Create analytics dashboard for team metrics',
      projectId: 'p5',
      status: TaskStatus.Todo,
      priority: TaskPriority.Low,
      dueDate: addDays(today, 25).toISOString(),
      completed: false,
      subtasks: []
    },
    {
      id: 't12',
      title: 'Documentation',
      description: 'Write comprehensive documentation for internal tools',
      projectId: 'p5',
      status: TaskStatus.Todo,
      priority: TaskPriority.Low,
      dueDate: addDays(today, 30).toISOString(),
      completed: false,
      subtasks: [
        { id: 'st17', title: 'User Guide', completed: false },
        { id: 'st18', title: 'API Documentation', completed: false },
        { id: 'st19', title: 'System Architecture', completed: false }
      ]
    }
  ];
};

export const getMockUser = () => ({
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
});

// Store mock data in localStorage
export const initializeMockData = () => {
  const projects = getMockProjects();
  const tasks = getMockTasks();
  
  localStorage.setItem('projects', JSON.stringify(projects));
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add new mock data
export const addMockProject = (project: Project) => {
  const projects = getMockProjects();
  projects.push(project);
  localStorage.setItem('projects', JSON.stringify(projects));
};

export const addMockTask = (task: Task) => {
  const tasks = getMockTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Update mock data
export const updateMockProject = (project: Project) => {
  const projects = getMockProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index !== -1) {
    projects[index] = project;
    localStorage.setItem('projects', JSON.stringify(projects));
  }
};

export const updateMockTask = (task: Task) => {
  const tasks = getMockTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks[index] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

// Delete mock data
export const deleteMockProject = (projectId: string) => {
  const projects = getMockProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  localStorage.setItem('projects', JSON.stringify(filtered));
};

export const deleteMockTask = (taskId: string) => {
  const tasks = getMockTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(filtered));
}; 