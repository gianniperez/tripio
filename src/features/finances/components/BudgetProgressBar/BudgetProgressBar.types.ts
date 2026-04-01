export interface BudgetProgressBarProps {
  currentAmount: number;
  limitAmount: number;
  daysTotal?: number;
  currency?: string;
  className?: string;
  onUpdateLimit?: (newLimit: number) => void;
  isUpdating?: boolean;
}
