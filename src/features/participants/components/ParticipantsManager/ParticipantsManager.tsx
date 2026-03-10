"use client";

import { useState } from "react";
import type { ParticipantsManagerProps } from "./ParticipantsManager.types";
import { ParticipantCard } from "../ParticipantCard";
import { InviteParticipant } from "../InviteParticipant";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Users } from "lucide-react";
import { hasPermission } from "@/features/auth/utils/permissions";
import { Participant } from "@/types/tripio";

export function ParticipantsManager({
  participants,
  currentUserId,
  onUpdateRole,
  onUpdatePermissions,
  onRemoveParticipant,
  onInviteParticipant,
}: ParticipantsManagerProps) {
  const [isInviting, setIsInviting] = useState(false);
  const currentUser = participants.find((p) => p.id === currentUserId);
  const canManageParticipants = hasPermission(
    currentUser,
    "manage_participants",
  );

  const handleInvite = async (role: Participant["role"]) => {
    setIsInviting(true);
    try {
      return await onInviteParticipant(role);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-[--text-color]" />
        <h2 className="text-xl font-bold text-[--text-color]">Participantes</h2>
      </div>

      {canManageParticipants && (
        <NeumorphicCard className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-[--text-color]">
            Invitar nuevo participante
          </h3>
          <InviteParticipant onInvite={handleInvite} isInviting={isInviting} />
        </NeumorphicCard>
      )}

      <div className="grid gap-4">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            isCurrentUser={participant.id === currentUserId}
            canManage={
              canManageParticipants && participant.id !== currentUserId
            }
            onUpdateRole={(newRole) => onUpdateRole(participant.id, newRole)}
            onUpdatePermissions={(permissions) =>
              onUpdatePermissions(participant.id, permissions)
            }
            onRemove={() => onRemoveParticipant(participant.id)}
          />
        ))}
      </div>
    </div>
  );
}
