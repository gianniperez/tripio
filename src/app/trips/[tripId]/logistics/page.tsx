"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Loader2,
} from "lucide-react";
import { type ProposalType, type Proposal } from "@/features/proposals/types";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import { useCreateProposal, useUpdateProposal } from "@/features/proposals/hooks";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { ProposalForm } from "@/features/proposals/components/ProposalForm/ProposalForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { ProposalsList } from "@/features/proposals/components/ProposalsList/ProposalsList";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

export default function LogisticsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: loadingTrip } = useTrip(tripId);
  const { mutate: createProposal, isPending: isCreating } = useCreateProposal(tripId);
  const { mutate: updateProposal, isPending: isUpdating } = useUpdateProposal(tripId);

  const [activeTab, setActiveTab] = useState("confirmados");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<ProposalType>("accommodation");
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);

  if (loadingTrip || !trip) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Cargando logística...</p>
      </div>
    );
  }

  const handleOpenForm = (type: ProposalType = "accommodation") => {
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
  };

  const tabs: Tab[] = [
    { id: "confirmados", label: "Confirmados" },
    { id: "pendientes", label: "Pendientes" },
  ];

  const isAdmin = trip.createdBy === user?.uid;

  return (
    <div className="space-y-10 pb-24 px-4 max-w-4xl mx-auto">
      <PageHeader
        title="Logística"
        description="Destinos, alojamientos y transportes confirmados o en discusión."
      />

      {/* Tabs Selector */}
      <div className="max-w-md mx-auto">
        <FilterTabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content based on Active Tab */}
      <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProposalsList
          tripId={tripId}
          currentUserId={user?.uid || ""}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          typeFilter={["accommodation", "transport"]}
          statusFilter={activeTab === "confirmados" ? ["confirmed"] : ["draft", "voted"]}
        />
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        title={editingProposal ? "Editar" : "Nuevo"}
      >
        <ProposalForm 
          tripId={tripId} 
          trip={trip}
          onClose={handleCloseForm}
          initialData={editingProposal || ({ type: formType } as Partial<Proposal> as Proposal)}
          defaultType={formType}
          allowedTypes={["accommodation", "transport"]}
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

      <FloatingActionButton onClick={() => handleOpenForm()} />
    </div>
  );
}
