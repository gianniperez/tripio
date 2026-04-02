"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NeumorphicActionMenuProps } from "./NeumorphicActionMenu.types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function NeumorphicActionMenu({
  options,
  trigger,
  className,
  align = "right",
}: NeumorphicActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative inline-block", className)} ref={menuRef}>
      {/* Trigger */}
      <div onClick={toggleMenu} className="cursor-pointer">
        {trigger || (
          <button
            className="h-8 w-8 cursor-pointer p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Opciones"
          >
            <Icon name="more_vert" size={20} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[140px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-cream dark:shadow-none border border-slate-100 dark:border-slate-700 p-1.5",
            "animate-in fade-in slide-in-from-top-2 duration-200",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                option.onClick(e);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                option.variant === "danger"
                  ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              {option.icon && <Icon name={option.icon} size={18} />}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
