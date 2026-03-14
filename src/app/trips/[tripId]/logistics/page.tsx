"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { type ProposalType, type Proposal } from "@/features/proposals/types";
import { useTrip } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import {
  useCreateProposal,
  useUpdateProposal,
} from "@/features/proposals/hooks";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { LogisticsForm } from "@/features/proposals/components";
import { getLogisticsFormConfig } from "@/features/proposals/data/logisticsForms";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { ProposalsList } from "@/features/proposals/components/ProposalsList/ProposalsList";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

export default function LogisticsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { data: trip, isLoading: loadingTrip } = useTrip(tripId);
  const { mutate: createProposal, isPending: isCreating } =
    useCreateProposal(tripId);
  const { mutate: updateProposal, isPending: isUpdating } =
    useUpdateProposal(tripId);

  const [activeTab, setActiveTab] = useState("confirmados");
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
  };

  const tabs: Tab[] = [
    { id: "pendientes", label: "Pendientes" },
    { id: "confirmados", label: "Confirmadas" },
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
          statusFilter={
            activeTab === "confirmados" ? ["confirmed"] : ["draft", "voted"]
          }
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={
          editingProposal
            ? `Editar ${getLogisticsFormConfig(editingProposal.type).title}`
            : formType
              ? `Crear Nuevo ${getLogisticsFormConfig(formType).title}`
              : "Crear Nueva Propuesta"
        }
        description={
          getLogisticsFormConfig(formType || editingProposal?.type || null)
            .description
        }
      >
        <LogisticsForm
          tripId={tripId}
          trip={trip}
          onClose={handleCloseForm}
          initialData={editingProposal || undefined}
          defaultType={formType as "accommodation" | "transport" | null}
          onTypeChange={setFormType}
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

      <FloatingActionButton onClick={() => handleOpenForm(null)} />
    </div>
  );
}
