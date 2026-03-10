import React from "react";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <NeumorphicCard
      className={`p-8 flex flex-col items-center gap-4 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center shadow-neumorphic-inset-sm">
        {icon || <AlertCircle size={32} className="text-amber-500" />}
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-text-main">{title}</h3>
        <p className="text-xs text-gray-500 max-w-[240px] mx-auto">
          {description}
        </p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </NeumorphicCard>
  );
};
