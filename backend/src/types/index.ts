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