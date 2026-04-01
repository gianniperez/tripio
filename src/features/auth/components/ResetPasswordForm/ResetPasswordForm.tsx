"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordErrorMessage = "La contraseña debe tener una mayúscula, minúscula y número";

const resetPasswordSchema = z
  .object({
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

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidCode, setIsValidCode] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!oobCode) {
      setIsVerifying(false);
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setIsValidCode(true))
      .catch((error) => console.error("Bad action code:", error))
      .finally(() => setIsVerifying(false));
  }, [oobCode]);

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!oobCode) return;
    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      setSuccess(true);
    } catch {
      alert("Hubo un error al restablecer la contraseña. El link puede haber expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8">
        <p className="text-gray-500 font-inter animate-pulse">Verificando enlace...</p>
      </div>
    );
  }

  if (!oobCode || !isValidCode) {
    return (
      <div className="w-full max-w-md mx-auto">
        <NeumorphicCard className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500 shadow-inner">
            <Icon name="error" size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-main mb-2">Enlace Inválido</h2>
          <p className="text-gray-500 font-inter mb-8">
            El enlace expiró o ya fue utilizado. Por favor, solicitá uno nuevo.
          </p>
          <Link href="/forgot-password" className="w-full">
            <NeumorphicButton variant="secondary">Solicitar Nuevo Enlace</NeumorphicButton>
          </Link>
        </NeumorphicCard>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <NeumorphicCard className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-500 shadow-inner">
            <Icon name="check_circle" size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-main mb-2">
            ¡Contraseña Actualizada!
          </h2>
          <p className="text-gray-500 font-inter mb-8">
            Ya podés usar tu nueva clave para ingresar a Tripio.
          </p>
          <Link href="/login" className="w-full">
            <NeumorphicButton variant="primary">Ir al Login</NeumorphicButton>
          </Link>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <NeumorphicCard className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-secondary font-display tracking-tight">
            Nueva Contraseña
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-inter">
            Creá tu nueva clave de acceso segura
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <NeumorphicInput
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            icon={<Icon name="lock" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <NeumorphicInput
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            icon={<Icon name="lock" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <NeumorphicButton type="submit" disabled={isLoading} variant="primary" className="mt-8">
            {isLoading ? "Actualizando..." : "Restaurar Contraseña"}
          </NeumorphicButton>
        </form>
      </NeumorphicCard>
    </div>
  );
}
