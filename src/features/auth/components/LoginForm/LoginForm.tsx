"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { NeumorphicButton } from "@/components/NeumorphicButton";
import { NeumorphicInput } from "@/components/NeumorphicInput";
import {
  signInWithGoogle,
  loginWithEmail,
  checkUserExists,
  logout,
} from "../../api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const user = await loginWithEmail(data.email, data.password);
      // Verificamos si existe en Firestore
      const exists = await checkUserExists(user.uid);
      if (!exists) {
        await logout();
        setError("Este usuario no está registrado en Tripio.");
        return;
      }
      router.push("/");
    } catch (err) {
      const error = err as { code?: string };
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found") {
        setError("Este usuario no está registrado.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error de conexión o credenciales inválidas.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const user = await signInWithGoogle();
      // Verificamos si existe en Firestore
      const exists = await checkUserExists(user.uid);
      if (!exists) {
        // Si no existe, lo deslogueamos de Auth para que no quede "en el limbo"
        await logout();
        setError("Este usuario de Google no está registrado en Tripio.");
        return;
      }
      router.push("/");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Error al iniciar sesión con Google.");
    }
  };

  return (
    <NeumorphicCard className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <NeumorphicInput
          label="Email"
          placeholder="tu@email.com"
          {...register("email")}
          error={errors.email?.message}
          rightIcon={<Mail size={20} />}
        />
        <NeumorphicInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex justify-end -mt-2">
          <Link
            href="/forgot-password"
            className="text-gray-500 text-xs font-nunito hover:text-primary cursor-pointer transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">
            {error}
          </p>
        )}
        <NeumorphicButton
          type="submit"
          className="mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
        </NeumorphicButton>
      </form>

      <div className="relative flex items-center py-2">
        <div className="grow border-t border-gray-200"></div>
        <span className="shrink mx-4 text-gray-400 text-sm font-nunito">O</span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      <NeumorphicButton
        variant="ghost"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="font-nunito">Continuar con Google</span>
      </NeumorphicButton>

      <div className="text-center pt-2">
        <span className="text-gray-500 font-sans text-sm">
          ¿No tienes cuenta?{" "}
        </span>
        <Link
          href="/register"
          className="cursor-pointer text-primary font-bold font-nunito text-sm hover:underline"
        >
          Regístrate
        </Link>
      </div>
    </NeumorphicCard>
  );
}
