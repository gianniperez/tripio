"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContextualInfoProps {
  title?: string;
  description: string;
  className?: string;
}

export const ContextualInfo = ({
  title,
  description,
  className,
}: ContextualInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside (important for mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block ml-1", className)} ref={containerRef}>
      <button
        type="button"
        className="text-slate-400 hover:text-primary transition-colors p-0.5 focus:outline-none"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="Más información"
      >
        <Info size={14} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute z-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white rounded-xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 pointer-events-none">
          {title && (
            <h5 className="font-bold text-xs text-slate-800 mb-1">{title}</h5>
          )}
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {description}
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-slate-100 rotate-45"></div>
        </div>
      )}
    </div>
  );
};
