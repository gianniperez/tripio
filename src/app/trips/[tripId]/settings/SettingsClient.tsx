"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { EditTripForm } from "@/features/trips/components/EditTripForm";
import { ParticipantsPanel } from "@/features/participants/components/ParticipantsPanel/ParticipantsPanel";
import { tripService } from "@/features/trips/api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { participantService } from "@/features/participants/api/participantService";
import { Trip } from "@/types/models";
import { ParticipantWithUser } from "@/features/participants/types";
import { useRouter } from "next/navigation";

export function SettingsClient({ tripId }: { tripId: string }) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettingsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tripData, participantsData] = await Promise.all([
        tripService.getTripById(tripId),
        participantService.getParticipants(tripId),
      ]);

      setTrip(tripData);
      setParticipants(participantsData);
    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium font-inter">Cargando configuración...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-500 rounded-xl">Viaje no encontrado</div>
    );
  }

  const currentUserRole = participants.find((p) => p.id === currentUser.uid)?.role || "viewer";

  return (
    <div className="mt-8">
      <FilterTabBar
        tabs={[
          { id: "general", label: "General", icon: "settings" },
          { id: "participants", label: "Participantes", icon: "group", count: participants.length },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      <div className="mt-8">
        {activeTab === "general" ? (
          <EditTripForm
            trip={trip}
            userRole={currentUserRole}
            onSuccess={() => {
              // Optionally refresh or show a success toast here
              fetchSettingsData();
            }}
            onDelete={() => {
              // Redirect to home safely
              router.push("/");
            }}
          />
        ) : (
          <ParticipantsPanel
            participants={participants}
            currentUserId={currentUser.uid}
            tripId={tripId}
          />
        )}
      </div>
    </div>
  );
}
