import React from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ProjectTree } from '../ProjectTree';
import { Task } from '../../types/task';

interface SidebarProps {
  onEditTask?: (task: Task) => void;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar({ onEditTask }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 w-full p-2 rounded-md ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="border-t mt-4">
        {onEditTask && <ProjectTree onEditTask={onEditTask} />}
      </div>
    </aside>
  );
}