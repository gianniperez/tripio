"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { NeumorphicButton } from "@/components/NeumorphicButton";
import { NeumorphicInput } from "@/components/NeumorphicInput";
import { sendPasswordReset } from "../../api";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(false);
    try {
      await sendPasswordReset(data.email);
      setSuccess(true);
    } catch (err) {
      const error = err as { code?: string };
      console.error("Reset password error:", error);
      if (error.code === "auth/user-not-found") {
        setError("Este email no está registrado.");
      } else {
        setError("Ocurrió un error al enviar el correo.");
      }
    }
  };

  if (success) {
    return (
      <NeumorphicCard className="w-full flex flex-col gap-6 items-center text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-black text-primary">
            ¡Email enviado!
          </h2>
          <p className="text-gray-500 text-center font-sans">
            Hemos enviado un enlace de recuperación a tu correo electrónico. Por
            favor, revisa tu bandeja de entrada.
          </p>
          <Link href="/login" className="w-full">
            <NeumorphicButton className="w-full">
              Volver al inicio de sesión
            </NeumorphicButton>
          </Link>
        </div>
      </NeumorphicCard>
    );
  }

  return (
    <NeumorphicCard className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-display font-black text-primary">
            Recuperar Contraseña
          </h2>
        </div>
        <p className="text-gray-500 text-sm font-sans text-center">
          Ingresa tu email y te enviaremos un link para recuperarla.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <NeumorphicInput
          label="Email"
          placeholder="tu@email.com"
          {...register("email")}
          error={errors.email?.message}
          rightIcon={<Mail size={20} />}
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
          {isSubmitting ? "Enviando..." : "Enviar enlace"}
        </NeumorphicButton>
      </form>
    </NeumorphicCard>
  );
}
