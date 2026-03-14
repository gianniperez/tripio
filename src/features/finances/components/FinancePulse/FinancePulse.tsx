import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import type { FinancePulseProps } from "./FinancePulse.types";
import { cn } from "@/lib/utils";
import { formatMoney } from "../../utils/formatters";

export function FinancePulse({
  totalBudget,
  totalCollected,
  totalExpenses,
  startDate,
  endDate,
}: FinancePulseProps) {
  const expenseProgress =
    totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const expenseOverBudget = totalExpenses > totalBudget;

  // Calculate daily suggested budget
  let dailyBudget = 0;
  if (startDate && endDate && totalBudget > 0) {
    const toDate = (date: any) =>
      date?.toDate ? date.toDate() : new Date(date);
    const start = toDate(startDate);
    const end = toDate(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.max(
      1,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1,
    );
    const remainingBudget = Math.max(0, totalBudget - totalExpenses);
    dailyBudget = remainingBudget / diffDays;
  }

  return (
    <NeumorphicCard className="h-full flex flex-col p-5 bg-secondary relative overflow-hidden">
      <Icon
        name="trending_up"
        size={250}
        className="z-0 text-white opacity-20 absolute top-0 right-20"
      />
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {formatMoney(totalExpenses)}
            {expenseOverBudget && (
              <Icon name="warning" size={26} className="text-danger p-2" fill />
            )}
          </h1>
          <p className="text-white uppercase text-xs font-bold opacity-80">
            Gasto Total
          </p>
        </div>
        <div className="text-white text-[10px] md:text-xs uppercase font-bold opacity-80 text-right space-y-1">
          <p>Sugerido por Día: {formatMoney(dailyBudget)}</p>
          <p>Presupuesto total: {formatMoney(totalBudget)}</p>
        </div>
      </div>

      {/* Progreso de Gastos */}

      <div className="z-5 w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner flex my-2">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out rounded-full",
            expenseOverBudget
              ? "bg-linear-to-r from-danger to-primary"
              : "bg-linear-to-r from-primary to-primary-light",
          )}
          style={{ width: `${Math.min(expenseProgress, 100)}%` }}
        />
      </div>
      <div className="flex flex-col justify-between items-end">
        <p className="text-xs font-black text-white right-0">
          {Math.round(expenseProgress)}%
        </p>
      </div>
    </NeumorphicCard>
  );
}
