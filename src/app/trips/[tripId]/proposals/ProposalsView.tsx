"use client";

import React, { useState } from "react";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { Icon } from "@/components/ui/Icon";
import { ProposalList } from "@/features/proposals/components/ProposalList";
import {
  useAllProposals,
  useVoteProposal,
  useDeleteProposal,
  useConfirmProposal,
} from "@/features/proposals/hooks/useProposals";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useParticipant } from "@/features/participants/hooks/useParticipant";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { ConfirmDialog } from "@/components/ui/dialog/ConfirmDialog/ConfirmDialog";
import { ActivityProposalForm } from "@/features/proposals/components/ActivityProposalForm";
import { AccommodationProposalForm } from "@/features/proposals/components/AccommodationProposalForm";
import { TransportProposalForm } from "@/features/proposals/components/TransportProposalForm";
import { InventoryProposalForm } from "@/features/proposals/components/InventoryProposalForm";
import type { ProposalType, UnifiedProposal } from "@/features/proposals/api/proposalsService";

export function ProposalsView({ tripId }: { tripId: string }) {
  const { data: proposals, isLoading: isLoadingProposals } = useAllProposals(tripId);
  const { mutate: voteProposal } = useVoteProposal(tripId);
  const { mutate: deleteProposal, isPending: isDeleting } = useDeleteProposal(tripId);
  const { mutate: confirmProposal, isPending: isConfirming } = useConfirmProposal(tripId);
  
  const { currentUser } = useAuthStore();
  const { data: currentParticipant, isLoading: isLoadingParticipant } = useParticipant(tripId, currentUser?.uid || "");
  const [activeTab, setActiveTab] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<ProposalType>("activity");
  const [proposalToEdit, setProposalToEdit] = useState<UnifiedProposal | undefined>();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<UnifiedProposal | undefined>();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [proposalToConfirm, setProposalToConfirm] = useState<UnifiedProposal | undefined>();

  const TABS: Tab[] = [
    {
      id: "all",
      label: "Todas",
      icon: "layers",
      count: proposals?.length,
    },
    {
      id: "activity",
      label: "Actividades",
      icon: "local_activity",
      count: proposals?.filter((p) => p.type === "activity").length,
    },
    {
      id: "accommodation",
      label: "Alojamientos",
      icon: "hotel",
      count: proposals?.filter((p) => p.type === "accommodation").length,
    },
    {
      id: "transport",
      label: "Transporte",
      icon: "directions_car",
      count: proposals?.filter((p) => p.type === "transport").length,
    },
    {
      id: "inventory",
      label: "Inventario",
      icon: "inventory_2",
      count: proposals?.filter((p) => p.type === "inventory").length,
    },
  ];

  const filteredProposals =
    proposals?.filter((p) => activeTab === "all" || p.type === activeTab) || [];

  const handleCreate = (type: ProposalType) => {
    setFormType(type);
    setProposalToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (p: UnifiedProposal) => {
    setFormType(p.type);
    setProposalToEdit(p);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (p: UnifiedProposal) => {
    setProposalToDelete(p);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (!proposalToDelete) return;
    deleteProposal({ type: proposalToDelete.type, proposalId: proposalToDelete.id });
    setIsDeleteDialogOpen(false);
    setProposalToDelete(undefined);
  };

  const handleConfirmClick = (p: UnifiedProposal) => {
    setProposalToConfirm(p);
    setIsConfirmDialogOpen(true);
  };

  const onConfirmSubmit = () => {
    if (!proposalToConfirm) return;
    confirmProposal({
      type: proposalToConfirm.type,
      proposalId: proposalToConfirm.id,
      rawData: proposalToConfirm.rawData,
    });
    setIsConfirmDialogOpen(false);
    setProposalToConfirm(undefined);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProposalToEdit(undefined);
  };

  const fabItems = [
    {
      label: "Sugerir Actividad",
      icon: <Icon name="local_activity" fill />,
      onClick: () => handleCreate("activity"),
      variant: "primary" as const,
    },
    {
      label: "Sugerir Alojamiento",
      icon: <Icon name="hotel" fill />,
      onClick: () => handleCreate("accommodation"),
      variant: "terciary" as const,
    },
    {
      label: "Sugerir Transporte",
      icon: <Icon name="directions_car" fill />,
      onClick: () => handleCreate("transport"),
      variant: "secondary" as const,
    },
    {
      label: "Sugerir Inventario",
      icon: <Icon name="inventory_2" fill />,
      onClick: () => handleCreate("inventory"),
      variant: "secondary" as const,
    },
  ];

  if (isLoadingProposals || isLoadingParticipant) {
    return (
      <div className="p-6 text-center text-slate-500 animate-pulse">Cargando propuestas...</div>
    );
  }

  // Permissions
  const canConfirm = currentParticipant?.role === "owner" || currentParticipant?.role === "admin";
  const canEdit = false; // logic resolved in cards (creator)
  const canVote = true; // as long as they are participants

  return (
    <div className="flex flex-col h-full pb-24">
      <div className="px-4 py-3 sticky top-0 z-10">
        <FilterTabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="overflow-x-auto"
        />
      </div>

      <div className="px-4 flex-1">
        <ProposalList
          proposals={filteredProposals}
          currentUserUid={currentUser?.uid || ""}
          canEdit={canEdit}
          canConfirm={canConfirm}
          canVote={canVote}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onConfirm={handleConfirmClick}
          onVote={(p, vote) => {
            if (!currentUser) return;
            voteProposal({ type: p.type, proposalId: p.id, userId: currentUser.uid, vote });
          }}
        />
      </div>

      <FloatingActionButton items={fabItems} />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={`${proposalToEdit ? "Editar" : "Crear"} Propuesta de ${TABS.find((t) => t.id === formType)?.label}`}
        description={proposalToEdit ? "Modifica los datos de la propuesta." : "Completa los datos para crear la propuesta."}
      >
        <div className="p-4">
          {formType === "activity" && (
            <ActivityProposalForm
              tripId={tripId}
              initialData={proposalToEdit}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          )}
          {formType === "accommodation" && (
            <AccommodationProposalForm
              tripId={tripId}
              initialData={proposalToEdit}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          )}
          {formType === "transport" && (
            <TransportProposalForm
              tripId={tripId}
              initialData={proposalToEdit}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          )}
          {formType === "inventory" && (
            <InventoryProposalForm
              tripId={tripId}
              initialData={proposalToEdit}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          )}
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
        title="Eliminar Propuesta"
        message={`¿Estás seguro que deseas eliminar "${proposalToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={isDeleting}
      />

       {/* Confirm To Logistics/Timeline confirmation */}
       <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={onConfirmSubmit}
        title="Confirmar Propuesta"
        message={`¿Deseas confirmar "${proposalToConfirm?.title}" y moverla a al itinerario oficial o logística?`}
        confirmLabel="Confirmar Propuesta"
        variant="primary"
        isLoading={isConfirming}
      />
    </div>
  );
}


