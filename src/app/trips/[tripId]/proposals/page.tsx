"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTrip } from "@/features/trips/hooks";
import { useAuthStore } from "@/features/auth/stores";
import {
  useCreateProposal,
  useUpdateProposal,
} from "@/features/proposals/hooks";
import { ProposalsList, ProposalForm } from "@/features/proposals/components";
import { Plus, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreateProposalFormValues, Proposal } from "@/features/proposals/types";

export default function TripProposals() {
  const params = useParams<{ tripId: string }>();
  const { data: trip, isLoading: isTripLoading } = useTrip(params.tripId);
  const { user } = useAuthStore();
  const { mutate: createProposal, isPending: isCreating } = useCreateProposal(
    params.tripId,
  );
  const { mutate: updateProposal, isPending: isUpdating } = useUpdateProposal(
    params.tripId,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || undefined;

  // Auto-open the modal when coming from logistics with ?open=true
  useEffect(() => {
    if (searchParams.get("open") === "true" && !isModalOpen) {
      setIsModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isTripLoading || !user) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return <div className="text-center p-8">Viaje no encontrado.</div>;
  }

  // Determine if user has admin rights. In MVP, owner or specific roles.
  // We'll treat owner as admin for confirming proposals.
  const isAdmin = trip.createdBy === user.uid; // Simple check for MVP

  const handleCreateOrUpdate = (data: CreateProposalFormValues) => {
    if (editingProposal) {
      updateProposal(
        { ...data, proposalId: editingProposal.id },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingProposal(null);
          },
        },
      );
    } else {
      createProposal(
        { ...data, userId: user.uid },
        {
          onSuccess: () => setIsModalOpen(false),
        },
      );
    }
  };

  const openCreateModal = () => {
    setEditingProposal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Propuestas"
        description="Vota y organiza el viaje"
        actionButton={{
          icon: <Plus className="w-6 h-6 text-white" />,
          onClick: openCreateModal,
          ariaLabel: "Nueva propuesta",
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProposal ? "Editar Propuesta" : "Nueva Propuesta"}
        description={
          editingProposal
            ? "Ajusta los detalles de tu idea"
            : "Comparte una idea"
        }
      >
        <ProposalForm
          onSubmit={handleCreateOrUpdate}
          isSubmitting={isCreating || isUpdating}
          initialData={editingProposal || undefined}
          tripId={params.tripId}
          trip={trip}
          defaultType={!editingProposal ? defaultType : undefined}
        />
      </Modal>

      <div className="mt-4 animate-in fade-in duration-300">
        <ProposalsList
          tripId={params.tripId}
          currentUserId={user.uid}
          isAdmin={isAdmin}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
