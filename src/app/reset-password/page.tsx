import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurar Contraseña | Tripio",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-bg-main">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto text-center p-8 animate-pulse text-gray-500 font-inter">
            Cargando entorno seguro...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
