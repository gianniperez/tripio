"use client";

import { useState, useEffect } from "react";
import { useTrip } from "../../hooks";
import { useProposals, useUpdateProposal } from "@/features/proposals/hooks";
import { Proposal, CreateProposalFormValues } from "@/features/proposals/types";
import { ProposalForm } from "@/features/proposals/components";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { TimelineView } from "./TimelineView";
import { CalendarView } from "./CalendarView";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/features/auth/hooks";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant, Event } from "@/types/tripio";
import { hasPermission } from "@/features/auth/utils/permissions";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { EmptyState } from "@/components/ui/EmptyState";

interface ItineraryManagerProps {
  tripId: string;
  onOpenSettings?: () => void;
}

export const ItineraryManager = ({
  tripId,
  onOpenSettings,
}: ItineraryManagerProps) => {
  const [view, setView] = useState<"timeline" | "calendar">("timeline");
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const { data: proposals, isLoading: isLoadingEvents } = useProposals(tripId);
  const { mutate: updateProposal, isPending: isUpdating } =
    useUpdateProposal(tripId);
  const { user } = useAuth();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (!tripId || !user) return;
    const q = query(
      collection(db, "trips", tripId, "participants"),
      where("uid", "==", user.uid),
    );
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setParticipant({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        } as Participant);
      }
    });
  }, [tripId, user]);

  const isLoading = isLoadingEvents || isLoadingTrip;
  const canEdit = hasPermission(participant, "edit_itinerary");
  const missingDates = !trip?.startDate || !trip?.endDate;

  const [editingItem, setEditingItem] = useState<Proposal | null>(null);

  // Map proposals to Events and separate Backlog
  const confirmedProposals =
    proposals?.filter((p: Proposal) => p.status === "confirmed") || [];
  const timelineItems = confirmedProposals.filter((p: Proposal) => p.startDate);
  const backlogItems = confirmedProposals.filter(
    (p: Proposal) =>
      !p.startDate && p.type !== "inventory",
  );

  const mappedEvents: Event[] = timelineItems.map(
    (p: Proposal) =>
      ({
        id: p.id,
        title: p.title,
        description: p.description,
        date: p.startDate!,
        startTime: p.startDate,
        endTime: p.endDate,
        location: p.location,
        locationUrl: p.locationUrl,
        category: p.type,
        costImpact: p.estimatedCost,
        rsvp: p.votes || {},
        linkedProposalId: p.id,
        destinationId: null,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
      }) as Event,
  );

  const handleUpdateProposal = (data: CreateProposalFormValues) => {
    if (editingItem) {
      updateProposal(
        { ...data, proposalId: editingItem.id },
        {
          onSuccess: () => setEditingItem(null),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Icon name="progress_activity" className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500 text-sm font-medium">
          Cargando itinerario...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <FilterTabBar
        tabs={[
          {
            id: "timeline",
            label: "Timeline",
            icon: <Icon name="list" />,
          },
          {
            id: "calendar",
            label: "Calendario",
            icon: <Icon name="calendar_month" />,
          },
        ]}
        activeTab={view}
        onTabChange={(id) => setView(id as "timeline" | "calendar")}
      />

      {/* View Content */}
      <div className="min-h-[400px]">
        {missingDates ? (
          <EmptyState
            title="Fechas no definidas"
            description="Para visualizar el itinerario y calendario, el viaje debe tener fechas de inicio y fin confirmadas."
            action={
              canEdit ? (
                <NeumorphicButton onClick={onOpenSettings}>
                  <Icon name="settings" size={18} />
                  <span>Configurar fechas</span>
                </NeumorphicButton>
              ) : (
                <p className="text-[10px] text-gray-400 italic">
                  Contactá al organizador para definir las fechas.
                </p>
              )
            }
          />
        ) : view === "timeline" && trip ? (
          <TimelineView
            events={mappedEvents}
            trip={trip}
            tripId={tripId}
          />
        ) : trip ? (
          <CalendarView events={mappedEvents} trip={trip} />
        ) : null}
      </div>

      {backlogItems.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
            <Icon name="calendar_month" className="w-4 h-4 text-amber-500" />
            Pendientes de asignar fecha
          </h3>
          <div className="space-y-3">
            {backlogItems.map((item: Proposal) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {item.type}
                  </span>
                  <p className="font-bold text-sm text-slate-700 leading-tight mt-0.5">
                    {item.title}
                  </p>
                </div>
                <NeumorphicButton
                  variant="secondary"
                  className="px-4 py-2 text-[10px] font-bold shadow-sm whitespace-nowrap ml-2"
                  onClick={() => setEditingItem(item)}
                >
                  Asignar fecha
                </NeumorphicButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editing Modal for Backlog items */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title="Asignar Fecha"
          description="Añade una fecha para que aparezca en el itinerario."
        >
          <ProposalForm
            onSubmit={handleUpdateProposal}
            isSubmitting={isUpdating}
            initialData={editingItem}
            tripId={tripId}
            trip={trip!}
          />
        </Modal>
      )}
    </div>
  );
};
