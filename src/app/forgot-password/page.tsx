import { ForgotPasswordForm } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Tripio",
  description: "Recupera el acceso a tu cuenta de Tripio.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
