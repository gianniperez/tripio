"use client";

import { useState, useTransition } from "react";
import type { ParticipantsPanelProps } from "./ParticipantsPanel.types";
import { isAdmin, isOwner } from "../../utils/permissions";
import { generateInviteToken } from "../../actions/generateInviteToken";
import Image from "next/image";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

export function ParticipantsPanel({ participants, currentUserId, tripId }: ParticipantsPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  // Derivamos el usuario actual para computar permisos UI
  const me = participants.find((p) => p.id === currentUserId) || null;
  const iAmAdmin = isAdmin(me);

  const handleGenerateInvite = () => {
    startTransition(async () => {
      try {
        const link = await generateInviteToken(tripId, currentUserId, "collaborator");
        setInviteLink(link);
        navigator.clipboard.writeText(link);
      } catch (error) {
        console.error("Error generando invite:", error);
      }
    });
  };

  return (
    <NeumorphicCard className="bg-white w-full p-6 space-y-6">
      {/* Header y Acción Global */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">Participantes</h2>
          <p className="text-sm text-gray-500 font-inter">
            {participants.length === 1
              ? "1 viajero en esta aventura"
              : `${participants.length} viajeros en esta aventura`}
          </p>
        </div>

        {iAmAdmin && (
          <button
            onClick={handleGenerateInvite}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F46A1F] text-white font-nunito font-bold shadow-md hover:shadow-inner hover:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">person_add</span>
            {isPending ? "Generando..." : "Invitar Amigo"}
          </button>
        )}
      </div>

      {inviteLink && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex justify-between items-center gap-4 shadow-inner">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="w-full bg-transparent text-sm text-gray-700 font-inter outline-none"
          />
          <button
            onClick={() => navigator.clipboard.writeText(inviteLink)}
            className="text-[#F46A1F] hover:scale-110 transition-transform p-2 cursor-pointer"
            title="Copiar link"
          >
            <span className="material-symbols-rounded">content_copy</span>
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
                <div className="w-12 h-12 rounded-full bg-primary overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center text-gray-400">
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

                <div className="flex flex-col">
                  <span className="font-nunito font-bold text-gray-800 text-lg leading-tight">
                    {p.displayName}{" "}
                    {p.id === currentUserId && (
                      <span className="text-xs text-[#F46A1F] ml-1 font-inter font-normal">
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
                      <span className="text-[10px] text-gray-500 font-inter bg-gray-200/50 px-2 py-0.5 rounded-full">
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
