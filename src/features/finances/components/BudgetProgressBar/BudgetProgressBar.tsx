"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BudgetProgressBarProps } from "./BudgetProgressBar.types";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";

export function BudgetProgressBar({
  currentAmount,
  limitAmount,
  daysTotal = 1,
  currency = "USD",
  className,
  onUpdateLimit,
  isUpdating = false,
}: BudgetProgressBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(limitAmount.toString());

  const safeLimit = limitAmount > 0 ? limitAmount : 1;
  const currentPercentage = Math.min((currentAmount / safeLimit) * 100, 100);

  const suggestedPerDay = limitAmount / daysTotal;
  const remainingTotal = Math.max(limitAmount - currentAmount, 0);

  const handleSave = () => {
    const val = Number(tempLimit);
    if (!isNaN(val) && onUpdateLimit) {
      onUpdateLimit(val);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempLimit(limitAmount.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className={twMerge(
          "relative bg-linear-to-br from-accent to-accent-dark text-white rounded-tripio p-6 shadow-cream flex flex-col gap-4 overflow-hidden animate-in fade-in zoom-in-95",
          className
        )}
      >
        <div className="flex justify-between items-start z-10">
          <div>
            <h3 className="font-bold text-lg leading-tight mb-1">Define un Presupuesto</h3>
            <p className="text-sm opacity-80 leading-snug">
              Llevá un control personal de cuánto planeas gastar en este viaje.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="w-10 h-10 flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors rounded-full text-white"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="relative z-10 mt-2">
          <div className="flex items-center px-4 py-3 bg-white/10 border border-white/20 rounded-2xl w-full focus-within:border-white/50 transition-colors">
            <span className="text-white/80 font-medium mr-2">{currency}</span>
            <input
              type="number"
              value={tempLimit}
              onChange={(e) => setTempLimit(e.target.value)}
              className="bg-transparent border-none outline-none text-white font-bold w-full text-xl placeholder:text-white/30"
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>

        <NeumorphicButton
          onClick={handleSave}
          disabled={isUpdating}
          variant="secondary"
          className="shadow-none"
        >
          {isUpdating ? "Guardando..." : "Guardar Presupuesto"}
        </NeumorphicButton>
      </div>
    );
  }

  // --- Main View (State 1) ---
  return (
    <div
      className={twMerge(
        "relative bg-linear-to-br from-secondary to-secondary-dark text-white rounded-tripio p-6 shadow-cream flex flex-col justify-between gap-6 overflow-hidden animate-in fade-in zoom-in-95",
        className
      )}
    >
      <Icon
        name="trending_up"
        size={350}
        className="absolute -top-12 right-0 text-white opacity-10 pointer-events-none"
      />
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 z-20 cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
      >
        <Icon name="edit" size={18} />
      </button>

      <div className="flex justify-between z-10 relative mt-8">
        <div className="flex flex-col items-start">
          <span className="text-4xl font-black font-nunito leading-none">
            {currency} {currentAmount.toFixed(0)}
          </span>
          <span className="mt-1 text-sm font-medium opacity-90">Gasto Total</span>
        </div>

        <div className="text-sm text-right font-medium">
          <p>
            Presupuesto: {currency} {limitAmount.toFixed(0)}
          </p>
          <p>
            Sugerido Por Día: {currency} {suggestedPerDay.toFixed(0)}
          </p>
        </div>
      </div>

      <div className="z-10 w-full mt-2">
        <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden relative mb-2">
          {/* Active Progress Bar */}
          <div
            className={clsx(
              "absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out",
              currentPercentage > 100
                ? "bg-red-400"
                : "bg-linear-to-r from-primary-light to-primary"
            )}
            style={{ width: `${currentPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-semibold opacity-90 mt-4">
          <span>{currentPercentage.toFixed(0)}% consumido</span>
          <span>
            {currentAmount > limitAmount
              ? "¡Superado!"
              : `Quedan ${currency} ${remainingTotal.toFixed(0)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
