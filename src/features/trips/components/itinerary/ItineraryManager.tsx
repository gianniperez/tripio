"use client";

import React, { useState, useEffect } from "react";
import { useEvents, useTrip } from "../../hooks";
import { TimelineView } from "./TimelineView";
import { CalendarView } from "./CalendarView";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Calendar, List, Loader2, AlertCircle, Settings } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant } from "@/types/tripio";
import { hasPermission } from "@/features/auth/utils/permissions";
import Link from "next/link";
import { NeumorphicButton } from "@/components/NeumorphicButton";

interface ItineraryManagerProps {
  tripId: string;
}

export const ItineraryManager = ({ tripId }: ItineraryManagerProps) => {
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
      <div className="flex justify-center">
        <NeumorphicCard className="p-1 flex items-center gap-1 bg-gray-50/50 rounded-2xl">
          <button
            onClick={() => setView("timeline")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              view === "timeline"
                ? "bg-white shadow-neumorphic-inset-sm text-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List size={18} />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              view === "calendar"
                ? "bg-white shadow-neumorphic-inset-sm text-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Calendar size={18} />
            <span>Calendario</span>
          </button>
        </NeumorphicCard>
      </div>

      {/* View Content */}
      <div className="min-h-[400px]">
        {missingDates ? (
          <NeumorphicCard className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center shadow-neumorphic-inset-sm">
              <AlertCircle size={32} className="text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-text-main">Fechas no definidas</h3>
              <p className="text-xs text-gray-500 max-w-[240px] mx-auto">
                Para visualizar el itinerario y calendario, el viaje debe tener
                fechas de inicio y fin confirmadas.
              </p>
            </div>
            {canEdit ? (
              <Link href={`/trips/${tripId}/settings`}>
                <NeumorphicButton>
                  <Settings size={18} />
                  <span>Configurar fechas</span>
                </NeumorphicButton>
              </Link>
            ) : (
              <p className="text-[10px] text-gray-400 italic">
                Contactá al organizador para definir las fechas.
              </p>
            )}
          </NeumorphicCard>
        ) : view === "timeline" && trip ? (
          <TimelineView events={events} trip={trip} />
        ) : trip ? (
          <CalendarView events={events} trip={trip} />
        ) : null}
      </div>
    </div>
  );
};
