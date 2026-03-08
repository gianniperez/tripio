"use client";

import { ParticipantsManager } from "@/features/participants/components/ParticipantsManager";
import { Participant } from "@/types/tripio";
import { Timestamp } from "firebase/firestore";

const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "user1",
    role: "owner",
    joinedAt: Timestamp.now(),
    budgetLimit: 0,
    invitedBy: "system",
  },
  {
    id: "user2",
    role: "admin",
    joinedAt: Timestamp.now(),
    budgetLimit: 1000,
    invitedBy: "user1",
  },
  {
    id: "user3",
    role: "collaborator",
    customPermissions: {
      edit_itinerary: false,
      manage_logistics: true,
    },
    joinedAt: Timestamp.now(),
    budgetLimit: 500,
    invitedBy: "user1",
  },
  {
    id: "user4",
    role: "viewer",
    joinedAt: Timestamp.now(),
    budgetLimit: 0,
    invitedBy: "user2",
  },
];

export default function TripParticipants() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[--text-color] mb-8">
        Participantes
      </h1>
      <div className="bg-[--bg-color] p-6 rounded-[20px] shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)]">
        <ParticipantsManager
          participants={MOCK_PARTICIPANTS}
          currentUserId="user1"
          onUpdateRole={(id, role) => console.log("Update role:", id, role)}
          onUpdatePermissions={(id, perms) =>
            console.log("Update perms:", id, perms)
          }
          onRemoveParticipant={(id) => console.log("Remove:", id)}
          onInviteParticipant={(email, role) =>
            console.log("Invite:", email, role)
          }
        />
      </div>
    </div>
  );
}
