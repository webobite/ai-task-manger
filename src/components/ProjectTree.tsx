import React, { useState, useEffect } from 'react';
import { Folder, FolderPlus, File, ChevronDown, ChevronRight, X, Pencil, ChevronUp } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { cn } from '../lib/utils';

interface ProjectTreeProps {
  onEditTask: (task: Task) => void;
}

export function ProjectTree({ onEditTask }: ProjectTreeProps) {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const { projects, addProject, deleteProject, activeProjectId, setActiveProject } = useProjectStore();
  const tasks = useTaskStore((state) => state.tasks);

  // Initialize expanded state for all projects and tasks
  useEffect(() => {
    const initialProjectState: Record<string, boolean> = {};
    projects.forEach(project => {
      initialProjectState[project.id] = true;
    });
    setExpandedProjects(initialProjectState);

    const initialTaskState: Record<string, boolean> = {};
    tasks.forEach(task => {
      if (tasks.some(t => t.parentTaskId === task.id)) {
        initialTaskState[task.id] = true;
      }
    });
    setExpandedTasks(initialTaskState);
  }, []);

  const getProjectTasks = (projectId: string): Task[] => {
    return tasks.filter(task => task.projectId === projectId && !task.parentTaskId);
  };

  const getSubTasks = (parentTaskId: string): Task[] => {
    return tasks.filter(task => task.parentTaskId === parentTaskId);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setExpandedProjects(prev => ({
        ...prev
      }));
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  const toggleProjectExpanded = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleTaskExpanded = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleEditTask = (task: Task) => {
    onEditTask(task);
    setSelectedTask(null);
  };

  const expandAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Expand all projects
    const newProjectState: Record<string, boolean> = {};
    projects.forEach(project => {
      newProjectState[project.id] = true;
    });
    setExpandedProjects(newProjectState);

    // Expand all tasks that have subtasks
    const newTaskState: Record<string, boolean> = {};
    tasks.forEach(task => {
      if (tasks.some(t => t.parentTaskId === task.id)) {
        newTaskState[task.id] = true;
      }
    });
    setExpandedTasks(newTaskState);
  };

  const collapseAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProjects({});
    setExpandedTasks({});
  };

  const renderTaskTree = (task: Task, level: number = 0) => {
    const subTasks = getSubTasks(task.id);
    const hasSubTasks = subTasks.length > 0;
    const isExpanded = expandedTasks[task.id] ?? false;
    const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

    return (
      <div key={task.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center gap-1 py-1 group">
          {hasSubTasks && (
            <button
              onClick={(e) => toggleTaskExpanded(e, task.id)}
              className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          <div 
            onClick={() => setSelectedTask(task)}
            className={cn(
              "flex items-center gap-2 flex-1 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-50",
              task.completed ? 'text-gray-400' : ''
            )}
          >
            <File className={cn(
              "w-4 h-4",
              isOverdue ? "text-red-500" : "text-gray-500"
            )} />
            <span className={task.completed ? 'line-through' : ''}>
              {task.title}
            </span>
            <span className={cn(
              "ml-auto text-xs px-1.5 py-0.5 rounded-full",
              task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            )}>
              {task.priority.charAt(0).toUpperCase()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditTask(task);
              }}
              className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              title="Edit task"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
        {isExpanded && hasSubTasks && (
          <div className="mt-1">
            {subTasks.map(subTask => renderTaskTree(subTask, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="font-medium text-gray-900">Projects</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="Expand all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={collapseAll}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="Collapse all"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAddingProject(true)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            title="Add new project"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isAddingProject && (
        <form onSubmit={handleAddProject} className="px-2">
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-0.5">
        {projects.map((project) => {
          const projectTasks = getProjectTasks(project.id);
          const isExpanded = expandedProjects[project.id] ?? false;

          return (
            <div key={project.id} className="group">
              <div
                className={cn(
                  "flex items-center gap-1 p-2 cursor-pointer rounded-md transition-colors",
                  activeProjectId === project.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                )}
                onClick={() => setActiveProject(project.id)}
              >
                <button
                  onClick={(e) => toggleProjectExpanded(e, project.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <Folder className={cn(
                  "w-4 h-4",
                  activeProjectId === project.id ? 'text-indigo-500' : 'text-gray-500'
                )} />
                <span className="flex-1 text-sm font-medium">{project.name}</span>
                {!project.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete project"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isExpanded && projectTasks.length > 0 && (
                <div className="mt-1 ml-3">
                  {projectTasks.map(task => renderTaskTree(task))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 