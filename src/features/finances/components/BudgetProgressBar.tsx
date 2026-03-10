import React from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface BudgetProgressBarProps {
  budgetLimit: number;
  currentCost: number;
  currency: string;
  onEdit?: () => void;
}

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const BudgetProgressBar = ({
  budgetLimit,
  currentCost,
  currency,
  onEdit,
}: BudgetProgressBarProps) => {
  const percentage = Math.min((currentCost / Math.max(budgetLimit, 1)) * 100, 100);
  const isOverBudget = currentCost > budgetLimit;
  const remaining = budgetLimit - currentCost;

  // Determine color based on progress
  let progressColor = "bg-primary";
  if (percentage >= 100) progressColor = "bg-red-500";
  else if (percentage > 85) progressColor = "bg-amber-500";

  return (
    <div className="bg-surface rounded-tripio p-5 shadow-neumorphic flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1 tracking-tight">Costo Proyectado</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-text-main font-nunito tracking-tighter">
              {formatMoney(currentCost, currency)}
            </span>
            {isOverBudget && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-1 cursor-pointer group" onClick={onEdit}>
            <p className="text-xs text-gray-400 font-medium tracking-tight group-hover:text-primary transition-colors">Presupuesto</p>
            {onEdit && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-primary transition-colors"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            )}
          </div>
          <p className="text-sm font-bold text-gray-600">
            {formatMoney(budgetLimit, currency)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-neumorphic-inset">
        <div
          className={`h-full ${progressColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between items-center text-sm font-medium tracking-tight">
        <span className={isOverBudget ? "text-red-500" : "text-gray-500"}>
          {percentage.toFixed(0)}% consumido
        </span>
        
        {isOverBudget ? (
          <div className="flex items-center gap-1 text-red-500">
            <TrendingUp className="w-4 h-4" />
            <span>Te pasaste por {formatMoney(Math.abs(remaining), currency)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingDown className="w-4 h-4" />
            <span>Quedan {formatMoney(remaining, currency)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
