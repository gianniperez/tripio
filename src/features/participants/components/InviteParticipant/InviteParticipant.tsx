"use client";

import { useState } from "react";
import type { InviteParticipantProps } from "./InviteParticipant.types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Link as LinkIcon, Copy, Check, Loader2 } from "lucide-react";
import { TripRole } from "@/types/tripio";

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
      <form
        onSubmit={handleGenerate}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
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
          disabled={isInviting}
          variant="primary"
          className="w-full sm:w-auto px-8"
        >
          {isInviting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LinkIcon className="w-4 h-4 mr-2" />
          )}
          {isInviting ? "Generando..." : "Generar Link de Invitación"}
        </NeumorphicButton>
      </form>

      {generatedLink && (
        <div className="p-4 bg-[--bg-color] rounded-xl shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)] flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 truncate text-sm text-gray-500 font-mono">
            {generatedLink}
          </div>
          <NeumorphicButton
            onClick={copyToClipboard}
            className="px-4 py-2 text-xs"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <Copy className="w-3 h-3 mr-1" />
            )}
            {copied ? "Copiado" : "Copiar"}
          </NeumorphicButton>
        </div>
      )}
    </div>
  );
}
