"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface RequiresVotingSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
  title?: string;
  description?: string;
}

export function RequiresVotingSelector({
  value,
  onChange,
  title = "¿Requiere votación?",
  description = "Se requiere una votación grupal para confirmar esta propuesta.",
}: RequiresVotingSelectorProps) {
  return (
    <div
      className={cn(
        "p-5 transition-all duration-300 border-2 border-gray-200 rounded-tripio",
        value ? "border-primary/50 bg-primary/10" : "border-gray-200"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-nunito font-bold text-slate-800 leading-none">{title}</h4>
            <div className="text-primary-extralight hover:text-primary-dark transition-colors cursor-help group relative">
              <Icon name="info" size={16} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Las propuestas permiten que el equipo vote antes de confirmar la actividad.
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-inter">{description}</p>
        </div>

        {/* Custom Modern Switch */}
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus-visible:outline-hidden",
            value ? "bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" : "bg-slate-200"
          )}
          aria-pressed={value}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
              value ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
