import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Tripio",
  description: "Acceso seguro a tus próximos viajes",
};

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-bg-main relative overflow-hidden">
      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </main>
  );
}
