import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar Correo | Tripio",
};

export default function VerifyEmailPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-bg-main">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto text-center p-8 animate-pulse text-gray-500 font-inter">
            Conectando con el servidor...
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
