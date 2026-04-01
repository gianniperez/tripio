"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordErrorMessage = "La contraseña debe tener al menos una mayúscula, minúscula y número";

const registerSchema = z
  .object({
    displayName: z.string().min(2, "Debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(passwordRegex, { message: passwordErrorMessage }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await sendEmailVerification(res.user);

      // Crear Perfil Público en DB con el Schema del SRD
      const userRef = doc(db, "users", res.user.uid);
      await setDoc(userRef, {
        id: res.user.uid,
        displayName: data.displayName,
        email: data.email,
        photoURL: null,
        createdAt: new Date(),
      });

      alert("¡Cuenta generada! Te enviamos un correo de validación.");
      // Redirigir al usuario al dashboard
      router.push("/trips");
    } catch (error: unknown) {
      const fbError = error as { code?: string };
      if (fbError.code === "auth/email-already-in-use") {
        alert("Este correo ya está registrado en Tripio.");
      } else {
        alert("Ocurrió un error al registrar la cuenta.");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <NeumorphicCard className="p-8">
        <div className="flex flex-col items-center gap-4 mb-4">
          <Image
            src="/isologo.png"
            alt="Tripio Logo"
            width={60}
            height={60}
            className="drop-shadow-sm w-auto h-auto"
          />
          <h1 className="text-4xl font-black text-primary tracking-tighter">tripio</h1>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-500 mt-2 text-sm font-inter">
            Creá tu cuenta para empezar a organizar tus viajes.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <NeumorphicInput
            label="Nombre"
            type="text"
            placeholder="Juan Pérez"
            icon={<Icon name="person" size={20} />}
            iconPosition="right"
            error={errors.displayName?.message}
            {...register("displayName")}
          />

          <NeumorphicInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
            icon={<Icon name="mail" size={20} />}
            iconPosition="right"
            error={errors.email?.message}
            {...register("email")}
          />

          <NeumorphicInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <NeumorphicInput
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <NeumorphicButton type="submit" disabled={isLoading} variant="primary" className="mt-8">
            {isLoading ? "Creando..." : "Registrarme"}
          </NeumorphicButton>
        </form>

        <div className="mt-8 text-center pt-2 border-t border-gray-100">
          <span className="text-gray-500 text-sm font-inter">¿Ya tienes cuenta? </span>
          <Link
            href="/login"
            className="text-secondary font-bold text-sm hover:underline font-display"
          >
            Iniciá Sesión
          </Link>
        </div>
      </NeumorphicCard>
    </div>
  );
}
