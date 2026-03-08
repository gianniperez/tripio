import { Participant, TripPermission, TripRole } from "@/types/tripio";

/**
 * Mapeo de Roles a sus permisos por defecto según el SRD v3.1
 */
export const ROLE_PERMISSIONS: Record<TripRole, TripPermission[]> = {
  owner: [
    "edit_itinerary",
    "create_proposal",
    "vote_proposal",
    "manage_logistics",
    "view_finances",
    "manage_participants",
  ],
  admin: [
    "edit_itinerary",
    "create_proposal",
    "vote_proposal",
    "manage_logistics",
    "view_finances",
    "manage_participants",
  ],
  collaborator: [
    "create_proposal",
    "vote_proposal",
    "manage_logistics",
    "view_finances",
  ],
  viewer: ["view_finances"],
};

/**
 * Valida si un participante tiene un permiso específico.
 * Sigue la lógica híbrida:
 * 1. El 'owner' siempre tiene todos los permisos.
 * 2. Si existe un 'override' explícito en customPermissions, manda sobre el rol.
 * 3. De lo contrario, se usa el permiso por defecto del rol.
 */
export const hasPermission = (
  participant: Participant | null | undefined,
  permission: TripPermission,
): boolean => {
  if (!participant) return false;

  // 1. El Owner es Dios
  if (participant.role === "owner") return true;

  // 2. Revisar Overrides (flags específicos)
  // Si el flag existe (no es undefined), tiene prioridad absoluta
  const override = participant.customPermissions?.[permission];
  if (override !== undefined) {
    return override;
  }

  // 3. Permiso por defecto de la jerarquía
  const defaultPermissions = ROLE_PERMISSIONS[participant.role] || [];
  return defaultPermissions.includes(permission);
};

/**
 * Helper para verificar múltiples permisos (AND)
 */
export const hasAllPermissions = (
  participant: Participant | null | undefined,
  permissions: TripPermission[],
): boolean => {
  return permissions.every((p) => hasPermission(participant, p));
};

/**
 * Helper para verificar cualquiera de los permisos (OR)
 */
export const hasAnyPermission = (
  participant: Participant | null | undefined,
  permissions: TripPermission[],
): boolean => {
  return permissions.some((p) => hasPermission(participant, p));
};
