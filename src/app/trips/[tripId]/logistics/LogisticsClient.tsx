"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { Icon } from "@/components/ui/Icon";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useParticipant } from "@/features/participants/hooks/useParticipant";
import { useParticipants } from "@/features/participants/hooks/useParticipants";
import { mailService } from "@/features/mail";
import {
  useAccommodations,
  useTransports,
  useInventory,
  useUpdateTransportPassengers,
  useUpdateInventoryStatus,
  useDeleteAccommodation,
  useDeleteTransport,
  useDeleteInventory,
} from "@/features/logistics/hooks/useLogistics";
import { ConfirmDialog } from "@/components/ui/dialog/ConfirmDialog/ConfirmDialog";
import { AccommodationConfirmed, TransportConfirmed, InventoryConfirmed } from "@/types/models";

import { AccommodationCard } from "@/features/logistics/components/AccommodationCard/AccommodationCard";
import { TransportCard } from "@/features/logistics/components/TransportCard/TransportCard";
import { InventoryList } from "@/features/logistics/components/InventoryList/InventoryList";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { AccommodationForm } from "@/features/logistics/components/AccommodationForm/AccommodationForm";
import { TransportForm } from "@/features/logistics/components/TransportForm/TransportForm";
import { InventoryForm } from "@/features/logistics/components/InventoryForm/InventoryForm";
import { PageHeader } from "@/components/ui/PageHeader";

interface LogisticsClientProps {
  tripId: string;
}

