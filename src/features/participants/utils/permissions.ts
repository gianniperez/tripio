import { Participant, Role, CustomPermissions } from "@/types/models";

const checkOverride = (
  participant: Participant | null,
  permission: keyof CustomPermissions
): boolean | null => {
  if (!participant) return false;

  // Si el objeto de overrides existe y tiene explicitly este permiso definido
  if (
    participant.customPermissions &&
    typeof participant.customPermissions[permission] === "boolean"
  ) {
    return participant.customPermissions[permission] as boolean;
  }
  return null;
};

/**
 * Función central de evaluación de permisos Híbridos (Role + Overrides)
 */
export const hasPermission = (
  participant: Participant | null,
  permission: keyof CustomPermissions,
  allowedRoles: Role[]
): boolean => {
  if (!participant) return false;
  if (participant.role === "owner") return true;

  const override = checkOverride(participant, permission);

  // Si hay un override explicito, el override manda independientemente del rol
  if (override !== null) return override;

  // Si no hay override, fallback al listado de roles base permitidos
  return allowedRoles.includes(participant.role);
};

// ================= ALIASES GRANULARES ================= //

export const canEditItinerary = (participant: Participant | null) =>
  hasPermission(participant, "edit_itinerary", ["admin"]);

export const canCreateProposal = (participant: Participant | null) =>
  hasPermission(participant, "create_proposal", ["admin", "collaborator"]);

export const canVoteProposal = (participant: Participant | null) =>
  hasPermission(participant, "vote_proposal", ["admin", "collaborator"]);

export const canManageLogistics = (participant: Participant | null) =>
  hasPermission(participant, "manage_logistics", ["admin"]);

export const canManageParticipants = (participant: Participant | null) =>
  hasPermission(participant, "manage_participants", ["admin"]);

// ================= ROLES DUROS ================= //

export const isAdmin = (participant: Participant | null) =>
  participant?.role === "admin" || participant?.role === "owner";

export const isOwner = (participant: Participant | null) => participant?.role === "owner";
