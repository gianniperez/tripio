"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import { ProposalsList } from "@/features/proposals/components/ProposalsList/ProposalsList";
import { InventoryForm } from "@/features/proposals/components";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { Proposal } from "@/features/proposals/types";
import {
  useCreateProposal,
  useUpdateProposal,
} from "@/features/proposals/hooks";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

export default function InventoryPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");
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

  return (
    <div className="space-y-6 pb-24">
      <PageHeader title="Inventario" />

      {/* Tabs */}
      <div className="max-w-md mx-auto px-4">
        <FilterTabBar
          tabs={[
            { id: "personal", label: "Personal", icon: <Icon name="person" /> },
            { id: "group", label: "Grupal", icon: <Icon name="group" /> },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as "personal" | "group")}
          className="bg-gray-100/50 shadow-neumorphic-inset-sm border-none"
        />
      </div>

      {/* Content */}
      <div className="px-4">
        <ProposalsList
          tripId={tripId}
          currentUserId={user?.uid || ""}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          typeFilter={["inventory"]}
          isPersonalFilter={activeTab === "personal"}
        />
      </div>

      <FloatingActionButton onClick={() => setIsFormOpen(true)} />

      {/* Creation/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={
          editingProposal
            ? "Editar Ítem"
            : `Añadir Ítem ${activeTab === "personal" ? "Personal" : "Grupal"}`
        }
      >
        <InventoryForm
          tripId={tripId}
          trip={trip}
          onClose={handleCloseForm}
          initialData={editingProposal}
          defaultIsPersonal={activeTab === "personal"}
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