export function LogisticsClient({ tripId }: LogisticsClientProps) {
  const { currentUser } = useAuthStore();
  const { data: currentParticipant } = useParticipant(tripId, currentUser?.uid || "");
  const { data: participants } = useParticipants(tripId);

  const { data: accommodations, isLoading: loadingAcc } = useAccommodations(tripId);
  const { data: transports, isLoading: loadingTrans } = useTransports(tripId);
  const { data: inventory, isLoading: loadingInv } = useInventory(tripId);

  const { mutate: updatePassengers } = useUpdateTransportPassengers(tripId);
  const { mutate: updateInventory } = useUpdateInventoryStatus(tripId);

  const { mutate: deleteAcc, isPending: isDeletingAcc } = useDeleteAccommodation(tripId);
  const { mutate: deleteTrans, isPending: isDeletingTrans } = useDeleteTransport(tripId);
  const { mutate: deleteInv, isPending: isDeletingInv } = useDeleteInventory(tripId);

  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(
    urlTab && (urlTab === "accommodation" || urlTab === "transport" || urlTab === "inventory")
      ? urlTab
      : "accommodation"
  );

  const [activeModal, setActiveModal] = useState<
    "accommodation" | "transport" | "inventory" | null
  >(null);

  const [editingItem, setEditingItem] = useState<
    AccommodationConfirmed | TransportConfirmed | InventoryConfirmed | null
  >(null);

  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
    type: "accommodation" | "transport" | "inventory";
  } | null>(null);

  const TABS: Tab[] = [
    {
      id: "accommodation",
      label: "Alojamientos",
      icon: "hotel",
      count: accommodations?.length || 0,
    },
    {
      id: "transport",
      label: "Transporte",
      icon: "directions_car",
      count: transports?.length || 0,
    },
    {
      id: "inventory",
      label: "Inventario",
      icon: "inventory_2",
      count: inventory?.length || 0,
    },
  ];

  const isLoading = loadingAcc || loadingTrans || loadingInv;
  const isAdminOrOwner =
    currentParticipant?.role === "admin" || currentParticipant?.role === "owner";

  // Actions for FAB (future usage directly creating logistics)
  const fabItems = [
    {
      label: "Crear Alojamiento",
      icon: <Icon name="hotel" fill />,
      onClick: () => {
        setEditingItem(null);
        setActiveModal("accommodation");
      },
      variant: "primary" as const,
    },
    {
      label: "Crear Transporte",
      icon: <Icon name="directions_car" fill />,
      onClick: () => {
        setEditingItem(null);
        setActiveModal("transport");
      },
      variant: "secondary" as const,
    },
    {
      label: "Crear Ítem",
      icon: <Icon name="inventory_2" fill />,
      onClick: () => {
        setEditingItem(null);
        setActiveModal("inventory");
      },
      variant: "secondary" as const,
    },
  ];

  const handleJoinTransport = (transportId: string, join: boolean) => {
    if (!currentUser) return;
    const t = transports?.find((x) => x.id === transportId);
    if (!t) return;
    const currentPass = t.passengers || [];
    let newPass = [];
    if (join) {
      newPass = [...currentPass, currentUser.uid];
    } else {
      newPass = currentPass.filter((uid) => uid !== currentUser.uid);
    }
    updatePassengers({ transportId, newPassengers: newPass });
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "accommodation") {
      deleteAcc(itemToDelete.id);
    } else if (itemToDelete.type === "transport") {
      deleteTrans(itemToDelete.id);
    } else if (itemToDelete.type === "inventory") {
      deleteInv(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Cargando logística...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-24">
      <PageHeader title="Logística" description="Gestiona la logística del viaje" />
      <FilterTabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 space-y-4">
        {activeTab === "accommodation" && (
          <div className="space-y-4 mt-4">
            {accommodations?.length === 0 ? (
              <EmptyState
                title="No hay alojamientos definidos"
                description="Los alojamientos aparecerán aquí cuando se agreguen o se confirmen."
              />
            ) : (
              accommodations?.map((acc) => (
                <AccommodationCard
                  key={acc.id}
                  accommodation={acc}
                  tripId={tripId}
                  canEdit={isAdminOrOwner}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setActiveModal("accommodation");
                  }}
                  onDelete={(item) => {
                    setItemToDelete({ id: item.id, title: item.title, type: "accommodation" });
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "transport" && (
          <div className="space-y-4 mt-4">
            {transports?.length === 0 ? (
              <EmptyState
                title="No hay transportes definidos"
                description="Los transportes aparecerán aquí cuando se agreguen o se confirmen."
              />
            ) : (
              transports?.map((trans) => (
                <TransportCard
                  key={trans.id}
                  transport={trans}
                  tripId={tripId}
                  currentUserUid={currentUser?.uid || ""}
                  canEdit={isAdminOrOwner}
                  onJoin={handleJoinTransport}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setActiveModal("transport");
                  }}
                  onDelete={(item) => {
                    setItemToDelete({ id: item.id, title: item.title, type: "transport" });
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="mt-4">
            <InventoryList
              items={inventory || []}
              currentUserUid={currentUser?.uid || ""}
              canEdit={isAdminOrOwner}
              onStatusChange={(itemId, updates) => {
                updateInventory({ inventoryId: itemId, updates });

                // Trigger mail cuando se auto-asigna un ítem
                if (updates.status === "assigned" && updates.assignedTo) {
                  const assignee = participants?.find((p) => p.id === updates.assignedTo);
                  const assigner = participants?.find((p) => p.id === currentUser?.uid);
                  const item = inventory?.find((i) => i.id === itemId);

                  if (assignee?.email && item) {
                    mailService.sendItemAssignedMail({
                      to: assignee.email,
                      itemName: item.title || "Ítem",
                      tripName: "el viaje",
                      assignerName: assigner?.displayName || currentUser?.displayName || "Un participante",
                      category: item.category,
                      tripUrl: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/trips/${tripId}/logistics?tab=inventory`,
                    });
                  }
                }
              }}
              onEdit={(item) => {
                setEditingItem(item);
                setActiveModal("inventory");
              }}
              onDelete={(item) => {
                setItemToDelete({ id: item.id, title: item.title, type: "inventory" });
              }}
            />
          </div>
        )}
      </div>

      {isAdminOrOwner && <FloatingActionButton items={fabItems} />}

      {/* MODALS */}
      <Modal
        isOpen={activeModal === "accommodation"}
        onClose={() => {
          setActiveModal(null);
          setEditingItem(null);
        }}
        title={editingItem ? "Editar Alojamiento" : "Nuevo Alojamiento"}
        description={
          editingItem
            ? "Actualiza los detalles de tu alojamiento."
            : "Registra una reserva o crea una propuesta para votar."
        }
      >
        <AccommodationForm
          tripId={tripId}
          initialData={editingItem as AccommodationConfirmed}
          onSuccess={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "transport"}
        onClose={() => {
          setActiveModal(null);
          setEditingItem(null);
        }}
        title={editingItem ? "Editar Transporte" : "Nuevo Transporte"}
        description={
          editingItem
            ? "Actualiza los detalles del transporte sugerido."
            : "Agrega un trayecto compartido o una propuesta."
        }
      >
        <TransportForm
          tripId={tripId}
          initialData={editingItem as TransportConfirmed}
          onSuccess={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "inventory"}
        onClose={() => {
          setActiveModal(null);
          setEditingItem(null);
        }}
        title={editingItem ? "Editar Ítem de Inventario" : "Nuevo Ítem de Inventario"}
        description={
          editingItem
            ? "Actualiza los detalles del ítem."
            : "Agrega algo que necesiten llevar o una propuesta."
        }
      >
        <InventoryForm
          tripId={tripId}
          initialData={editingItem as InventoryConfirmed}
          onSuccess={() => setActiveModal(null)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Eliminar ${itemToDelete?.type === "accommodation" ? "Alojamiento" : itemToDelete?.type === "transport" ? "Transporte" : "Ítem"}`}
        message={`¿Estás seguro que deseas eliminar "${itemToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={isDeletingAcc || isDeletingTrans || isDeletingInv}
      />
    </div>
  );
}
