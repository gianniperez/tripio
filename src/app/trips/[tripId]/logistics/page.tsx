"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  type ProposalType,
  type Proposal,
  type CreateProposalFormValues,
} from "@/features/proposals/types";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
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
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { LogisticsManager } from "@/features/logistics/components/LogisticsManager";
import {
  AccommodationForm,
  TransportForm,
  InventoryForm,
} from "@/features/proposals/components";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";

export default function LogisticsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: loadingTrip } = useTrip(tripId);
  const { mutate: createAccommodation, isPending: isCreatingAcc } = useCreateAccommodation(tripId);
  const { mutate: updateAccommodation, isPending: isUpdatingAcc } = useUpdateAccommodation(tripId);

  const { mutate: createTransport, isPending: isCreatingTransport } = useCreateTransport(tripId);
  const { mutate: updateTransport, isPending: isUpdatingTransport } = useUpdateTransport(tripId);

  const { mutate: createInventory, isPending: isCreatingInv } = useCreateInventory(tripId);
  const { mutate: updateInventory, isPending: isUpdatingInv } = useUpdateInventory(tripId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<ProposalType | null>(null);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);

  if (loadingTrip || !trip) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Icon
          name="progress_activity"
          className="w-10 h-10 text-primary animate-spin"
        />
        <p className="text-gray-500 font-medium">Cargando logística...</p>
      </div>
    );
  }

  const handleOpenForm = (type: ProposalType | null = null) => {
    setFormType(type);
    setEditingProposal(null);
    setIsFormOpen(true);
  };

  const handleEdit = (proposal: Proposal) => {
    setFormType(proposal.type);
    setEditingProposal(proposal);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProposal(null);
    setFormType(null);
  };

  const onSubmit = (data: any) => {
    const type = editingProposal ? editingProposal.type : formType;
    if (editingProposal) {
      if (type === "accommodation") updateAccommodation({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
      else if (type === "transport") updateTransport({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
      else if (type === "inventory") updateInventory({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
    } else {
      if (type === "accommodation") createAccommodation({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
      else if (type === "transport") createTransport({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
      else if (type === "inventory") createInventory({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
    }
  };

  const isAdmin = trip.createdBy === user?.uid;
  const isSubmitting = isCreatingAcc || isUpdatingAcc || isCreatingTransport || isUpdatingTransport || isCreatingInv || isUpdatingInv;

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto">
      <PageHeader
        title="Logística"
        description="Gestión de alojamientos y transportes confirmados para tu viaje."
      />

      <LogisticsManager
        tripId={tripId}
        trip={trip}
        user={user}
        isAdmin={isAdmin}
        onEdit={handleEdit}
      />

      <FloatingActionButton
        items={[
        {
          label: "Gestionar Alojamiento",
          icon: <Icon name="bed" fill />,
          onClick: () => handleOpenForm("accommodation"),
          variant: "primary",
        },
        {
          label: "Gestionar Transporte",
          icon: <Icon name="directions_car" fill />,
          onClick: () => handleOpenForm("transport"),
          variant: "primary",
        },
        {
          label: "Gestionar Inventario",
          icon: <Icon name="inventory_2" fill />,
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
            ? `Editar ${
                editingProposal.type === "accommodation"
                  ? "Alojamiento"
                  : editingProposal.type === "transport"
                    ? "Transporte"
                    : "Inventario"
              }`
            : formType === "accommodation"
              ? "Nuevo Alojamiento"
              : formType === "transport"
                ? "Nuevo Transporte"
                : "Añadir al Inventario"
        }
      >
        <div className="space-y-6">
          {formType === "accommodation" ? (
            <AccommodationForm
              tripId={tripId}
              trip={trip}
              onClose={handleCloseForm}
              initialData={editingProposal || undefined}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isProposalMode={false}
            />
          ) : formType === "transport" ? (
            <TransportForm
              tripId={tripId}
              trip={trip}
              onClose={handleCloseForm}
              initialData={editingProposal || undefined}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isProposalMode={false}
            />
          ) : formType === "inventory" ? (
            <InventoryForm
              tripId={tripId}
              trip={trip}
              onClose={handleCloseForm}
              initialData={editingProposal || undefined}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isProposalMode={false}
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
