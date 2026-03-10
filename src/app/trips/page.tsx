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
    <div className="flex flex-col min-h-screen bg-[--bg-color] relative overflow-hidden">
      <TopBar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[--text-color] tracking-tight">
            Mis Viajes
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium">Cargando tus viajes...</p>
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block group"
              >
                <NeumorphicCard className="p-0 overflow-hidden relative h-48 group-hover:shadow-neumorphic-sm transition-all border-none">
                  {/* Missing fields badge */}
                  <MissingFieldsBadge trip={trip} />

                  {/* Cover Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={trip.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"}
                      alt={trip.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h2 className="text-xl font-bold text-white mb-1 drop-shadow-md font-nunito">
                      {trip.name}
                    </h2>
                    <TripCardInfo trip={trip} />
                  </div>
                </NeumorphicCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-neumorphic text-gray-300">
              <Calendar size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text-main">No tienes viajes aún</h3>
              <p className="text-gray-500 max-w-[250px]">
                ¡Comienza tu próxima aventura creando un nuevo viaje!
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-6 py-3 bg-primary text-white font-bold rounded-tripio shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all cursor-pointer"
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
