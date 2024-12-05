import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, FolderIcon } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { Project, Task } from '../types';
import { cn } from '../lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const selectProject = useProjectStore((state) => state.selectProject);
  const addProject = useProjectStore((state) => state.addProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const tasks = useTaskStore((state) => state.tasks);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject({
        name: newProjectName.trim(),
        description: '',
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
      });
      setNewProjectName('');
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

  const expandAll = () => {
    setExpandedProjects(new Set(projects.map(p => p.id)));
  };

  const collapseAll = () => {
    setExpandedProjects(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Projects</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Expand all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={collapseAll}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Collapse all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleAddProject} className="flex gap-2">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name..."
          className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          disabled={!newProjectName.trim()}
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            tasks={tasks}
            onProjectClick={selectProject}
            onEditProject={updateProject}
            onDeleteProject={deleteProject}
            isSelected={project.id === selectedProjectId}
            isExpanded={expandedProjects.has(project.id)}
            onToggleExpand={toggleProjectExpand}
          />
        ))}
      </div>
    </div>
  );
} 