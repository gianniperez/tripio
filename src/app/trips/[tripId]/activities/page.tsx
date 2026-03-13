"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import { ProposalsList } from "@/features/proposals/components/ProposalsList/ProposalsList";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { Proposal } from "@/features/proposals/types";
import {
  useCreateProposal,
  useUpdateProposal,
} from "@/features/proposals/hooks";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { ActivityForm } from "@/features/proposals/components";

export default function ActivitiesPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed">(
    "pending",
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | undefined>(
    undefined,
  );

  const { mutate: createProposal, isPending: isCreating } =
    useCreateProposal(tripId);
  const { mutate: updateProposal, isPending: isUpdating } =
    useUpdateProposal(tripId);

  const isAdmin = trip?.createdBy === user?.uid;

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

  const handleEdit = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProposal(undefined);
  };

  const tabs: Tab[] = [
    { id: "confirmed", label: "Confirmadas" },
    { id: "pending", label: "Pendientes" },
  ];

  return (
    <div className="space-y-10 pb-24 px-4 max-w-4xl mx-auto">
      <PageHeader
        title="Actividades"
        description="Explora actividades confirmadas o propuestas por el grupo."
      />

      {/* Tabs Selector */}
      <div className="max-w-md mx-auto">
        <FilterTabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as "pending" | "confirmed")}
        />
      </div>

      {/* Content */}
      <ProposalsList
        tripId={tripId}
        currentUserId={user?.uid || ""}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        typeFilter={["activity"]}
        statusFilter={
          activeTab === "pending" ? ["draft", "voted"] : ["confirmed"]
        }
      />

      <FloatingActionButton onClick={() => setIsFormOpen(true)} />

      {/* Creation/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingProposal ? "Editar Actividad" : "Crear Nueva Actividad"}
      >
        <ActivityForm
          tripId={tripId}
          trip={trip}
          onClose={handleCloseForm}
          initialData={editingProposal}
          onSubmit={(data) => {
            if (editingProposal) {
              updateProposal(
                { proposalId: editingProposal.id, ...data },
                { onSuccess: handleCloseForm },
              );
            } else {
              createProposal(
                { ...data, userId: user?.uid || "" },
                { onSuccess: handleCloseForm },
              );
            }
          }}
          isSubmitting={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
}
