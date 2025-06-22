import { create } from "zustand";

type User = {
    id: number;
    name: string;
    email: string;
    image?: string;
    credits?: number;
    isVerified?: boolean;
}

type userStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<userStore>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    clearUser: () => set({user: null})
}))