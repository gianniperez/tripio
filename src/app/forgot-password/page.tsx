import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Tripio",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-bg-main">
      <ForgotPasswordForm />
    </main>
  );
}
