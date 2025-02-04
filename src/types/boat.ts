export interface Boat {
  id: string;
  user_id: string;
  name: string;
  type: string;
  length: string;
  year: string;
  manufacturer: string;
  images: string[];
  created_at: string;
}

export type NewBoat = Omit<Boat, "id" | "user_id" | "created_at">;

export interface Asset {
  id: string;
  boat_id: string;
  name: string;
  category: string;
  value: string;
  expiration_date?: string;
  buyer_name: string;
  created_at: string;
}

export interface Task {
  id: string;
  boat_id: string;
  description: string;
  completed: boolean;
  due_date: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';