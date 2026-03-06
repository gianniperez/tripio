import { RegisterForm } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | Tripio",
  description: "Crea tu cuenta en Tripio para empezar a planificar tus viajes.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
