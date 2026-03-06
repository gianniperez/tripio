import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { User as DbUser } from "@/types/tripio";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: DbUser | null; // Profile from Firestore
  loading: boolean;
  error: string | null;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: DbUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  loading: true,
  error: null,
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAuth: () =>
    set({ firebaseUser: null, user: null, loading: false, error: null }),
}));
