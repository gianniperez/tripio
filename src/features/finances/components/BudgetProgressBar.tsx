import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "../utils/formatters";
import { differenceInDays, parseISO, isDate } from "date-fns";

interface BudgetProgressBarProps {
  budgetLimit: number;
  currentCost: number;
  currency: string;
  startDate: any;
  endDate: any;
  onEdit?: () => void;
}

const ensureDate = (date: any): Date | null => {
  if (!date) return null;
  if (isDate(date)) return date;
  if (typeof date.toDate === "function") return date.toDate();
  if (typeof date === "string") return parseISO(date);
  return null;
};

export const BudgetProgressBar = ({
  budgetLimit,
  currentCost,
  currency,
  startDate,
  endDate,
  onEdit,
}: BudgetProgressBarProps) => {
  const percentage = Math.min(
    (currentCost / Math.max(budgetLimit, 1)) * 100,
    100,
  );
  const isOverBudget = currentCost > budgetLimit;
  const remaining = budgetLimit - currentCost;

  // Calculate days for the suggested daily budget
  const start = ensureDate(startDate);
  const end = ensureDate(endDate);

  const days = start && end ? Math.max(differenceInDays(end, start) + 1, 1) : 1;
  const dailySuggestion = budgetLimit / days;

  // Determine color based on progress
  let progressColor = "bg-primary";
  if (percentage >= 100) progressColor = "bg-danger";
  else if (percentage > 85) progressColor = "bg-amber-500";

  return (
    <div className="relative bg-linear-to-br from-secondary to-secondary-dark text-white h-full rounded-tripio p-6 shadow-cream flex flex-col justify-between gap-4 overflow-hidden">
      <Icon
        name="trending_up"
        size={350}
        className="absolute top-0 right-0 text-white opacity-10 z-0 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <div>
                <span className="text-3xl font-black font-nunito tracking-tighter">
                  {formatMoney(currentCost, currency)}
                </span>
                {isOverBudget && (
                  <Icon
                    name="warning"
                    size={24}
                    className=" ml-3 text-danger"
                  />
                )}
                <p className="mb-1 text-sm opacity-90">Gasto Total</p>
              </div>
            </div>
          </div>
          <div
            onClick={onEdit}
            className="group text-right items-top gap-2 cursor-pointer z-20"
          >
            <Icon
              name="edit"
              size={18}
              className="group-hover:text-success group-hover:opacity-100"
            />
            <div className=" flex flex-col items-end gap-1.5 mb-1 group">
              <p className="transition-all text-sm opacity-90">
                Presupuesto: {formatMoney(budgetLimit, currency)}
              </p>
              <p className="tracking-tight text-sm opacity-90">
                Sugerido Por Día: {formatMoney(dailySuggestion, currency)}
              </p>
            </div>
          </div>
        </div>

        <div>
          {/* Progress Bar */}
          <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden mb-3 text-[0px]">
            <div
              className={`h-full ${progressColor} transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Footer Stats */}
          <div className="flex justify-between items-center text-sm opacity-90">
            <span>{percentage.toFixed(0)}% consumido</span>

            {isOverBudget ? (
              <span>
                Te pasaste por {formatMoney(Math.abs(remaining), currency)}
              </span>
            ) : (
              <span>Quedan {formatMoney(remaining, currency)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
