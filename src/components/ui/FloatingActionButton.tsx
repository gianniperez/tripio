import React from "react";
import { Plus } from "lucide-react";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { cn } from "@/lib/utils"; // Assuming cn is available or I can import logic

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  isSubPage?: boolean; // If true, positions above BottomBar
}

export const FloatingActionButton = ({
  onClick,
  icon = <Plus className="w-8 h-8" />,
  ariaLabel = "Agregar nuevo",
  className,
  isSubPage = true,
}: FloatingActionButtonProps) => {
  return (
    <div
      className={cn(
        "fixed right-6 z-40 transition-all duration-300",
        isSubPage ? "bottom-24" : "bottom-6",
        className
      )}
    >
      <NeumorphicButton
        onClick={onClick}
        variant="primary"
        className="w-14 h-14 rounded-full flex items-center justify-center p-0 shadow-vibrant"
        aria-label={ariaLabel}
      >
        {icon}
      </NeumorphicButton>
    </div>
  );
};
