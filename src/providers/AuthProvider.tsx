"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/stores";
import { subscribeToAuthChanges, syncUserProfile } from "@/features/auth/api";
import { useRouter, usePathname } from "next/navigation";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setFirebaseUser, loading, setLoading, setUser, setError } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userProfile = await syncUserProfile(firebaseUser, {}, true);

          if (userProfile) {
            setUser(userProfile);
            if (
              pathname === "/login" ||
              pathname === "/forgot-password" ||
              pathname === "/register"
            ) {
              router.replace("/");
            }
          } else {
            setUser(null);
            if (pathname !== "/login" && pathname !== "/register") {
              console.warn("Usuario sin perfil de Tripio detectado");
              router.replace("/login");
            }
          }
        } catch (err) {
          console.error("Error syncing user profile:", err);
          setError("No se pudo sincronizar el perfil de usuario.");
          if (pathname !== "/login") {
            router.replace("/login");
          }
        }
      } else {
        setUser(null);
        if (
          pathname !== "/login" &&
          pathname !== "/register" &&
          pathname !== "/forgot-password"
        ) {
          router.replace("/login");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUser, setLoading, setError, pathname, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary-dark font-semibold animate-pulse">
          Iniciando Tripio...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
