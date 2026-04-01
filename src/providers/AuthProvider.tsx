"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setInitialized, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuth(user);
      setInitialized(true);

      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (user) {
        // Si el usuario está logueado e intenta acceder a login/register, lo mandamos al home o dashboard
        if (isPublicRoute) {
          router.replace("/trips");
        }
      } else {
        // Si el usuario NO está logueado y la ruta NO es pública, lo mandamos al login
        if (!isPublicRoute && pathname !== "/") {
          router.replace("/login");
        }
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [pathname, router, setAuth, setInitialized]);

  // Evitar problemas de hidratación en Next.js
  if (!mounted) return null;

  // Mientras se inicializa el estado de Firebase, mostramos un loading para evitar flickers
  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-main space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-display font-bold animate-pulse">Cargando Tripio...</p>
      </div>
    );
  }

  return <>{children}</>;
}
