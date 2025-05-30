import { create } from 'zustand';

export interface Comment {
  id: number;
  text: string;
  star: number;
  userId: number;
  centerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  likes: any[];
  resources: any[];
  receptions: any[];
}

interface UserState {
  user: UserData | null;
  setUser: (data: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (data) => set({ user: data }),
  clearUser: () => set({ user: null }),
}));
