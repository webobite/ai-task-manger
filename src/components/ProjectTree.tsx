import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  FolderPlus, 
  Loader2, 
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface ProjectNodeProps {
  project: Project;
  level: number;
  onCreateSubproject: (parentId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

function ProjectNode({ 
  project, 
  level, 
  onCreateSubproject, 
  onEditProject,
  onDeleteProject,
}: ProjectNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === `/projects/${project.id}`;
  const menuRef = React.useRef<HTMLDivElement>(null);

  const hasChildren = project.children && project.children.length > 0;
  const paddingLeft = `${level * 1.5}rem`;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 hover:bg-gray-100 rounded-lg transition-colors group",
          isActive && "bg-indigo-50 text-indigo-600"
        )}
        style={{ paddingLeft }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}

        <Link
          to={`/projects/${project.id}`}
          className="flex-1 truncate ml-2"
        >
          {project.name}
        </Link>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCreateSubproject(project.id)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Add subproject"
          >
            <FolderPlus className="w-4 h-4" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-200 rounded"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border">
                <button
                  onClick={() => {
                    onEditProject(project);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit project
                </button>
                <button
                  onClick={() => {
                    onDeleteProject(project.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {project.children.map((child) => (
            <ProjectNode
              key={child.id}
              project={child}
              level={level + 1}
              onCreateSubproject={onCreateSubproject}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectTree() {
  const { projects, loading, error, loadProjects, createProject, updateProject, deleteProject } = useProjectStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectColor, setProjectColor] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
        color: projectColor || undefined,
        parentId: parentId || undefined,
      });
      resetForm();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleEditProject = async () => {
    if (!editingProject || !projectName.trim()) return;

    try {
      await updateProject(editingProject.id, {
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
        color: projectColor || undefined,
      });
      resetForm();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectColor('');
    setParentId(null);
    setIsCreating(false);
    setIsEditing(false);
    setEditingProject(null);
  };

  const startEditingProject = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setProjectColor(project.color || '');
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error loading projects:</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => loadProjects()}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 mb-4">
        <h2 className="text-sm font-semibold text-gray-600">Projects</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Add project"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {(isCreating || isEditing) && (
        <div className="p-2 space-y-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="w-full px-2 py-1 text-sm border rounded"
            autoFocus
          />
          <input
            type="text"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-2 py-1 text-sm border rounded"
          />
          <input
            type="text"
            value={projectColor}
            onChange={(e) => setProjectColor(e.target.value)}
            placeholder="Color (optional)"
            className="w-full px-2 py-1 text-sm border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={resetForm}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={isEditing ? handleEditProject : handleCreateProject}
              className="px-2 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectNode
            key={project.id}
            project={project}
            level={0}
            onCreateSubproject={(id) => {
              setParentId(id);
              setIsCreating(true);
            }}
            onEditProject={startEditingProject}
            onDeleteProject={handleDeleteProject}
          />
        ))}
      </div>
    </div>
  );
} 