"use client";

import { useState, useTransition } from "react";
import type { ParticipantsPanelProps } from "./ParticipantsPanel.types";
import { isAdmin, isOwner } from "../../utils/permissions";
import { tripService } from "@/features/trips/api";
import Image from "next/image";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { mailService } from "@/features/mail";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function ParticipantsPanel({ participants, currentUserId, tripId }: ParticipantsPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const { currentUser } = useAuthStore();

  // Derivamos el usuario actual para computar permisos UI
  const me = participants.find((p) => p.id === currentUserId) || null;
  const iAmAdmin = isAdmin(me);

  // Nombre del usuario actual para el email
  const myName = currentUser?.displayName || "Un amigo";

  // Nombre del viaje — se pasa desde el parent o se usa un fallback
  // Se inyectará como prop en la próxima iteración; por ahora usamos el tripId
  const handleGenerateInvite = () => {
    if (!guestEmail.trim()) return;

    startTransition(async () => {
      try {
        const tokenId = await tripService.generateInviteToken(tripId, currentUserId);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const link = `${baseUrl}/invite/${tokenId}`;
        setInviteLink(link);
        navigator.clipboard.writeText(link);

        // Disparo el mail — fire-and-forget, no bloquea la UX
        mailService.sendInviteMail({
          to: guestEmail.trim(),
          tripName: "el viaje", // se enriquecerá cuando tengamos el tripName como prop
          inviterName: myName,
          inviteUrl: link,
        });
      } catch (error) {
        console.error("Error generando invite:", error);
      }
    });
  };

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NeumorphicCard className="bg-background w-full p-6 space-y-6">
      {/* Header y Acción Global */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-main">Participantes</h2>
          <p className="text-sm text-gray-500">
            {participants.length === 1
              ? "1 viajero en esta aventura"
              : `${participants.length} viajeros en esta aventura`}
          </p>
        </div>
      </div>

      {/* Formulario de invitación — solo visible para admins */}
      {iAmAdmin && (
        <div className="space-y-3">
          <NeumorphicInput
            label="Email del invitado"
            type="email"
            placeholder="amigo@email.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail((e.target as HTMLInputElement).value)}
            icon={<span className="material-symbols-rounded text-[20px]">mail</span>}
            helperText="Se enviará un link de invitación a este email."
          />
          <NeumorphicButton
            variant="primary"
            onClick={handleGenerateInvite}
            disabled={isPending || !guestEmail.trim()}
          >
            <span className="material-symbols-rounded text-[20px]">person_add</span>
            {isPending ? "Generando..." : "Invitar y enviar link"}
          </NeumorphicButton>
        </div>
      )}

      {/* Link generado */}
      {inviteLink && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex justify-between items-center gap-3 shadow-inner">
          <p className="w-full text-sm text-gray-700 truncate font-mono">{inviteLink}</p>
          <button
            onClick={handleCopyLink}
            className="flex-shrink-0 text-primary hover:scale-110 transition-transform p-2 cursor-pointer"
            title="Copiar link"
          >
            <span className="material-symbols-rounded text-[22px]">
              {copied ? "check_circle" : "content_copy"}
            </span>
          </button>
        </div>
      )}

      {/* Grid de Viajeros */}
      <div className="flex flex-col gap-4">
        {participants.map((p) => {
          const amIOwner = isOwner(me);
          const canManageThisUser =
            iAmAdmin && p.role !== "owner" && (amIOwner || p.role !== "admin");

          return (
            <NeumorphicCard key={p.id} variant="gray" className="group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center text-white">
                  {p.photoURL ? (
                    <Image
                      src={p.photoURL}
                      alt={p.displayName}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="material-symbols-rounded">person</span>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <span className="font-display font-bold text-main text-lg leading-tight">
                    {p.displayName}{" "}
                    {p.id === currentUserId && (
                      <span className="text-xs text-primary ml-1 font-sans font-normal">
                        (Tú)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        p.role === "owner"
                          ? "bg-purple-100 text-purple-700"
                          : p.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : p.role === "collaborator"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.role}
                    </span>
                    {Object.keys(p.customPermissions || {}).length > 0 && (
                      <span className="text-[10px] text-gray-500 bg-gray-200/50 px-2 py-0.5 rounded-full">
                        Overrides Activos
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {canManageThisUser && p.id !== currentUserId && (
                <div className="flex items-center gap-1 mt-4 sm:mt-0 ml-auto sm:ml-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm cursor-pointer"
                    title="Gestionar Permisos"
                  >
                    <span className="material-symbols-rounded text-[18px]">tune</span>
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors shadow-sm cursor-pointer"
                    title="Remover"
                  >
                    <span className="material-symbols-rounded text-[18px]">person_remove</span>
                  </button>
                </div>
              )}
            </NeumorphicCard>
          );
        })}
      </div>
    </NeumorphicCard>
  );
}
