export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  tasks?: Task[];
  task?: Task;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface TaskData {
  title: string;
  description?: string;
  completed?: boolean;
}