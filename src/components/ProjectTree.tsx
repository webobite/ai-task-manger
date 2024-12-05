import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Plus, X, Folder, FolderOpen } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types';
import { generateId } from '../lib/utils';
import { cn } from '../lib/utils';

interface ProjectNodeProps {
  project: Project;
  level?: number;
}

function ProjectNode({ project, level = 0 }: ProjectNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const navigate = useNavigate();
  const { projectId: currentProjectId } = useParams();

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  // Auto-expand if this project or its children are active
  React.useEffect(() => {
    if (currentProjectId === project.id || 
        project.children?.some(child => child.id === currentProjectId)) {
      setIsExpanded(true);
    }
  }, [currentProjectId, project]);

  return (
    <div>
      <div
        className={cn(
          "flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer",
          currentProjectId === project.id && "bg-indigo-50 text-indigo-600"
        )}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={handleClick}
      >
        {project.children && project.children.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-200 rounded mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}
        {isExpanded ? (
          <FolderOpen className="w-4 h-4 mr-2 text-gray-500" />
        ) : (
          <Folder className="w-4 h-4 mr-2 text-gray-500" />
        )}
        <span className="flex-1 truncate">{project.name}</span>
      </div>
      {isExpanded && project.children && (
        <div>
          {project.children.map((child) => (
            <ProjectNode
              key={child.id}
              project={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectTree() {
  const [showNewProjectModal, setShowNewProjectModal] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');
  const projects = useProjectStore((state) => state.projects);
  const addProject = useProjectStore((state) => state.addProject);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: generateId(),
        name: newProjectName.trim(),
        description: '',
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        children: []
      };
      
      addProject(newProject);
      setNewProjectName('');
      setShowNewProjectModal(false);
    }
  };

  return (
    <div className="py-4">
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Projects</h2>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectNode key={project.id} project={project} />
        ))}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold">New Project</h2>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
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