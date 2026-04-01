"use client";

import { useMemo } from "react";
import { useTripCosts } from "@/features/finances/hooks/useCosts";
import { simplifyDebts } from "@/features/finances/utils/debtSimplifier";
import { useTrip } from "@/features/trips/hooks/useTrip";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import type { DebtSummaryProps } from "./DebtSummary.types";
import { EmptyState } from "@/components/ui/EmptyState";

export function DebtSummary({ tripId }: DebtSummaryProps) {
  const { data: costs } = useTripCosts(tripId);
  const { data: trip } = useTrip(tripId);

  const transfers = useMemo(() => {
    if (!costs || costs.length === 0) return [];
    return simplifyDebts(costs);
  }, [costs]);

  // In MVP we use truncated UIDs. A real app would join with users.
  const formatName = (uid: string) => uid.substring(0, 6) + "...";

  if (!costs || costs.length === 0) {
    return (
      <EmptyState
        title="No hay gastos"
        description="No hay gastos registrados en este viaje."
        icon="receipt"
      />
    );
  }

  return (
    <NeumorphicCard className="p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Resumen de Deudas</h3>
      <p className="text-sm text-gray-500 mb-6">
        Sistema automático de simplificación (Splitwise-style). Minimiza transferencias cruzadas.
      </p>

      {transfers.length === 0 ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl">
          <p className="font-medium text-center">¡Están a mano! Nadie debe nada.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {transfers.map((tx, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-white dark:border-gray-700 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="font-semibold text-red-500">{formatName(tx.from)}</span>
                <span className="text-gray-400 text-sm">le debe pagar a</span>
                <span className="font-semibold text-green-500">{formatName(tx.to)}</span>
                <span className="ml-auto font-bold text-gray-800 dark:text-white">
                  {trip?.currency || "USD"} {tx.amount.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </NeumorphicCard>
  );
}
