"use client";

import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useTrip } from "@/features/trips/hooks/useTrip";
import {
  useParticipant,
  useUpdateParticipantBudget,
} from "@/features/participants/hooks/useParticipant";
import { useTripCosts } from "@/features/finances/hooks/useCosts";
import { calculateUserTotalCost } from "@/features/finances/utils/debtSimplifier";
import { BudgetProgressBar } from "@/components/BudgetProgressBar/BudgetProgressBar";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { CostForm, DebtSummary } from "@/features/finances/components";
import { Modal } from "@/components/ui/dialog/Modal";

export function FinancesView({ tripId }: { tripId: string }) {
  const { currentUser } = useAuthStore();
  const { data: trip } = useTrip(tripId);
  const { data: participant } = useParticipant(tripId, currentUser?.uid || "");
  const { data: costs } = useTripCosts(tripId);
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

  return (
    <div className="space-y-8 pb-20">
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Mi Presupuesto</h2>
        <BudgetProgressBar
          currentAmount={myTotalCost}
          limitAmount={limit}
          daysTotal={activeDaysTotal}
          currency={trip?.currency || "USD"}
          onUpdateLimit={handleUpdateLimit}
          isUpdating={updateParticipantMutation.isPending}
        />
      </section>

      <section>
        <DebtSummary tripId={tripId} />
      </section>

      {costs?.length !== 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Historial de Gastos
          </h2>
          <ul className="space-y-3">
            {costs?.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{c.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{c.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 dark:text-gray-100">
                    {trip?.currency || "USD"} {c.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Tú sumaste: {trip?.currency || "USD"}{" "}
                    {(c.splitTo?.[currentUser?.uid || ""] || 0).toFixed(2)}
                  </p>
                </div>
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
