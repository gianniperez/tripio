"use client";

import { useState, useEffect } from "react";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [isVerifying, setIsVerifying] = useState(!!oobCode);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) return;

    applyActionCode(auth, oobCode)
      .then(() => setIsSuccess(true))
      .catch((error) => console.error("Error validando email:", error))
      .finally(() => setIsVerifying(false));
  }, [oobCode]);

  if (isVerifying) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8">
        <p className="text-gray-500 font-inter animate-pulse">
          Verificando tu correo electrónico...
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <NeumorphicCard className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-500 shadow-inner">
            <Icon name="verified_user" size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-main mb-2">
            ¡Correo Verificado!
          </h2>
          <p className="text-gray-500 font-inter mb-8">
            Tu cuenta de Tripio está lista para ser usada.
          </p>
          <Link href="/login" className="w-full">
            <NeumorphicButton variant="primary">Iniciar Sesión</NeumorphicButton>
          </Link>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <NeumorphicCard className="p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500 shadow-inner">
          <Icon name="error" size={32} />
        </div>
        <h2 className="text-2xl font-display font-bold text-text-main mb-2">Enlace Inválido</h2>
        <p className="text-gray-500 font-inter mb-8">
          El enlace de verificación es inválido o ya ha expirado.
        </p>
        <Link href="/login" className="w-full">
          <NeumorphicButton variant="secondary">Volver al Inicio</NeumorphicButton>
        </Link>
      </NeumorphicCard>
    </div>
  );
}
