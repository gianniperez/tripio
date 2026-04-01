import React from "react";
import { Icon } from "@/components/ui/Icon";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const FilterTabBar = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: FilterTabBarProps) => {
  return (
    <div
      className={`w-full bg-white flex p-2 rounded-tripio shadow-sm border border-slate-100 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer flex items-center justify-center py-2.5 transition-all duration-300 rounded-tripio text-xs font-bold ${
              isActive
                ? "bg-white text-primary shadow-soft flex-[2] px-4"
                : "text-slate-500 hover:text-slate-700 flex-1 px-2"
            }`}
            aria-pressed={isActive}
          >
            {tab.icon && (
              <span
                className={`w-4 h-4 flex items-center justify-center transition-all duration-300 ${isActive ? "mr-2" : ""}`}
              >
                <Icon name={tab.icon as string} size={20} />
              </span>
            )}
            {isActive && (
              <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap truncate">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 opacity-60 font-medium">({tab.count})</span>
                )}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
