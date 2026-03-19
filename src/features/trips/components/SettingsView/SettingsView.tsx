"use client";

import React, { useEffect, useState } from "react";
import { useTrip, useUpdateTrip, useDeleteTrip } from "@/features/trips/hooks";
import {
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ParticipantsManager } from "@/features/participants/components/ParticipantsManager/ParticipantsManager";
import {
  useParticipants,
  useRemoveParticipant,
  useInviteParticipant,
} from "@/features/participants/hooks";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateParticipant } from "@/features/trips/hooks";
import { Icon } from "@/components/ui/Icon";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { TripForm } from "../TripForm/TripForm";
import { TripFormValues } from "../TripForm/TripForm.types";
import { createTripSchema } from "@/features/trips/types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";

interface SettingsViewProps {
  tripId: string;
  onClose?: () => void;
}

type TabType = "general" | "features" | "participants";

export const SettingsView = ({ tripId, onClose }: SettingsViewProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: trip, isLoading } = useTrip(tripId);
  const { data: participants = [] } = useParticipants(tripId);
  const updateMutation = useUpdateTrip();
  const deleteMutation = useDeleteTrip();
  const updateParticipantMutation = useUpdateParticipant();
  const removeParticipantMutation = useRemoveParticipant();
  const inviteParticipantMutation = useInviteParticipant(
    tripId,
    trip?.name || "Viaje",
  );
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [formDefaultValues, setFormDefaultValues] = useState<
    Partial<TripFormValues>
  >({});

  useEffect(() => {
    if (trip) {
      setFormDefaultValues({
        name: trip.name,
        description: trip.description || "",
        startDate: trip.startDate
          ? trip.startDate.toDate().toISOString().split("T")[0]
          : undefined,
        endDate: trip.endDate
          ? trip.endDate.toDate().toISOString().split("T")[0]
          : undefined,
        currency: trip.currency || "USD",
        coverImage: trip.coverImage || "",
        enabledFeatures: trip.enabledFeatures || {
          logistics: true,
          activities: true,
          inventory: true,
          finances: true,
        },
      });
    }
  }, [trip]);

  const onSubmit = async (data: TripFormValues) => {
    try {
      const values = createTripSchema.parse(data);
      const newStartDate = values.startDate
        ? Timestamp.fromDate(values.startDate as Date)
        : null;
      const newEndDate = values.endDate
        ? Timestamp.fromDate(values.endDate as Date)
        : null;

      await updateMutation.mutateAsync({
        tripId,
        data: {
          name: values.name,
          description: values.description || null,
          currency: values.currency,
          startDate: newStartDate,
          endDate: newEndDate,
          coverImage: values.coverImage || null,
          enabledFeatures: values.enabledFeatures,
        },
      });

      // Date range validation logic
      if (newStartDate || newEndDate) {
        const proposalsRef = collection(db, "trips", tripId, "proposals");
        const confirmedQuery = query(
          proposalsRef,
          where("status", "==", "confirmed"),
        );
        const snap = await getDocs(confirmedQuery);
        const batch = writeBatch(db);
        let hasResets = false;

        const tripStart = newStartDate?.toDate();
        const tripEnd = newEndDate?.toDate();

        for (const proposalDoc of snap.docs) {
          const p = proposalDoc.data();
          const pStart = p.startDate?.toDate?.();
          const pEnd = p.endDate?.toDate?.();

          if (!pStart && !pEnd) continue;

          const isOutOfRange =
            (tripStart && pStart && pStart < tripStart) ||
            (tripEnd && pStart && pStart > tripEnd) ||
            (tripEnd && pEnd && pEnd > tripEnd) ||
            (tripStart && pEnd && pEnd < tripStart);

          if (isOutOfRange) {
            batch.update(proposalDoc.ref, {
              status: "pending",
              votes: {},
              optionVotes: {},
              confirmedAt: null,
            });
            hasResets = true;
          }
        }

        if (hasResets) {
          await batch.commit();
        }
      }

      if (onClose) onClose();
    } catch (error) {
      console.error("DEBUG - Update Error:", error);
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(tripId);
    if (onClose) onClose();
    router.push("/trips");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Icon
          name="progress_activity"
          className="w-10 h-10 text-primary animate-spin"
        />
        <p className="text-gray-500 font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterTabBar
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabType)}
        tabs={[
          {
            id: "general",
            label: "General",
            icon: <Icon name="settings" size={16} />,
          },
          {
            id: "participants",
            label: "Participantes",
            icon: <Icon name="group" size={16} />,
          },
        ]}
      />

      <div className="min-h-[400px]">
        {activeTab === "general" && (
          <div className="space-y-6">
            <TripForm
              onSubmit={onSubmit}
              defaultValues={formDefaultValues}
              isPending={updateMutation.isPending}
              submitLabel="Guardar Cambios"
            />

            <div className="pt-4 border-t border-gray-100">
              {!showConfirmDelete ? (
                <NeumorphicButton
                  type="button"
                  variant="danger"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  <Icon name="delete" size={14} className="mr-2" />
                  Eliminar Viaje
                </NeumorphicButton>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-danger/5">
                  <p className="text-xs text-danger font-black text-center">
                    ¿Estás seguro? Se borrará todo.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <NeumorphicButton
                        onClick={() => setShowConfirmDelete(false)}
                        variant="secondary"
                        className="text-sm py-2"
                      >
                        Cancelar
                      </NeumorphicButton>
                    </div>
                    <div className="flex-1">
                      <NeumorphicButton
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        variant="danger"
                        className="text-sm py-2"
                      >
                        {deleteMutation.isPending ? "Borrando..." : "Eliminar"}
                      </NeumorphicButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <ParticipantsManager
            participants={participants}
            currentUserId={currentUser?.uid || ""}
            onUpdateRole={(participantId, role) =>
              updateParticipantMutation.mutate({
                tripId,
                participantId,
                data: { role },
              })
            }
            onUpdatePermissions={(participantId, customPermissions) =>
              updateParticipantMutation.mutate({
                tripId,
                participantId,
                data: { customPermissions },
              })
            }
            onRemoveParticipant={(participantId) =>
              removeParticipantMutation.mutate({ tripId, participantId })
            }
            onInviteParticipant={async (role) => {
              const id = await inviteParticipantMutation.mutateAsync({
                role,
                invitedByToken: currentUser?.uid || "",
                invitedByName: currentUser?.displayName || "Admin",
              });
              return id;
            }}
          />
        )}
      </div>
    </div>
  );
};
