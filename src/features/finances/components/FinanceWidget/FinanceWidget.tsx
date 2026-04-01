"use client";

import { Trip, Participant, Cost } from "@/types/models";
import { useMemo } from "react";
import { differenceInCalendarDays } from "date-fns";
import { calculateUserTotalCost } from "../../utils/debtSimplifier";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { clsx } from "clsx";

interface FinanceWidgetProps {
  trip: Trip;
  participant: Participant | null;
  costs: Cost[];
  userId: string;
}

export function FinanceWidget({ trip, participant, costs, userId }: FinanceWidgetProps) {
  const tripId = trip.id;

  const parseDate = (d: unknown) =>
    d &&
    typeof d === "object" &&
    "toDate" in d &&
    typeof (d as { toDate: () => Date }).toDate === "function"
      ? (d as { toDate: () => Date }).toDate()
      : new Date(d as string | number | Date);

  const myTotalCost = useMemo(() => calculateUserTotalCost(userId, costs), [userId, costs]);

  const { limit, suggestedPerDay, percentage, remaining } = useMemo(() => {
    const tripStart = trip.startDate ? parseDate(trip.startDate) : new Date();
    const tripEnd = trip.endDate ? parseDate(trip.endDate) : new Date();
    const days = Math.max(differenceInCalendarDays(tripEnd, tripStart) + 1, 1);

    const budgetLimit = participant?.budgetLimit || 0;
    const perDay = budgetLimit > 0 ? budgetLimit / days : 0;
    const pct = budgetLimit > 0 ? (myTotalCost / budgetLimit) * 100 : 0;
    const rem = Math.max(budgetLimit - myTotalCost, 0);

    return {
      limit: budgetLimit,
      suggestedPerDay: perDay,
      percentage: pct,
      remaining: rem,
    };
  }, [trip, participant, myTotalCost]);

  return (
    <Link
      href={`/trips/${tripId}/finances`}
      className="block w-full transition-all duration-300 hover:scale-[1.02] outline-none"
    >
      <div className="relative bg-linear-to-br from-secondary to-secondary-dark text-white rounded-tripio p-6 sm:p-8 shadow-cream flex flex-col justify-between min-h-[140px] md:min-h-[160px] overflow-hidden group">
        {/* Watermark Icon */}
        <Icon
          name="trending_up"
          size={280}
          className="absolute -top-4 right-10 text-white opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-110"
        />

        {/* Top Info */}
        <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black font-nunito leading-none mb-0.5">
              {trip.currency} {myTotalCost.toFixed(0)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold space-y-0.5 opacity-90 uppercase tracking-wide">
              Gasto Total
            </span>
          </div>

          <div className="text-[10px] sm:text-xs text-right font-bold space-y-0.5 opacity-90 uppercase tracking-wide">
            <p>
              Sugerido por día: {trip.currency} {suggestedPerDay.toFixed(0)}
            </p>
            <p>
              Presupuesto Total: {trip.currency} {limit.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="relative z-10 w-full">
          <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden relative">
            <div
              className={clsx(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                percentage > 100 ? "bg-red-400" : "bg-white"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">
            <span>{percentage.toFixed(0)}% consumido</span>
            <span>
              {myTotalCost > limit && limit > 0
                ? "¡Presupuesto Superado!"
                : limit === 0
                  ? "Sin presupuesto definido"
                  : `Quedan ${trip.currency} ${remaining.toFixed(0)}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
