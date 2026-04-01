"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NeumorphicSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const NeumorphicSelect = forwardRef<HTMLSelectElement, NeumorphicSelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-600 ml-1">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-slate-50 rounded-2xl transition-all duration-200 outline-none appearance-none",
              "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]",
              "focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.9),0_0_0_2px_rgba(var(--primary-rgb),0.2)]",
              error ? "border border-danger/50 shadow-danger/5" : "border-none",
              "text-slate-700 font-medium",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-rounded">expand_more</span>
          </div>
        </div>
        {error && (
          <span className="text-xs text-danger ml-1 font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

NeumorphicSelect.displayName = "NeumorphicSelect";
