"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { getInvitation, acceptInvitation } from "@/features/participants/api";
import { Invitation } from "@/types/tripio";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        if (!token) return;
        const data = await getInvitation(token);
        if (!data) {
          setError("Esta invitación no existe o ha caducado.");
        } else if (data.status !== "pending") {
          setError("Esta invitación ya ha sido utilizada.");
        } else {
          setInvitation(data);
        }
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError("Ocurrió un error al cargar la invitación.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleJoin = async () => {
    if (!user || !invitation || !token) return;

    setJoining(true);
    try {
      await acceptInvitation(token, user.uid, invitation);
      setJoined(true);
      // Pequeño delay para mostrar éxito antes de redirigir
      setTimeout(() => {
        router.push(`/trips/${invitation.tripId}`);
      }, 2000);
    } catch (err: unknown) {
      console.error("Error joining trip:", err);
      const errorMessage =
        err instanceof Error ? err.message : "No se pudo unir al viaje.";
      setError(errorMessage);
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[--bg-color]">
        <Icon
          name="progress_activity"
          className="w-10 h-10 text-[--primary-color] animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[--bg-color]">
        <NeumorphicCard className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Icon name="error" className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[--text-color]">
            ¡Ups! Algo salió mal
          </h1>
          <p className="text-gray-500">{error}</p>
          <Link href="/trips" className="block">
            <NeumorphicButton className="w-full">
              Ir a mis viajes
            </NeumorphicButton>
          </Link>
        </NeumorphicCard>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[--bg-color]">
        <NeumorphicCard className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Icon
              name="check_circle"
              className="w-16 h-16 text-green-500 animate-bounce"
            />
          </div>
          <h1 className="text-2xl font-bold text-[--text-color]">
            ¡Ya eres parte del equipo!
          </h1>
          <p className="text-gray-500">
            Redirigiéndote al viaje &quot;{invitation?.tripName}&quot;...
          </p>
        </NeumorphicCard>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[--bg-color]">
        <NeumorphicCard className="max-w-md w-full p-8 text-center space-y-6">
          <Icon
            name="person_add"
            className="w-16 h-16 text-[--primary-color] mx-auto"
          />
          <h1 className="text-2xl font-bold text-[--text-color]">
            Invitación a viajar
          </h1>
          <p className="text-gray-500">
            Has sido invitado por <strong>{invitation?.invitedByName}</strong> a
            unirte al viaje <strong>&quot;{invitation?.tripName}&quot;</strong>.
          </p>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-sm text-orange-800">
            Debes iniciar sesión para aceptar la invitación.
          </div>
          <Link href={`/login?redirect=/invite/${token}`} className="block">
            <NeumorphicButton variant="primary" className="w-full">
              Iniciar Sesión
            </NeumorphicButton>
          </Link>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[--bg-color]">
      <NeumorphicCard className="max-w-md w-full p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-[--primary-color] rounded-3xl rotate-12 mx-auto flex items-center justify-center shadow-lg mb-6">
            <Icon name="map" className="w-10 h-10 text-white -rotate-12" />
          </div>
          <h1 className="text-3xl font-bold text-[--text-color]">
            ¡Te invitaron!
          </h1>
          <p className="text-gray-500">
            <strong>{invitation?.invitedByName}</strong> te invitó a unirte como{" "}
            <strong>
              {invitation?.role === "admin"
                ? "Administrador"
                : invitation?.role === "collaborator"
                  ? "Colaborador"
                  : "Lector"}
            </strong>{" "}
            en:
          </p>
        </div>

        <div className="bg-[--bg-color] p-6 rounded-2xl shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] text-center">
          <h2 className="text-2xl font-black text-[--primary-color] tracking-tight">
            {invitation?.tripName}
          </h2>
        </div>

        <div className="space-y-4">
          <NeumorphicButton
            variant="primary"
            className="w-full h-14 text-lg font-bold"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <Icon
                name="progress_activity"
                className="w-6 h-6 animate-spin mr-2"
              />
            ) : (
              <Icon name="person_add" className="w-6 h-6 mr-2" />
            )}
            {joining ? "Uniéndome..." : "Aceptar Invitación"}
          </NeumorphicButton>

          <Link
            href="/trips"
            className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Ignorar esta invitación
          </Link>
        </div>
      </NeumorphicCard>
    </div>
  );
}
