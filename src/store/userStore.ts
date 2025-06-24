import { create } from "zustand";
import { devtools } from "zustand/middleware";

type User = {
  id: number;
  name: string;
  email: string;
  image?: string;
  credits?: number;
  isVerified?: boolean;
};

type userStore = {
  user: User | null;
  isLoaded: Boolean;
  setUser: (user: User) => void;
  setLoading: () => void;
  clearUser: () => void;
};

export const useUserStore = create<userStore>()(
  devtools(
    (set) => ({
      user: null,
      isLoaded: false,
      setLoading: () => set({ isLoaded: true }),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "UserStore" }
  )
);
