"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Calendar, MapPin, Loader2, HelpCircle } from "lucide-react";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/features/auth/hooks";
import { useTrips } from "@/features/trips/hooks";
import { CreateTripModal } from "@/features/trips/components/CreateTripModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Trip } from "@/types/tripio";

function TripCardInfo({ trip }: { trip: Trip }) {
  const hasDestination = !!trip.destination;
  const hasDates = !!trip.startDate && !!trip.endDate;

  return (
    <div className="flex flex-col gap-1 text-gray-200 text-sm font-medium font-inter">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        {hasDestination ? (
          <span>{trip.destination}</span>
        ) : (
          <span className="italic text-gray-400">Destino por definir</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-primary shrink-0" />
        {hasDates ? (
          <span>
            {format(trip.startDate!.toDate(), "d MMM", { locale: es })} -{" "}
            {format(trip.endDate!.toDate(), "d MMM", { locale: es })}
          </span>
        ) : (
          <span className="italic text-gray-400">Fechas por definir</span>
        )}
      </div>
    </div>
  );
}

function MissingFieldsBadge({ trip }: { trip: Trip }) {
  const missing: string[] = [];
  if (!trip.destination) missing.push("Destino");
  if (!trip.startDate) missing.push("Fechas");

  if (missing.length === 0) return null;

  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
      <HelpCircle className="w-3 h-3" />
      <span>{missing.length} por definir</span>
    </div>
  );
}

export default function TripsList() {
  const { user, loading: authLoading } = useAuth();
  const { data: trips, isLoading: tripsLoading } = useTrips(user?.uid);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = authLoading || tripsLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-secondary-deep tracking-tighter drop-shadow-sm font-display">
            Mis Viajes
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer group"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-secondary font-bold">
              Cargando tus aventuras...
            </p>
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block group"
              >
                <NeumorphicCard className="p-0 overflow-hidden relative h-64 group-hover:shadow-2xl transition-all border-none rounded-3xl">
                  {/* Missing fields badge */}
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
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-secondary-deep/90 via-black/20 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform group-hover:-translate-y-1">
                    <h2 className="text-2xl font-black text-white mb-2 drop-shadow-md font-display tracking-tight leading-tight">
                      {trip.name}
                    </h2>
                    <TripCardInfo trip={trip} />
                  </div>
                </NeumorphicCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 glass-card rounded-tripio p-12">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl text-primary rotate-3 transform transition-transform hover:rotate-0">
              <Calendar size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-secondary-deep tracking-tight font-display">
                ¿Listo para despegar?
              </h3>
              <p className="text-secondary max-w-xs mx-auto text-lg font-medium leading-relaxed">
                Aún no tienes viajes creados. ¡Empieza la aventura hoy mismo!
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-10 py-4 bg-primary text-white font-black text-lg rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all cursor-pointer"
            >
              Crear mi primer viaje
            </button>
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
    </div>
  );
}
