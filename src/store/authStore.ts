import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  })(),

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
})); 