import React from "react";
import { cn } from "@/lib/utils";

interface NeumorphicToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const NeumorphicToggle = ({
  checked,
  onChange,
  label,
  className,
}: NeumorphicToggleProps) => {
  return (
    <div
      className={cn("flex items-center gap-3 py-2 cursor-pointer select-none", className)}
      onClick={() => onChange(!checked)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-hidden",
          checked
            ? "bg-primary shadow-primary-inset"
            : "bg-white shadow-gray-inset border border-gray-100"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && <span className="text-sm font-semibold text-text-main">{label}</span>}
    </div>
  );
};
