import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse | Tripio",
  description: "Crea tu cuenta gratuita en Tripio",
};

export default function RegisterPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-bg-main relative overflow-hidden py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full">
        <RegisterForm />
      </div>
    </main>
  );
}
