"use client";

import { useState } from "react";
import type { InviteParticipantProps } from "./InviteParticipant.types";
import { NeumorphicInput } from "@/components/NeumorphicInput";
import { NeumorphicButton } from "@/components/NeumorphicButton";
import { Mail, Send } from "lucide-react";
import { TripRole } from "@/types/tripio";

export function InviteParticipant({
  onInvite,
  isInviting,
}: InviteParticipantProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TripRole>("collaborator");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onInvite(email, role);
    setEmail(""); // Reset after try
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <NeumorphicInput
          type="email"
          placeholder="email@ejemplo.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          rightIcon={<Mail className="w-5 h-5 text-gray-500" />}
          required
        />
      </div>
      <div className="w-full sm:w-48">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as TripRole)}
          className="w-full h-[46px] px-4 rounded-xl bg-[--bg-color] text-[--text-color] border-2 border-transparent focus:border-[--primary-color] outline-none shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] transition-all appearance-none cursor-pointer"
        >
          <option value="admin">Administrador</option>
          <option value="collaborator">Colaborador</option>
          <option value="viewer">Lector</option>
        </select>
      </div>
      <NeumorphicButton
        type="submit"
        disabled={!email || isInviting}
        className="w-full sm:w-auto"
      >
        <Send className="w-4 h-4 mr-2" />
        {isInviting ? "Invitando..." : "Invitar"}
      </NeumorphicButton>
    </form>
  );
}
