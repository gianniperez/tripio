"use client";

import type { ParticipantCardProps } from "./ParticipantCard.types";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";
import { useUser } from "@/features/auth/hooks";
import { TripRole, TripPermission } from "@/types/tripio";
import { useState } from "react";

const PERMISSION_LABELS: Record<TripPermission, string> = {
  edit_itinerary: "Editar Itinerario",
  create_proposal: "Crear Propuestas",
  vote_proposal: "Votar Propuestas",
  manage_logistics: "Gestionar Itinerario (Tareas/Inv)",
  view_finances: "Ver Finanzas",
  manage_participants: "Gestionar Participantes",
};

export function ParticipantCard({
  participant,
  isCurrentUser,
  canManage,
  onUpdateRole,
  onUpdatePermissions,
  onRemove,
}: ParticipantCardProps) {
  const [showOverrides, setShowOverrides] = useState(false);
  const { data: userProfile, isLoading } = useUser(
    participant.uid || participant.id,
  );

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateRole(e.target.value as TripRole);
  };

  const handlePermissionToggle = (permission: TripPermission) => {
    const currentOverrides = participant.customPermissions || {};
    const currentValue = currentOverrides[permission];

    const newValue = currentValue === undefined ? true : !currentValue;

    onUpdatePermissions({
      ...currentOverrides,
      [permission]: newValue,
    });
  };

  const handleClearOverride = (permission: TripPermission) => {
    const currentOverrides = { ...participant.customPermissions };
    delete currentOverrides[permission];
    onUpdatePermissions(currentOverrides);
  };

  return (
    <NeumorphicCard variant="gray">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-[--text-color] text-lg">
              {isLoading ? "Cargando..." : userProfile?.displayName}
            </h4>
            {isCurrentUser && (
              <span className="text-xs px-2 py-1 rounded-full">Tú</span>
            )}
            {participant.role === "owner" && (
              <span title="Propietario">
                <Icon
                  name="admin_panel_settings"
                  className="w-4 h-4 text-primary-extralight"
                  fill
                />
              </span>
            )}
            {participant.customPermissions &&
              Object.keys(participant.customPermissions).length > 0 && (
                <span title="Permisos especiales">
                  <Icon name="shield" className="w-4 h-4 text-primary" fill />
                </span>
              )}
          </div>
          <div className="text-sm text-[--text-muted]">
            <span className="capitalize">{participant.role}</span> &bull; Se
            unió el{" "}
            {participant.joinedAt?.toDate().toLocaleDateString() || "..."}
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          {canManage && participant.role !== "owner" ? (
            <>
              <select
                value={participant.role}
                onChange={handleRoleChange}
                className="h-10 px-3 rounded-lg bg-[--bg-color] text-[--text-color] border-2 border-transparent focus:border-[--primary-color] outline-none shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] transition-all cursor-pointer"
              >
                <option value="admin">Administrador</option>
                <option value="collaborator">Colaborador</option>
                <option value="viewer">Lector</option>
              </select>

              <NeumorphicButton
                variant="ghost"
                className="px-3 py-2 text-[--text-muted] hover:text-[--primary-color]"
                onClick={() => setShowOverrides(!showOverrides)}
                title="Configurar permisos"
              >
                <Icon name="settings" className="w-4 h-4" />
              </NeumorphicButton>

              <NeumorphicButton
                variant="ghost"
                className="text-red-500 px-3 py-2"
                onClick={onRemove}
                title="Eliminar participante"
              >
                <Icon name="person_remove" className="w-4 h-4" />
              </NeumorphicButton>
            </>
          ) : (
            <div className="text-sm font-medium px-4 py-2 rounded-lg bg-(--shadow-light) text-[--text-color]">
              {participant.role === "owner" ? "Propietario" : "Solo lectura"}
            </div>
          )}
        </div>
      </div>

      {showOverrides && canManage && (
        <div className="mt-4 pt-4 border-t border-(--shadow-dark) opacity-40">
          <h5 className="text-sm font-semibold mb-3 text-[--text-color]">
            Modificadores de Permisos (Overrides)
          </h5>
          <div className="grid sm:grid-cols-2 gap-2">
            {(Object.keys(PERMISSION_LABELS) as TripPermission[]).map(
              (perm) => {
                const isOverridden =
                  participant.customPermissions &&
                  participant.customPermissions[perm] !== undefined;
                const currentValue = isOverridden
                  ? participant.customPermissions![perm]
                  : false; // Simplification, technically it falls back to ROLE_PERMISSIONS but we just show if there's a hard override

                return (
                  <div
                    key={perm}
                    className="flex items-center justify-between p-2 rounded-lg bg-[--bg-color] shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                  >
                    <span className="text-xs text-[--text-color]">
                      {PERMISSION_LABELS[perm]}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePermissionToggle(perm)}
                        className={`px-2 py-1 text-xs rounded-md ${
                          isOverridden
                            ? currentValue
                              ? "bg-success/20 text-success"
                              : "bg-danger/20 text-danger"
                            : "bg-[--bg-color] text-[--text-muted]"
                        }`}
                      >
                        {isOverridden
                          ? currentValue
                            ? "PERMITIDO"
                            : "DENEGADO"
                          : "DEFAULT"}
                      </button>
                      {isOverridden && (
                        <button
                          onClick={() => handleClearOverride(perm)}
                          className="text-gray-400 hover:text-danger px-1"
                          title="Restaurar al valor del rol"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
}
