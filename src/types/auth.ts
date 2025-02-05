export interface User {
  id: string;
  email?: string; // Made optional to match Supabase's User type
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}