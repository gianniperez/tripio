"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { User, Users, Loader2 } from "lucide-react";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import { ProposalsList } from "@/features/proposals/components/ProposalsList/ProposalsList";
import { ProposalForm } from "@/features/proposals/components/ProposalForm/ProposalForm";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { Proposal } from "@/features/proposals/types";
import { useCreateProposal, useUpdateProposal } from "@/features/proposals/hooks";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

export default function InventoryPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | undefined>(undefined);

  const { mutate: createProposal, isPending: isCreating } = useCreateProposal(tripId);
  const { mutate: updateProposal, isPending: isUpdating } = useUpdateProposal(tripId);

  const isAdmin = trip?.createdBy === user?.uid;

  if (isLoadingTrip || !trip) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      <div className="flex gap-2 p-1 bg-gray-100/50 rounded-2xl shadow-neumorphic-inset-sm mx-4">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "personal"
              ? "bg-white shadow-neumorphic-sm text-primary"
              : "text-gray-400"
          }`}
        >
          <User size={16} />
          Personal
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "group"
              ? "bg-white shadow-neumorphic-sm text-primary"
              : "text-gray-400"
          }`}
        >
          <Users size={16} />
          Grupal
        </button>
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
        title={editingProposal ? "Editar Ítem" : `Añadir Ítem ${activeTab === "personal" ? "Personal" : "Grupal"}`}
      >
        <ProposalForm 
          tripId={tripId} 
          trip={trip}
          onClose={handleCloseForm}
          initialData={editingProposal || ({
            isPersonal: activeTab === "personal",
            requiresVoting: activeTab === "group",
            type: "inventory",
          } as Partial<Proposal> as Proposal)}
          defaultType="inventory"
          allowedTypes={["inventory"]}
          onSubmit={(data) => {
            if (editingProposal) {
              updateProposal({ proposalId: editingProposal.id, ...data }, { onSuccess: handleCloseForm });
            } else {
              createProposal({ ...data, userId: user?.uid || "" }, { onSuccess: handleCloseForm });
            }
          }}
          isSubmitting={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
}
