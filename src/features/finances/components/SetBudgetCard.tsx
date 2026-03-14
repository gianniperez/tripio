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
    <div className="bg-secondary text-white rounded-tripio p-6 shadow-neumorphic-color relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
              <Icon name="attach_money" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold font-nunito">Define un Presupuesto</h3>
              <p className="text-white/80 text-sm">
                Llevá un control personal de cuánto planeas gastar en este
                viaje.
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="cursor-pointer w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
            >
              <Icon name="close" className="w-4 h-4 text-white" />
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
            Guardar Presupuesto{" "}
            <Icon name="chevron_right" className="w-4 h-4" />
          </NeumorphicButton>
        </form>
      </div>
    </div>
  );
};
