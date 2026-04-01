import { Cost } from "@/types/models";

export interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export function simplifyDebts(costs: Cost[]): Transfer[] {
  const balances = new Map<string, number>();

  // 1. Calculate net balance for each participant
  costs.forEach((cost) => {
    // Add amounts paid by the user to their balance
    if (cost.paidBy) {
      Object.entries(cost.paidBy).forEach(([userId, amount]) => {
        balances.set(userId, (balances.get(userId) || 0) + amount);
      });
    }
    // Subtract amounts owed by the user from their balance
    if (cost.splitTo) {
      Object.entries(cost.splitTo).forEach(([userId, amount]) => {
        balances.set(userId, (balances.get(userId) || 0) - amount);
      });
    }
  });

  // 2. Separate into debtors and creditors
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  balances.forEach((balance, userId) => {
    // We use a small epsilon to avoid floating point precision issues
    if (balance < -0.01) {
      debtors.push({ id: userId, amount: -balance });
    } else if (balance > 0.01) {
      creditors.push({ id: userId, amount: balance });
    }
  });

  // Sort by amount descending to minimize transactions (heuristic)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];

  // 3. Greedy algorithm to simplify debts
  let i = 0; // index for debtors
  let j = 0; // index for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settleAmount = Math.min(debtor.amount, creditor.amount);

    transfers.push({
      from: debtor.id,
      to: creditor.id,
      amount: Number(settleAmount.toFixed(2)),
    });

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return transfers;
}

export function calculateUserTotalCost(userId: string, costs: Cost[]): number {
  return costs.reduce((total, cost) => {
    const userSplit = cost.splitTo?.[userId] || 0;
    return total + userSplit;
  }, 0);
}
