import React from "react";
import { Timestamp } from "firebase/firestore";
import { differenceInDays } from "date-fns";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

interface DailyBudgetCardProps {
  budgetLimit: number;
  currentCost: number;
  currency: string;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
}

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const DailyBudgetCard = ({
  budgetLimit,
  currentCost,
  currency,
  startDate,
  endDate,
}: DailyBudgetCardProps) => {
  if (!startDate || !endDate) {
    return (
      <NeumorphicCard className="p-4 flex items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 shadow-neumorphic-inset">
          <Icon name="calendar_month" className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-700">Presupuesto Diario</p>
          <p className="text-xs text-gray-400 truncate">
            Define fechas del viaje
          </p>
        </div>
      </NeumorphicCard>
    );
  }

  const days = Math.max(
    1,
    differenceInDays(endDate.toDate(), startDate.toDate()) + 1,
  );
  const remainingBudget = Math.max(0, budgetLimit - currentCost);
  const dailyBudget = remainingBudget / days;

  return (
    <NeumorphicCard className="p-4 flex items-center gap-4 w-full">
      <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center shrink-0 shadow-neumorphic-inset">
        <Icon name="payments" className="w-6 h-6 text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-bold mb-0.5">
          Sugerido por día
        </p>
        <p className="text-xl font-black text-text-main font-nunito tracking-tight truncate">
          {formatMoney(dailyBudget, currency)}
        </p>
      </div>
      <div className="text-right shrink-0 bg-surface px-3 py-1.5 rounded-lg shadow-neumorphic">
        <p className="text-xs text-gray-500 font-semibold">{days} días</p>
      </div>
    </NeumorphicCard>
  );
};
