import React from "react";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    icon: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
  };
}

export const PageHeader = ({
  title,
  description,
  actionButton,
}: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center backdrop-blur-md sticky top-0 z-20 py-4 border-b border-primary/10">
      <div>
        <h1 className="text-2xl font-black text-text-main font-nunito">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 font-inter">{description}</p>
        )}
      </div>
      {actionButton && (
        <NeumorphicButton
          variant="primary"
          onClick={actionButton.onClick}
          className="rounded-full w-12 h-12 flex items-center justify-center p-0 shrink-0"
          aria-label={actionButton.ariaLabel || "Acción"}
        >
          {actionButton.icon}
        </NeumorphicButton>
      )}
    </div>
  );
};
