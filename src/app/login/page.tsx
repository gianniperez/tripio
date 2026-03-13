import { LoginForm } from "@/features/auth";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Tripio",
  description: "Ingresa a tu cuenta de Tripio.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-8">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/isologo/orange.png"
          alt="Tripio Logo"
          width={80}
          height={80}
          className="drop-shadow-sm w-auto h-auto"
        />
        <h1 className="text-4xl font-black text-primary tracking-tighter">
          tripio
        </h1>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
