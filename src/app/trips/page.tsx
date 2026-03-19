"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/features/auth/hooks";
import { useTrips } from "@/features/trips/hooks";
import { CreateTripModal } from "@/features/trips/components/CreateTripModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Trip } from "@/types/tripio";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { SettingsModal } from "@/features/trips/components/SettingsModal/SettingsModal";
import { ConfirmDialog } from "@/components/ui/dialog/ConfirmDialog/ConfirmDialog";
import { useDeleteTrip, useCreateTrip } from "@/features/trips/hooks";

function TripCardInfo({ trip }: { trip: Trip }) {
  const hasDates = !!trip.startDate && !!trip.endDate;

  return (
    <div className="flex items-center gap-1 text-gray-300 text-sm font-medium font-inter">
      <Icon name="calendar_month" className="text-primary shrink-0" />
      {hasDates ? (
        <span>
          {format(trip.startDate!.toDate(), "d MMM", { locale: es })} -{" "}
          {format(trip.endDate!.toDate(), "d MMM", { locale: es })}
        </span>
      ) : (
        <span>Fechas por definir</span>
      )}
    </div>
  );
}

function MissingFieldsBadge({ trip }: { trip: Trip }) {
  const missing: string[] = [];
  if (!trip.startDate) missing.push("Fechas");

  if (missing.length === 0) return null;

  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
      <Icon name="help" className="w-3 h-3" />
      <span>{missing.length} por definir</span>
    </div>
  );
}

export default function TripsList() {
  const { user, loading: authLoading } = useAuth();
  const { data: trips, isLoading: tripsLoading } = useTrips(user?.uid);
  const deleteMutation = useDeleteTrip();
  const { mutate: createTrip } = useCreateTrip();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  const isLoading = authLoading || tripsLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 space-y-10 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-60 gap-4">
            <Icon
              name="progress_activity"
              size={62}
              className="text-primary animate-spin"
            />
            <p className="text-secondary-deep font-bold italic opacity-60">
              Cargando tus aventuras...
            </p>
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="space-y-10">
            <div className="glass-card bg-linear-to-r from-accent to-accent-dark px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="rounded-xl flex items-center justify-center text-primary-light">
                <Icon name="explore" size={42} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wide">
                  Viajes Activos
                </p>
                <p className="text-xl font-black text-white">
                  {
                    trips.filter(
                      (t) => !t.endDate || t.endDate.toDate() > new Date(),
                    ).length
                  }
                </p>
              </div>
            </div>

            {/* Next Trip Highlight (Optional if soon) */}
            {trips.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trips.map((trip) => (
                  <div key={trip.id} className="relative group">
                    <Link href={`/trips/${trip.id}`} className="block">
                      <NeumorphicCard className="p-0 overflow-hidden relative h-72 group-hover:shadow-2xl transition-all border-none rounded-3xl">
                        <MissingFieldsBadge trip={trip} />

                        {/* Cover Image */}
                        <div className="absolute inset-0">
                          <Image
                            src={
                              trip.coverImage ||
                              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"
                            }
                            alt={trip.name}
                            fill
                            priority
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-secondary-deep/90 via-black/10 to-transparent" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform group-hover:-translate-y-1">
                          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-md font-display tracking-tight leading-tight">
                            {trip.name}
                          </h2>
                          <TripCardInfo trip={trip} />
                        </div>
                      </NeumorphicCard>
                    </Link>

                    {/* Action Buttons */}
                    <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 z-10 transform transition-all translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingTripId(trip.id);
                        }}
                        className="cursor-pointer w-11 h-11 rounded-xl glass-card bg-white/20 border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-xl active:scale-95"
                        title="Editar viaje"
                      >
                        <Icon name="edit" size={24} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingTripId(trip.id);
                        }}
                        className="cursor-pointer w-11 h-11 rounded-xl glass-card bg-red-500/20 border-red-500/20 text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
                        title="Eliminar viaje"
                      >
                        <Icon name="delete" size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 glass-card rounded-tripio p-12">
            <div className="w-24 h-24 flex justify-center items-center bg-primary rounded-full">
              <Icon name="calendar_month" className="text-white" size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-secondary-deep font-display">
                ¿Listo para partir?
              </h3>
              <p className="text-secondary max-w-xs mx-auto text-lg">
                Aún no tienes viajes creados. ¡Empieza la aventura hoy mismo!
              </p>
            </div>
            <NeumorphicButton onClick={() => setIsModalOpen(true)}>
              Crear mi primer viaje
            </NeumorphicButton>
          </div>
        )}
      </main>

      {user && (
        <CreateTripModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={user.uid}
        />
      )}

      {editingTripId && (
        <SettingsModal
          isOpen={!!editingTripId}
          onClose={() => setEditingTripId(null)}
          tripId={editingTripId}
        />
      )}

      {deletingTripId && (
        <ConfirmDialog
          isOpen={!!deletingTripId}
          onClose={() => setDeletingTripId(null)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(deletingTripId);
            setDeletingTripId(null);
          }}
          title="Eliminar Viaje"
          message="¿Estás seguro? Esta acción no se puede deshacer y se borrarán todos los datos asociados (itinerario, finanzas, actividades, etc.)."
          confirmLabel="Eliminar"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}

      {trips && trips.length > 0 && (
        <FloatingActionButton
          onClick={() => setIsModalOpen(true)}
          isSubPage={false}
          ariaLabel="Crear nuevo viaje"
        />
      )}
    </div>
  );
}
