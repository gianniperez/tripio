"use client";

import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useTrip } from "@/features/trips/hooks/useTrip";
import { Cost } from "@/types/models";

import {
  useParticipant,
  useUpdateParticipantBudget,
} from "@/features/participants/hooks/useParticipant";
import { useTripCosts } from "@/features/finances/hooks/useCosts";
import { calculateUserTotalCost } from "@/features/finances/utils/debtSimplifier";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { CostForm, DebtSummary, BudgetProgressBar } from "@/features/finances/components";
import { Modal } from "@/components/ui/dialog/Modal";
import { Icon } from "@/components/ui/Icon";
import { useLinkableEntities, LinkableEntity } from "@/features/finances/hooks/useLinkableEntities";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

export function FinancesView({ tripId }: { tripId: string }) {
  const { currentUser } = useAuthStore();
  const { data: trip } = useTrip(tripId);
  const { data: participant } = useParticipant(tripId, currentUser?.uid || "");
  const { data: costs } = useTripCosts(tripId);
  const { entities } = useLinkableEntities(tripId);
  const updateParticipantMutation = useUpdateParticipantBudget(tripId, currentUser?.uid || "");

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Calcula el costo total que lleva gastado este usuario en el viaje
  const myTotalCost = currentUser && costs ? calculateUserTotalCost(currentUser.uid, costs) : 0;

  // Calculo de días totales para BudgetProgressBar
  const parseDate = (d: unknown) =>
    d &&
    typeof d === "object" &&
    "toDate" in d &&
    typeof (d as { toDate: () => Date }).toDate === "function"
      ? (d as { toDate: () => Date }).toDate()
      : new Date(d as string | number | Date);
  const tripStartDate = trip?.startDate ? parseDate(trip.startDate) : new Date();
  const tripEndDate = trip?.endDate ? parseDate(trip.endDate) : new Date();
  const activeDaysTotal = Math.max(differenceInCalendarDays(tripEndDate, tripStartDate) + 1, 1);

  const limit = participant?.budgetLimit || 0; // default safe limit

  const handleUpdateLimit = (newLimit: number) => {
    updateParticipantMutation.mutate(newLimit);
  };

  const getColor = (type: string | null) => {
    switch (type) {
      case "activity":
        return "bg-primary";
      case "accommodation":
        return "bg-primary-extralight";
      case "transport":
        return "bg-secondary";
      case "inventory":
        return "bg-accent";
      default:
        return "bg-primary";
    }
  };

  const getIcon = (type: string | null) => {
    switch (type) {
      case "activity":
        return "local_activity";
      case "accommodation":
        return "hotel";
      case "transport":
        return "directions_car";
      case "inventory":
        return "inventory_2";
      default:
        return "link";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <BudgetProgressBar
        currentAmount={myTotalCost}
        limitAmount={limit}
        daysTotal={activeDaysTotal}
        currency={trip?.currency || "USD"}
        onUpdateLimit={handleUpdateLimit}
        isUpdating={updateParticipantMutation.isPending}
      />

      <section>
        <DebtSummary tripId={tripId} />
      </section>

      {costs?.length !== 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Gastos</h2>
          <ul className="space-y-3">
            {costs?.map((c: Cost) => (
              <li key={c.id}>
                <NeumorphicCard>
                  <div>
                    <div className="flex items-center gap-2">
                      {c.linkedTo ? (
                        <div className={`flex items-center gap-1`}>
                          <div
                            className={`${getColor(c.linkedType)} text-white h-8 w-8 rounded-full flex items-center justify-center`}
                          >
                            <Icon name={getIcon(c.linkedType)} size={18} fill />
                          </div>
                          <p className="font-semibold text-gray-800">
                            {entities?.find(
                              (e: LinkableEntity) =>
                                e.id === (c.linkedTo?.split("-")[0] || c.linkedTo)
                            )?.title || "Relacionado"}
                          </p>
                        </div>
                      ) : (
                        <p className="font-semibold text-gray-800">{c.title}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-gray-100">
                      {trip?.currency || "USD"} {c.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tu gasto: {trip?.currency || "USD"}{" "}
                      {(c.splitTo?.[currentUser?.uid || ""] || 0).toFixed(2)}
                    </p>
                  </div>
                </NeumorphicCard>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FloatingActionButton onClick={() => setIsFormOpen(true)} />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Nuevo Gasto">
        <CostForm
          tripId={tripId}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
