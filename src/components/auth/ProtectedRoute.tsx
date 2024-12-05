import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useProjectStore(state => state.user);
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 