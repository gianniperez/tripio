"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { TripList } from "@/features/trips/components/TripList";
import { CreateTripModal } from "@/features/trips/components/CreateTripModal";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Icon } from "@/components/ui/Icon";
import { tripService } from "@/features/trips/api";
import { Trip } from "@/types/models";
import { Timestamp } from "firebase/firestore";

export default function TripsPage() {
  const { currentUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const fetchTrips = async () => {
      try {
        const data = await tripService.getTripsByUser(currentUser.uid);
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips summary:", err);
      }
    };
    fetchTrips();
  }, [currentUser?.uid]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="bg-linear-to-r from-accent to-accent-dark px-4 py-3 rounded-3xl flex items-center gap-3">
          <div className="flex items-center justify-center text-primary-light">
            <Icon name="explore" size={42} />
          </div>
          <div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wide">
              Viajes Activos
            </p>
            <p className="text-xl font-black text-white">
              {
                trips.filter((t) => {
                  if (!t.endDate) return true;
                  const endDate =
                    t.endDate instanceof Timestamp
                      ? t.endDate.toDate()
                      : new Date(t.endDate as unknown as string);
                  return endDate > new Date();
                }).length
              }
            </p>
          </div>
        </div>

        <FloatingActionButton onClick={() => setIsModalOpen(true)} />
        <section>
          <TripList userId={currentUser?.uid} />
        </section>

        <CreateTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
}
