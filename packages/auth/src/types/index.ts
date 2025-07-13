// Auth types placeholder
export interface User {
  id: string;
  email: string;
  role: 'free' | 'premium' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
