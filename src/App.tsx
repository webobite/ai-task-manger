import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TaskList } from './components/TaskList';
import { useTaskStore } from './store/taskStore';
import { Task, TaskStatus } from './types';

export function App() {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleEditTask = (task: Task) => {
    updateTask(task.id, task);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const taskProps = {
    onAddTask: addTask,
    onEditTask: handleEditTask,
    onDeleteTask: deleteTask,
    onStatusChange: handleStatusChange,
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<TaskList {...taskProps} />} />
      </Route>
    </Routes>
  );
}

export default App;