"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { Proposal } from "@/features/proposals/types";
import {
  useCreateActivity,
  useUpdateActivity,
} from "@/features/activities/hooks";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { ItineraryManager } from "@/features/trips/components/itinerary";
import { SettingsModal } from "@/features/trips/components";
import { ActivityForm } from "@/features/proposals/components";

export default function ActivitiesPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | undefined>(
    undefined,
  );

  const { mutate: createActivity, isPending: isCreating } =
    useCreateActivity(tripId);
  const { mutate: updateActivity, isPending: isUpdating } =
    useUpdateActivity(tripId);

  if (isLoadingTrip || !trip) {
    return (
      <div className="flex justify-center py-20">
        <Icon
          name="progress_activity"
          className="w-8 h-8 animate-spin text-primary"
        />
      </div>
    );
  }

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProposal(undefined);
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto">
      <PageHeader
        title="Actividades"
        description="Gestiona el itinerario y cronograma confirmado de tu viaje."
      />

      <ItineraryManager
        tripId={tripId}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <FloatingActionButton onClick={() => setIsFormOpen(true)} />

      {/* Creation/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingProposal ? "Editar Actividad" : "Sugerir Actividad"}
      >
        <ActivityForm
          tripId={tripId}
          trip={trip}
          onClose={handleCloseForm}
          initialData={editingProposal}
          onSubmit={(data: any) => {
            if (editingProposal) {
              updateActivity(
                { proposalId: editingProposal.id, ...data },
                { onSuccess: handleCloseForm },
              );
            } else {
              createActivity(
                { ...data, userId: user?.uid || "" },
                { onSuccess: handleCloseForm },
              );
            }
          }}
          isSubmitting={isCreating || isUpdating}
          isProposalMode={false}
        />
      </Modal>

      {/* Settings Modal (for dates) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tripId={tripId}
      />
    </div>
  );
}
