import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, FolderIcon } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { Project, Task } from '../types';
import { cn } from '../lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';

interface ProjectItemProps {
  project: Project;
  tasks: Task[];
  onProjectClick: (id: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

function ProjectItem({
  project,
  tasks,
  onProjectClick,
  onEditProject,
  onDeleteProject,
  isSelected,
  isExpanded,
  onToggleExpand,
}: ProjectItemProps) {
  const projectTasks = tasks.filter(task => task.projectId === project.id && !task.parentTaskId);

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer group",
          isSelected ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100"
        )}
      >
        <button
          onClick={() => onToggleExpand(project.id)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => onProjectClick(project.id)}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="flex-1">{project.name}</span>
          <span className="text-xs text-gray-500">{projectTasks.length}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditProject(project);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProject(project.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && projectTasks.length > 0 && (
        <div className="ml-6 space-y-1">
          {projectTasks.map(task => (
            <TaskItem key={task.id} task={task} tasks={tasks} level={0} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  tasks: Task[];
  level: number;
}

function TaskItem({ task, tasks, level }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const subtasks = tasks.filter(t => t.parentTaskId === task.id);
  const hasSubtasks = subtasks.length > 0;

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer",
          level > 0 && "ml-4"
        )}
      >
        {hasSubtasks && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        <span className={cn("flex-1 text-sm", task.completed && "line-through text-gray-500")}>
          {task.title}
        </span>
        {hasSubtasks && (
          <span className="text-xs text-gray-500">
            {subtasks.filter(st => st.completed).length}/{subtasks.length}
          </span>
        )}
      </div>

      {isExpanded && hasSubtasks && (
        <div className="ml-2">
          {subtasks.map(subtask => (
            <TaskItem key={subtask.id} task={subtask} tasks={tasks} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectTree() {
  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const addProject = useProjectStore((state) => state.addProject);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    navigate(`/dashboard?project=${projectId}`);
  };

  const handleEditProject = (project: Project) => {
    const newName = prompt('Enter new project name:', project.name);
    if (newName && newName !== project.name) {
      updateProject({ ...project, name: newName });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
        navigate('/dashboard');
      }
    }
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject({
        name: newProjectName.trim(),
        description: '',
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
      });
      setNewProjectName('');
      setShowNewProjectModal(false);
    }
  };

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-medium text-gray-500">Projects</h2>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            tasks={tasks}
            onProjectClick={handleProjectClick}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            isSelected={project.id === selectedProjectId}
            isExpanded={expandedProjects.has(project.id)}
            onToggleExpand={toggleProjectExpand}
          />
        ))}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter project name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 