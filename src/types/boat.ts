export interface Boat {
  id: string;
  name: string;
  type: string;
  length: string;
  year: string;
  assets: Asset[];
  tasks: Task[];
}

export type NewBoat = Omit<Boat, "id" | "assets" | "tasks">;

export interface Asset {
  id: string;
  name: string;
  category: string;
  value: string;
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  boatId: string;
}