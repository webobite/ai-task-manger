export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  userId: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
} 