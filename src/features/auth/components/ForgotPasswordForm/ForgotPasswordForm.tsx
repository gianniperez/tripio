"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setIsSent(true);
    } catch (error: unknown) {
      alert("Error al enviar el correo. Verifica tu email.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <NeumorphicCard className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary shadow-inner">
            <Icon name="mark_email_read" size={32} fill />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-text-main mb-2">
            ¡Correo Enviado!
          </h2>
          <p className="text-gray-500 font-inter mb-8">
            Revisá tu bandeja de entrada o correo no deseado para restablecer tu contraseña.
          </p>
          <Link href="/login" className="w-full">
            <NeumorphicButton variant="secondary">Volver al Login</NeumorphicButton>
          </Link>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <NeumorphicCard className="p-8">
        <div className="flex flex-col items-center gap-4 mb-4">
          <Image
            src="/isologo.png"
            alt="Tripio Logo"
            width={50}
            height={50}
            className="drop-shadow-sm"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary font-display tracking-tight">
            Recuperar Acceso
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-inter">
            Ingresá tu mail y te enviaremos un link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <NeumorphicInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
            icon={<Icon name="mail" size={20} />}
            iconPosition="right"
            error={errors.email?.message}
            {...register("email")}
          />

          <NeumorphicButton type="submit" disabled={isLoading} variant="primary" className="mt-8">
            {isLoading ? "Enviando..." : "Enviar link"}
          </NeumorphicButton>
        </form>

        <div className="mt-8 text-center pt-2">
          <Link
            href="/login"
            className="text-gray-500 font-bold text-sm hover:text-gray-700 font-inter flex items-center justify-center gap-2 transition-colors"
          >
            <Icon name="arrow_back" size={16} /> Volver al Login
          </Link>
        </div>
      </NeumorphicCard>
    </div>
  );
}
