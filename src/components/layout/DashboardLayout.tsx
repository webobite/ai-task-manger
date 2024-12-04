import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Task } from '../../types/task';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onEditTask?: (task: Task) => void;
}

export function DashboardLayout({ children, onEditTask }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar onEditTask={onEditTask} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}