/**
 * Simplifies a set of debts between users to minimize the number of transactions.
 * Uses a greedy approach balancing net positions.
 *
 * Result format: Record<fromUserId, Record<toUserId, amount>>
 */
export const simplifyDebts = (
  initialDebts: Record<string, Record<string, number>>,
): Record<string, Record<string, number>> => {
  const netBalances: Record<string, number> = {};

  // 1. Calculate net balance for each user
  // (how much they are owed - how much they owe)
  Object.entries(initialDebts).forEach(([fromUser, debts]) => {
    Object.entries(debts).forEach(([toUser, amount]) => {
      netBalances[fromUser] = (netBalances[fromUser] || 0) - amount;
      netBalances[toUser] = (netBalances[toUser] || 0) + amount;
    });
  });

  // 2. Separate into debtors (negative balance) and creditors (positive balance)
  const debtors: { uid: string; balance: number }[] = [];
  const creditors: { uid: string; balance: number }[] = [];

  Object.entries(netBalances).forEach(([uid, balance]) => {
    if (balance < -0.01) {
      debtors.push({ uid, balance });
    } else if (balance > 0.01) {
      creditors.push({ uid, balance });
    }
  });

  // Sort to optimize (optional, but good practice)
  debtors.sort((a, b) => a.balance - b.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const simplified: Record<string, Record<string, number>> = {};

  // 3. Match debtors and creditors
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const amount = Math.min(-debtor.balance, creditor.balance);

    if (amount > 0) {
      if (!simplified[debtor.uid]) simplified[debtor.uid] = {};
      simplified[debtor.uid][creditor.uid] = Number(amount.toFixed(2));
    }

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) dIdx++;
    if (Math.abs(creditor.balance) < 0.01) cIdx++;
  }

  return simplified;
};
