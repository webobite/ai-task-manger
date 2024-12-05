import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart2, Settings, Plus } from 'lucide-react';
import { ProjectTree } from '../ProjectTree';
import { TaskForm } from '../TaskForm';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo and app name */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Task Manager</h1>
        </div>

        {/* New Task Button */}
        <div className="p-4">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
              isActive('/dashboard')
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/dashboard/tasks"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
              isActive('/dashboard/tasks')
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <ListTodo className="w-5 h-5" />
            Tasks
          </Link>
          <Link
            to="/dashboard/analytics"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
              isActive('/dashboard/analytics')
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <BarChart2 className="w-5 h-5" />
            Analytics
          </Link>
          <Link
            to="/dashboard/settings"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
              isActive('/dashboard/settings')
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        {/* Projects Section */}
        <div className="flex-1 px-2 py-4 border-t border-gray-200">
          <ProjectTree />
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>
              <TaskForm
                onClose={() => setShowNewTaskModal(false)}
                onSubmit={() => setShowNewTaskModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}