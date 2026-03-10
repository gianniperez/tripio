import React from "react";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

export interface ListItemCardProps {
  icon?: React.ReactNode;
  iconWrapperClassName?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  rightDetail?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItemCard = ({
  icon,
  iconWrapperClassName = "bg-primary/10 text-primary",
  title,
  description,
  rightDetail,
  actions,
  children,
  onClick,
  className = "",
}: ListItemCardProps) => {
  return (
    <NeumorphicCard
      className={`p-4 transition-all duration-300 ${onClick ? "cursor-pointer hover:shadow-neumorphic-sm hover:-translate-y-0.5" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {icon && (
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconWrapperClassName}`}
            >
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors leading-tight">
              {title}
            </h4>

            {description && (
              <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {(rightDetail || actions) && (
          <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
            {rightDetail && (
              <div className="flex items-center justify-center whitespace-nowrap font-bold">
                {rightDetail}
              </div>
            )}
            {actions && (
              <div className="flex items-center justify-end gap-1 mt-auto">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-4 pt-4 border-t border-gray-100/50">{children}</div>
      )}
    </NeumorphicCard>
  );
};
