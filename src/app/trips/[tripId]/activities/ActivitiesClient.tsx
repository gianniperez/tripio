"use client";

import { useCallback, useEffect, useState } from "react";
import { tripService } from "@/features/trips/api/tripService";
import { Trip, Event } from "@/types/models";
import { ItineraryItem } from "@/features/trips/types";
import { ItineraryTimeline } from "@/features/trips/components/ItineraryTimeline/ItineraryTimeline";
import { ItineraryCalendar } from "@/features/trips/components/ItineraryCalendar/ItineraryCalendar";
import { ItineraryBacklog } from "@/features/trips/components/ItineraryBacklog/ItineraryBacklog";
import { ActivityForm } from "@/features/trips/components/ActivityForm";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { Icon } from "@/components/ui/Icon";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { PageHeader } from "@/components/ui/PageHeader";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { redirect } from "next/navigation";

interface ActivitiesClientProps {
  tripId: string;
}

export function ActivitiesClient({ tripId }: ActivitiesClientProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [backlog, setBacklog] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"timeline" | "calendar">("timeline");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tripData, itineraryData, backlogData] = await Promise.all([
        tripService.getTripById(tripId),
        tripService.getItineraryItems(tripId),
        tripService.getBacklogActivities(tripId),
      ]);
      setTrip(tripData);
      setItems(itineraryData);
      setBacklog(backlogData);
    } catch (err) {
      console.error("Error fetching activities data:", err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignDate = async (activity: Event) => {
    // Para el MVP, usaremos un prompt simple para pedir la fecha
    // En una fase posterior se usará un Modal con DatePicker
    const dateStr = window.prompt("Ingresa la fecha (YYYY-MM-DD) para: " + activity.title);
    if (dateStr) {
      const date = new Date(dateStr + "T12:00:00");
      if (!isNaN(date.getTime())) {
        try {
          await tripService.updateEventDate(tripId, activity.id, date);
          // Refetch data
          const [itineraryData, backlogData] = await Promise.all([
            tripService.getItineraryItems(tripId),
            tripService.getBacklogActivities(tripId),
          ]);
          setItems(itineraryData);
          setBacklog(backlogData);
        } catch {
          alert("Error al actualizar la fecha");
        }
      } else {
        alert("Fecha inválida");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Cargando itinerario...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header del Itinerario */}
      <header>
        <PageHeader title="Itinerario" />
        {trip && (
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <Icon name="event" size={14} />
            {trip.startDate ? (
              <>
                {format(
                  trip.startDate instanceof Date
                    ? trip.startDate
                    : (trip.startDate as Timestamp).toDate(),
                  "d 'de' MMM",
                  { locale: es }
                )}
                {" - "}
                {trip.endDate
                  ? format(
                      trip.endDate instanceof Date
                        ? trip.endDate
                        : (trip.endDate as Timestamp).toDate(),
                      "d 'de' MMM, yyyy",
                      { locale: es }
                    )
                  : "N/D"}
              </>
            ) : (
              "Fechas no definidas"
            )}
          </p>
        )}
      </header>

      {/* Selector de Vistas y Contenido condicionado a tener fechas */}
      {!trip?.startDate ? (
        <div className="mt-8">
          <EmptyState
            title="Aún no hay fechas definidas"
            description="Para visualizar el itinerario y calendario, ve a la configuración del viaje para definir cuándo será."
            action={
              <NeumorphicButton onClick={() => redirect(`/trips/${tripId}/settings`)}>
                <Icon name="settings" size={20} /> Configurar Fechas
              </NeumorphicButton>
            }
          />
        </div>
      ) : (
        <>
          <div className="my-6">
            <FilterTabBar
              tabs={[
                { id: "timeline", label: "Timeline", icon: "reorder" },
                { id: "calendar", label: "Calendario", icon: "calendar_month" },
              ]}
              activeTab={activeView}
              onTabChange={(id) => setActiveView(id as "timeline" | "calendar")}
            />
          </div>

          <main>
            {activeView === "timeline" ? (
              <ItineraryTimeline
                items={items}
                onItemClick={(item: ItineraryItem) => console.log("Click en item:", item)}
              />
            ) : (
              <ItineraryCalendar
                items={items}
                onDayClick={(date: Date) => console.log("Click en día:", date)}
              />
            )}

            <ItineraryBacklog activities={backlog} onAssignDate={handleAssignDate} />
          </main>
        </>
      )}

      <FloatingActionButton
        onClick={() => setIsModalOpen(true)}
        ariaLabel="Agregar actividad"
        icon={<Icon name="add" size={32} />}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Actividad"
        description="Agrega una actividad o propuesta para tu viaje."
      >
        <ActivityForm
          tripId={tripId}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />

      </Modal>
    </div>
  );
}
