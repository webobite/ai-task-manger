import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';

export function DashboardLayout() {
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const loadTasks = useTaskStore((state) => state.loadTasks);

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, [loadProjects, loadTasks]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar />
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}