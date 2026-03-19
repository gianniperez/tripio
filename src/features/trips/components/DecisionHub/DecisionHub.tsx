import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import type { DecisionHubProps } from "./DecisionHub.types";

export function DecisionHub({ tripId, count, categories }: DecisionHubProps) {
  const hasDecisions = count > 0;

  const CategoryPill = ({
    label,
    count,
  }: {
    icon: string;
    label: string;
    count: number;
  }) => (
    <div className="flex flex-col items-center justify-center p-2 py-6 rounded-2xl border transition-all bg-white/10 border-white/20 text-white">
      <span className="font-bold uppercase leading-none mb-1">{count}</span>
      <span className="text-[10px] font-bold uppercase opacity-60">
        {label}
      </span>
    </div>
  );

  return (
    <NeumorphicCard className="relative overflow-hidden transition-all border-none h-full flex flex-col justify-between p-6 bg-primary text-white shadow-primary/20 shadow-cream">
      <div className="flex items-center gap-4 relative z-10 mb-4">
        <div className="flex-1 text-left">
          <h3 className="font-bold font-nunito text-white">
            Centro de Decisiones
          </h3>
          <p className="text-white/80 text-sm">
            {hasDecisions
              ? `Hay ${count} propuesta${count > 1 ? "s" : ""} pendientes!`
              : "No hay propuestas pendientes!"}
          </p>
        </div>
      </div>

      {/* Sub-cards by category */}
      <div className="grid grid-cols-3 gap-4 relative z-10 w-full">
        <CategoryPill
          icon="attractions"
          label="Actividades"
          count={categories.activity}
        />
        <CategoryPill
          icon="business_center"
          label="Logística"
          count={categories.logistics}
        />
        <CategoryPill
          icon="backpack"
          label="Inventario"
          count={categories.inventory}
        />
      </div>
    </NeumorphicCard>
  );
}
