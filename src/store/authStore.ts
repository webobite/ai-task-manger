import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMockUser, initializeMockData } from '../lib/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: async (email: string, password: string) => {
        // For demo purposes, accept any credentials
        if (email === 'demo@example.com') {
          const demoUser = getMockUser();
          initializeMockData(); // Initialize mock data for demo user
          set({ user: demoUser });
        } else {
          // In a real app, you would validate credentials here
          const mockUser = {
            id: 'user-1',
            name: email.split('@')[0],
            email,
          };
          set({ user: mockUser });
        }
      },

      logout: () => {
        set({ user: null });
      },

      register: async (name: string, email: string, password: string) => {
        // In a real app, you would create a new user here
        const mockUser = {
          id: 'user-1',
          name,
          email,
        };
        set({ user: mockUser });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 