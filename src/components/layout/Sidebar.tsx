import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart2, Settings, Plus } from 'lucide-react';
import { ProjectTree } from '../ProjectTree';
import { TaskForm } from '../TaskForm';
import { cn } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import { Task } from '../../types';

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const location = useLocation();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  const handleTaskSubmit = (task: Task | Omit<Task, 'id'>) => {
    console.log('🎯 Sidebar: Handling task submission', task);
    addTask(task as Omit<Task, 'id'>);
    setShowNewTaskModal(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <div className="h-screen bg-white border-r border-gray-200 flex flex-col">
        {/* Logo and app name */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <h1 className={cn(
            "font-semibold text-gray-800 transition-all duration-300",
            isCollapsed ? "text-lg" : "text-xl"
          )}>
            {isCollapsed ? "TM" : "Task Manager"}
          </h1>
        </div>

        {/* New Task Button */}
        <div className="p-4">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
              isCollapsed && "px-2"
            )}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && "New Task"}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
                isCollapsed && "px-2 justify-center",
                isActive(item.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && item.label}
            </Link>
          ))}
        </nav>

        {/* Projects Section */}
        <div className={cn(
          "flex-1 px-2 py-4 border-t border-gray-200",
          isCollapsed && "hidden"
        )}>
          <ProjectTree />
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>
              <TaskForm
                onClose={() => setShowNewTaskModal(false)}
                onSubmit={handleTaskSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}