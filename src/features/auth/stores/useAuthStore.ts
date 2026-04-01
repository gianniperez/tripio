import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";

interface AuthState {
  currentUser: FirebaseUser | null;
  isInitialized: boolean;
  setAuth: (user: FirebaseUser | null) => void;
  setInitialized: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isInitialized: false,
  setAuth: (user) => set({ currentUser: user, isInitialized: true }),
  setInitialized: (status) => set({ isInitialized: status }),
}));
