"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProposalsList } from "@/features/proposals/components/ProposalsList/ProposalsList";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import {
  useCreateActivity,
  useUpdateActivity,
} from "@/features/activities/hooks";
import {
  useCreateAccommodation,
  useUpdateAccommodation,
} from "@/features/accommodation/hooks";
import {
  useCreateTransport,
  useUpdateTransport,
} from "@/features/transport/hooks";
import {
  useCreateInventory,
  useUpdateInventory,
} from "@/features/inventory/hooks";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import {
  ActivityForm,
  AccommodationForm,
  TransportForm,
  InventoryForm,
} from "@/features/proposals/components";
import { Proposal, ProposalType } from "@/features/proposals/types";
import { Icon } from "@/components/ui/Icon";

export default function TripsTripIdProposalsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<ProposalType | null>(null);
  const [editingProposal, setEditingProposal] = useState<Proposal | undefined>(
    undefined,
  );

  const { mutate: createActivity, isPending: isCreatingActivity } = useCreateActivity(tripId);
  const { mutate: updateActivity, isPending: isUpdatingActivity } = useUpdateActivity(tripId);

  const { mutate: createAccommodation, isPending: isCreatingAcc } = useCreateAccommodation(tripId);
  const { mutate: updateAccommodation, isPending: isUpdatingAcc } = useUpdateAccommodation(tripId);

  const { mutate: createTransport, isPending: isCreatingTransport } = useCreateTransport(tripId);
  const { mutate: updateTransport, isPending: isUpdatingTransport } = useUpdateTransport(tripId);

  const { mutate: createInventory, isPending: isCreatingInv } = useCreateInventory(tripId);
  const { mutate: updateInventory, isPending: isUpdatingInv } = useUpdateInventory(tripId);

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

  const isAdmin = trip?.createdBy === user?.uid;

  const handleEdit = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setFormType(proposal.type);
    setIsFormOpen(true);
  };

  const handleOpenForm = (type: ProposalType) => {
    setFormType(type);
    setEditingProposal(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProposal(undefined);
    setFormType(null);
  };

  const onSubmit = (data: any) => {
    const type = editingProposal ? editingProposal.type : formType;
    if (editingProposal) {
      if (type === "activity") updateActivity({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
      else if (type === "accommodation") updateAccommodation({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
      else if (type === "transport") updateTransport({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
      else if (type === "inventory") updateInventory({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
    } else {
      if (type === "activity") createActivity({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
      else if (type === "accommodation") createAccommodation({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
      else if (type === "transport") createTransport({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
      else if (type === "inventory") createInventory({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
    }
  };

  const isSubmitting = isCreatingActivity || isUpdatingActivity || isCreatingAcc || isUpdatingAcc || isCreatingTransport || isUpdatingTransport || isCreatingInv || isUpdatingInv;

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto">
      <PageHeader
        title="Propuestas"
        description="Aquí puedes ver y votar las propuestas de actividades y lugares para tu viaje."
      />

      <ProposalsList
        tripId={tripId}
        currentUserId={user?.uid || ""}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        statusFilter={["pending"]}
      />

      <FloatingActionButton
        items={[
          {
            icon: <Icon name="local_activity" fill />,
            label: "Sugerir Actividad",
            onClick: () => handleOpenForm("activity"),
            variant: "primary",
          },
          {
            icon: <Icon name="hotel" fill />,
            label: "Sugerir Alojamiento",
            onClick: () => handleOpenForm("accommodation"),
            variant: "primary",
          },
          {
            icon: <Icon name="directions_car" fill />,
            label: "Sugerir Transporte",
            onClick: () => handleOpenForm("transport"),
            variant: "primary",
          },
          {
            icon: <Icon name="inventory_2" fill />,
            label: "Sugerir Inventario",
            onClick: () => handleOpenForm("inventory"),
            variant: "primary",
          },
        ]}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={
          editingProposal
            ? "Editar Propuesta"
            : `Sugerir ${
                formType === "activity"
                  ? "Actividad"
                  : formType === "accommodation"
                    ? "Alojamiento"
                    : formType === "transport"
                      ? "Transporte"
                      : "Inventario"
              }`
        }
      >
        {formType === "accommodation" ? (
          <AccommodationForm
            tripId={tripId}
            trip={trip}
            onClose={handleCloseForm}
            initialData={editingProposal}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isProposalMode={true}
          />
        ) : formType === "transport" ? (
          <TransportForm
            tripId={tripId}
            trip={trip}
            onClose={handleCloseForm}
            initialData={editingProposal}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isProposalMode={true}
          />
        ) : formType === "inventory" ? (
          <InventoryForm
            tripId={tripId}
            trip={trip}
            onClose={handleCloseForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            initialData={editingProposal}
            isProposalMode={true}
          />
        ) : (
          <ActivityForm
            tripId={tripId}
            trip={trip}
            onClose={handleCloseForm}
            initialData={editingProposal}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isProposalMode={true}
          />
        )}
      </Modal>
    </div>
  );
}
