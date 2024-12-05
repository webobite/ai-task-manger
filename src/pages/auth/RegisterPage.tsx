import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useAuthStore } from '../../store/authStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </div>
  );
} 