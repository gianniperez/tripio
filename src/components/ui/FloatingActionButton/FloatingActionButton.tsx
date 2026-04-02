import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { cn } from "@/lib/utils";

export interface FloatingActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "terciary" | "danger";
}

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  isSubPage?: boolean;
  items?: FloatingActionItem[];
}

export const FloatingActionButton = ({
  onClick,
  icon = <Icon name="add" size={32} />,
  ariaLabel = "Agregar nuevo",
  className,
  isSubPage = true,
  items = [],
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasItems = items.length > 0;

  // Toggle body overflow when open
  useEffect(() => {
    if (isOpen && hasItems) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, hasItems]);

  const handleMainClick = () => {
    if (hasItems) {
      if (isOpen) {
        // If it's already open and the main button represents the FIRST item...
        items[0].onClick();
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else if (onClick) {
      onClick();
    }
  };

  // If open, we show items[1..n] above and items[0] as the main button
  const displayItems = isOpen ? items.slice(1).reverse() : [];
  const mainItem = isOpen && hasItems ? items[0] : null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && hasItems && (
        <div
          className="fixed h-full w-full z-102 inset-0 bg-black/60 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed right-6 bottom-6 z-105 flex flex-col items-end gap-4 transition-all duration-300",
          isSubPage ? "bottom-24" : "bottom-6",
          className
        )}
      >
        {/* Sub-buttons list (reverse order to stack upwards) */}
        <div className="flex flex-col items-end gap-4">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 group cursor-pointer animate-in slide-in-from-bottom-4 fade-in duration-300 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              <span className="text-white text-lg font-bold drop-shadow-md animate-in fade-in transition-all group-hover:scale-105 duration-300 pointer-events-none leading-none flex items-center h-14">
                {item.label}
              </span>
              <NeumorphicButton
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                variant="secondary"
                className="mr-1 w-14 h-14 rounded-full flex items-center justify-center p-0 shadow-lg shrink-0 border-none"
                aria-label={item.label}
              >
                <div className="text-primary flex items-center justify-center pointer-events-none">
                  {item.icon}
                </div>
              </NeumorphicButton>
            </div>
          ))}
        </div>

        {/* Main button / Primary Action */}
        <div className="flex items-center gap-4 group cursor-pointer animate-in fade-in transition-all duration-300">
          {isOpen && mainItem && (
            <span
              className="text-white text-xl font-black drop-shadow-md animate-in slide-in-from-right-4 fade-in duration-300 leading-none flex items-center h-16"
              onClick={handleMainClick}
            >
              {mainItem.label}
            </span>
          )}
          <NeumorphicButton
            onClick={handleMainClick}
            variant={mainItem?.variant || "primary"}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center p-0 shadow-vibrant transition-all duration-300 border-none",
              isOpen && hasItems ? "scale-100" : "scale-100"
            )}
            aria-label={ariaLabel}
          >
            <div
              className={cn(
                "flex items-center justify-center transition-transform duration-500",
                isOpen && "rotate-360"
              )}
            >
              {isOpen && mainItem ? mainItem.icon : icon}
            </div>
          </NeumorphicButton>
        </div>
      </div>
    </>
  );
};
