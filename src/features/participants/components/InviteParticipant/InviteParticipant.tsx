"use client";

import { useState } from "react";
import type { InviteParticipantProps } from "./InviteParticipant.types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";
import { TripRole } from "@/types/tripio";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";

export function InviteParticipant({
  onInvite,
  isInviting,
}: InviteParticipantProps) {
  const [role, setRole] = useState<TripRole>("collaborator");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await onInvite(role);
    if (token) {
      const url = `${window.location.origin}/invite/${token}`;
      setGeneratedLink(url);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleGenerate} className="flex flex-col gap-3">
        <NeumorphicInput
          type="select"
          value={role}
          onChange={(e) => setRole(e.target.value as TripRole)}
          options={[
            { value: "admin", label: "Administrador" },
            { value: "collaborator", label: "Colaborador" },
            { value: "viewer", label: "Lector" },
          ]}
        />
        <NeumorphicButton
          type="submit"
          disabled={isInviting}
          variant="primary"
          className="w-full px-8"
          icon={isInviting ? "progress_activity" : "link"}
        >
          {isInviting ? "Generando..." : "Generar Link de Invitación"}
        </NeumorphicButton>
      </form>

      {generatedLink && (
        <NeumorphicButton
          icon={copied ? "check" : "content_copy"}
          onClick={copyToClipboard}
          variant="terciary"
        >
          {copied ? "Copiado" : "Copiar"}
        </NeumorphicButton>
      )}
    </div>
  );
}
