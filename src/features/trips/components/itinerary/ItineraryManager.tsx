"use client";

import { useState, useEffect } from "react";
import { useEvents, useTrip } from "../../hooks";
import { TimelineView } from "./TimelineView";
import { CalendarView } from "./CalendarView";
import { Calendar, List, Loader2, Settings } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant } from "@/types/tripio";
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
  const { data: events, isLoading: isLoadingEvents } = useEvents(tripId);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
            icon: <List />,
          },
          {
            id: "calendar",
            label: "Calendario",
            icon: <Calendar />,
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
                  <Settings size={18} />
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
          <TimelineView events={events} trip={trip} />
        ) : trip ? (
          <CalendarView events={events} trip={trip} />
        ) : null}
      </div>
    </div>
  );
};
