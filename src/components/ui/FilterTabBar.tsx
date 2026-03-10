import React from "react";

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
      className={`bg-slate-100 flex p-2 rounded-tripio sticky top-20 z-10 backdrop-blur-sm border border-white/20 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`cursor-pointer flex-1 flex items-center justify-center py-2.5 px-2 rounded-tripio text-xs font-bold transition-all ${
            activeTab === tab.id
              ? "bg-white text-primary shadow-soft"
              : "text-slate-500 hover:text-slate-700"
          }`}
          aria-pressed={activeTab === tab.id}
        >
          {tab.icon && (
            <span className="w-3.5 h-3.5 mr-1.5 flex items-center justify-center">
              {tab.icon}
            </span>
          )}
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </button>
      ))}
    </div>
  );
};
