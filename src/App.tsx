import React from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TaskList } from './components/TaskList';
import { useTaskStore } from './store/taskStore';
import { Task, TaskStatus } from './types';
import { AnalyticsPage } from './pages/AnalyticsPage';

export function App() {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [searchParams] = useSearchParams();

  const handleEditTask = (task: Task) => {
    console.log('🎯 App: Received task update request', { task });
    try {
      console.log('📝 App: Calling updateTask with:', { id: task.id, task });
      updateTask(task.id, task);
      console.log('✅ App: Task update request completed');
    } catch (error) {
      console.error('❌ App: Error updating task:', error);
    }
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    console.log('🔄 App: Status change requested');
    console.log('📝 App: New status details:', { taskId, status });
    updateTask(taskId, { status });
    console.log('✅ App: Status update request sent to store');
  };

  const taskProps = {
    onAddTask: addTask,
    onEditTask: handleEditTask,
    onDeleteTask: deleteTask,
    onStatusChange: handleStatusChange,
    projectId: searchParams.get('project') || undefined,
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TaskList {...taskProps} />} />
        <Route path="/projects/:projectId" element={<TaskList {...taskProps} />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>
        </div>} />
      </Route>
    </Routes>
  );
}

export default App;