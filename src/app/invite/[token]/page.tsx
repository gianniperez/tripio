"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tripService } from "@/features/trips/api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { TopBar } from "@/components/layout/TopBar";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { currentUser, isInitialized } = useAuthStore();
  const router = useRouter();

  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleJoin = async () => {
    if (!currentUser) {
      router.push(`/login?returnUrl=/invite/${token}`);
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const tripId = await tripService.joinTrip(currentUser.uid, token);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/trips/${tripId}`);
      }, 2000);
    } catch (err: unknown) {
      console.error("Error joining trip:", err);
      const message = err instanceof Error ? err.message : "Hubo un error al unirte al viaje.";
      setError(message);
    } finally {
      setIsJoining(false);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="max-w-xl mx-auto px-4 py-16 md:py-24">
        <NeumorphicCard className="text-center p-8 md:p-12">
          {!success ? (
            <>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-bounce">
                <Icon name="mail" size={40} />
              </div>

              <h1 className="text-3xl font-display font-bold text-text-main mb-4">
                ¡Te han invitado a un viaje! ✈️
              </h1>

              <p className="text-gray-500 mb-8 leading-relaxed">
                Únete a la aventura y comienza a planificar junto a tus amigos.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <NeumorphicButton variant="primary" onClick={handleJoin} disabled={isJoining}>
                  {isJoining
                    ? "Uniéndote..."
                    : currentUser
                      ? "Aceptar Invitación"
                      : "Inicia sesión para unirte"}
                </NeumorphicButton>

                <NeumorphicButton
                  variant="secondary"
                  onClick={() => router.push("/trips")}
                  disabled={isJoining}
                >
                  Ir a mis viajes
                </NeumorphicButton>
              </div>
            </>
          ) : (
            <div className="animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                <Icon name="check_circle" size={40} />
              </div>
              <h1 className="text-3xl font-display font-bold text-text-main mb-4">
                ¡Ya eres parte del equipo!
              </h1>
              <p className="text-gray-500">Redirigiéndote al viaje...</p>
            </div>
          )}
        </NeumorphicCard>
      </main>
    </div>
  );
}
