import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";

interface SetBudgetCardProps {
  onSetBudget: (amount: number) => void;
  currency: string;
  initialBudget?: number;
  onCancel?: () => void;
}

export const SetBudgetCard = ({
  onSetBudget,
  currency,
  initialBudget,
  onCancel,
}: SetBudgetCardProps) => {
  const [amount, setAmount] = useState(
    initialBudget ? initialBudget.toString() : "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onSetBudget(parsedAmount);
    }
  };

  return (
    <div className="bg-linear-to-br from-accent to-accent-dark text-white h-full rounded-tripio p-6 shadow-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-bold font-nunito">Define un Presupuesto</h3>
              <p className="text-white/80 text-sm">
                Llevá un control personal de cuánto planeas gastar en este
                viaje.
              </p>
            </div>
          </div>
          {onCancel && (
            <button onClick={onCancel}>
              <Icon
                name="close"
                className="flex text-white justify-center align-center cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <div className="flex items-center bg-white/10 rounded-tripio px-4 py-3 backdrop-blur-sm border border-white/20 focus-within:border-white/50 transition-colors">
            <span className="text-white/70 font-bold mr-2">{currency}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent text-xl font-bold text-white placeholder:text-white/40 focus:outline-none w-full"
            />
          </div>
          <NeumorphicButton
            type="submit"
            disabled={!amount || isNaN(parseFloat(amount))}
            variant="secondary"
            className="shadow-transparent"
          >
            Guardar Presupuesto
          </NeumorphicButton>
        </form>
      </div>
    </div>
  );
};
