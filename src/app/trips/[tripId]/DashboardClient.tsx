"use client";

import { useEffect, useState } from "react";
import { tripService } from "@/features/trips/api";
import {
  Trip,
  AccommodationConfirmed,
  TransportConfirmed,
  InventoryConfirmed,
  Participant,
  Cost,
} from "@/types/models";
import { TripStatusWidget } from "@/features/trips/components/TripStatusWidget";
import { proposalsService, UnifiedProposal } from "@/features/proposals/api/proposalsService";
import { DecisionHubWidget } from "@/features/proposals/components/DecisionHubWidget";
import { logisticsService } from "@/features/logistics/api/logisticsService";
import { LogisticsWidget } from "@/features/logistics/components/LogisticsWidget";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { participantService } from "@/features/participants/api/participantService";
import { costService } from "@/features/finances/api/costService";
import { FinanceWidget } from "@/features/finances/components";

export function DashboardClient({ tripId }: { tripId: string }) {
  const { currentUser } = useAuthStore();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [proposals, setProposals] = useState<UnifiedProposal[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationConfirmed[]>([]);
  const [transports, setTransports] = useState<TransportConfirmed[]>([]);
  const [inventory, setInventory] = useState<InventoryConfirmed[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const [tripData, proposalsData, accData, transData, invData, participantData, costsData] =
          await Promise.all([
            tripService.getTripById(tripId),
            proposalsService.getAllProposals(tripId),
            logisticsService.getAccommodations(tripId),
            logisticsService.getTransports(tripId),
            logisticsService.getInventory(tripId),
            participantService.getParticipant(tripId, currentUser.uid),
            costService.getTripCosts(tripId),
          ]);
        setTrip(tripData);
        setProposals(proposalsData);
        setAccommodations(accData);
        setTransports(transData);
        setInventory(invData);
        setCurrentParticipant(participantData);
        setCosts(costsData);
      } catch (error) {
        console.error("Error loading trip dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tripId, currentUser]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium font-inter">Cargando dashboard...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-500 rounded-xl">Viaje no encontrado</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pb-12">
      {/* Widget interactivo principal */}
      <TripStatusWidget trip={trip} />

      {/* Acceso al Centro de Decisiones (solo si hay pendientes) */}
      {proposals.length > 0 && <DecisionHubWidget proposals={proposals} tripId={tripId} />}

      {/* Status Tracker de Logística (solo en Planning) */}
      {trip.status === "planning" && (
        <LogisticsWidget
          trip={trip}
          accommodations={accommodations}
          transports={transports}
          inventory={inventory}
          proposals={proposals}
        />
      )}

      {/* Mis Finanzas (Widget de presupuesto personal) */}
      {currentUser && (
        <FinanceWidget
          trip={trip}
          participant={currentParticipant}
          costs={costs}
          userId={currentUser.uid}
        />
      )}

      {/* Otras secciones o widgets del dashboard pueden ir aquí de cara a futuro */}
    </div>
  );
}
