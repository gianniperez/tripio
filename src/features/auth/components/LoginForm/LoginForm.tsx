"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  linkWithCredential,
  AuthCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordErrorMessage = "La contraseña debe tener una mayúscula, minúscula y número";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkPrompt, setShowLinkPrompt] = useState(false);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<AuthCredential | null>(
    null
  );
  const [linkPassword, setLinkPassword] = useState("");
  const [linkPasswordError, setLinkPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email:
        typeof window !== "undefined" ? localStorage.getItem("tripio_remember_email") || "" : "",
      rememberMe:
        typeof window !== "undefined" ? !!localStorage.getItem("tripio_remember_email") : false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const persistence = data.rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      await signInWithEmailAndPassword(auth, data.email, data.password);

      if (data.rememberMe) {
        localStorage.setItem("tripio_remember_email", data.email);
      } else {
        localStorage.removeItem("tripio_remember_email");
      }

      router.push("/trips");
    } catch (error: unknown) {
      alert("Credenciales incorrectas o el usuario no existe");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserLocalPersistence);

      const isStandalone =
        typeof window !== "undefined" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as Navigator & { standalone?: boolean }).standalone);
      const isIOS = /iPad|iPhone|iPod/.test(navigator?.userAgent) && !("MSStream" in window);
      const useRedirect = isStandalone && isIOS;

      if (useRedirect) {
        await signInWithRedirect(auth, provider);
        return;
      } else {
        await signInWithPopup(auth, provider);
        router.push("/trips");
      }
    } catch (error: unknown) {
      const fbError = error as { code?: string };
      if (fbError.code === "auth/account-exists-with-different-credential") {
        const credential = GoogleAuthProvider.credentialFromError(
          error as { code: string; message: string; name: string }
        );
        if (credential) {
          setPendingGoogleCredential(credential);
          setShowLinkPrompt(true);
          alert("Tu correo ya está registrado con contraseña. Ingresala para activar Google.");
        }
      } else if (fbError.code === "auth/popup-blocked") {
        alert("El navegador bloqueó la ventana de inicio de sesión. Permití los popups.");
      } else {
        console.error("Detalle del error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleCredential || !linkPassword) return;
    setLinkPasswordError(null);

    if (!passwordRegex.test(linkPassword)) {
      setLinkPasswordError(passwordErrorMessage);
      return;
    }

    setIsLoading(true);
    try {
      const userEmail =
        (pendingGoogleCredential as unknown as { _tokenResponse?: { email?: string } })
          ._tokenResponse?.email || "";
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, linkPassword);
      await linkWithCredential(userCredential.user, pendingGoogleCredential).catch((err) =>
        console.warn(err)
      );

      setShowLinkPrompt(false);
      setPendingGoogleCredential(null);
      setLinkPassword("");
      router.push("/trips");
    } catch (error: unknown) {
      console.error(error);
      setLinkPasswordError("Contraseña incorrecta. No se pudo vincular con Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <NeumorphicCard className="p-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            src="/isologo.png"
            alt="Tripio Logo"
            width={60}
            height={60}
            className="drop-shadow-sm"
            style={{ width: "auto", height: "auto" }}
          />
          <h1 className="text-4xl font-black text-primary tracking-tighter">tripio</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <NeumorphicInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
            icon={<Icon name="mail" size={20} />}
            iconPosition="right"
            error={errors.email?.message}
            {...register("email")}
          />

          <NeumorphicInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            labelRightContent={
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-secondary hover:text-secondary-dark transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            }
            {...register("password")}
          />

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded text-secondary focus:ring-secondary transition-all cursor-pointer accent-secondary"
              />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                Recordarme
              </span>
            </label>
          </div>

          <NeumorphicButton type="submit" disabled={isLoading} variant="primary" className="mt-6">
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </NeumorphicButton>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-3 opacity-60">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            O continuar con
          </span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <NeumorphicButton
          type="button"
          onClick={handleGoogleLogin}
          disabled={showLinkPrompt || isLoading}
          variant="secondary"
          className="mt-6 flex gap-3 text-gray-600 font-bold"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </NeumorphicButton>

        {showLinkPrompt && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <NeumorphicCard className="p-6 w-full max-w-sm animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">
                Activar Acceso con Google
              </h3>
              <p className="text-sm text-gray-600 mb-6 font-inter">
                Para vincular tu cuenta, por favor ingresa tu contraseña de Tripio una última vez.
              </p>

              <form onSubmit={handleLinkAccount} className="space-y-4">
                <NeumorphicInput
                  label="Tu Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={linkPassword}
                  onChange={(e) => {
                    setLinkPassword(e.target.value);
                    if (linkPasswordError) setLinkPasswordError(null);
                  }}
                  error={linkPasswordError || undefined}
                  autoFocus
                />
                <div className="flex gap-3 pt-2">
                  <NeumorphicButton
                    type="button"
                    variant="ghost"
                    onClick={() => setShowLinkPrompt(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </NeumorphicButton>
                  <NeumorphicButton type="submit" variant="primary" disabled={isLoading}>
                    Vincular
                  </NeumorphicButton>
                </div>
              </form>
            </NeumorphicCard>
          </div>
        )}

        <div className="mt-8 text-center pt-2">
          <span className="text-gray-500 text-sm font-inter">¿No tienes cuenta? </span>
          <Link href="/register" className="text-secondary font-bold text-sm hover:underline">
            Regístrate
          </Link>
        </div>
      </NeumorphicCard>
    </div>
  );
}
