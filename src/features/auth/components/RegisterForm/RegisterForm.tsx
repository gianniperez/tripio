"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { registerWithEmail, syncUserProfile } from "../../api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const firebaseUser = await registerWithEmail(
        data.email,
        data.password,
        data.name,
      );
      await syncUserProfile(firebaseUser, { displayName: data.name });
      router.push("/");
    } catch (err) {
      const error = err as { code?: string };
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este email ya está registrado.");
      } else {
        setError("Ocurrió un error al crear la cuenta.");
      }
    }
  };

  return (
    <NeumorphicCard className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-display font-bold text-primary text-center">
        Crear Cuenta
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <NeumorphicInput
          label="Nombre Completo"
          placeholder="Juan Pérez"
          {...register("name")}
          error={errors.name?.message}
          icon={<Icon name="person" size={24} />}
          iconPosition="right"
        />
        <NeumorphicInput
          label="Email"
          placeholder="tu@email.com"
          {...register("email")}
          error={errors.email?.message}
          icon={<Icon name="mail" size={24} />}
          iconPosition="right"
        />
        <NeumorphicInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <NeumorphicInput
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
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
          {isSubmitting ? "Registrando..." : "Crear Cuenta"}
        </NeumorphicButton>
      </form>

      <div className="text-center pt-2 border-t border-gray-100">
        <span className="text-gray-500 font-sans text-sm">
          ¿Ya tienes cuenta?{" "}
        </span>
        <Link
          href="/login"
          className="cursor-pointer text-primary font-bold font-nunito text-sm hover:underline"
        >
          Inicia Sesión
        </Link>
      </div>
    </NeumorphicCard>
  );
}
