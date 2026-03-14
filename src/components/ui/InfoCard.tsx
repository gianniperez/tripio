import React from "react";
import Link from "next/link";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";

export type CardVariant = "primary" | "secondary" | "tertiary";

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  onClick?: () => void;
  variant?: CardVariant;
  isCritical?: boolean;
  criticalTitle?: string;
  criticalDescription?: string;
  criticalMessage?: string;
}

const variantStyles: Record<CardVariant, { bg: string; text: string }> = {
  primary: {
    bg: "bg-primary",
    text: "text-primary",
  },
  secondary: {
    bg: "bg-secondary",
    text: "text-secondary",
  },
  tertiary: {
    bg: "bg-accent",
    text: "text-accent",
  },
};

export const InfoCard = ({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  onClick,
  variant = "primary",
  isCritical = false,
  criticalTitle,
  criticalDescription,
  criticalMessage,
}: InfoCardProps) => {
  const styles = variantStyles[variant];

  const content = (
    <NeumorphicCard className="my-2 p-6 flex flex-col gap-4 group hover:shadow-neumorphic-sm transition-all cursor-pointer">
      <div className="flex items-center gap-4 w-full">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCritical ? "bg-danger" : styles.bg} text-white`}
        >
          <Icon name={icon} size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-black leading-none mb-1">
            {isCritical ? criticalTitle : title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {isCritical ? criticalDescription : description}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${isCritical ? "text-danger" : styles.text} shrink-0`}
        >
          <span>{ctaLabel}</span>
          <Icon
            name="chevron_right"
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
      {isCritical && (
        <div className="flex items-center gap-1 mt-4 p-3 bg-danger/10 rounded-lg border border-danger/50">
          <Icon name="info" className=" text-danger" size={16} />
          <p className="text-[10px] font-semibold text-danger">
            {criticalMessage}
          </p>
        </div>
      )}
    </NeumorphicCard>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left appearance-none">
        {content}
      </button>
    );
  }

  if (ctaHref) {
    return <Link href={ctaHref}>{content}</Link>;
  }

  return content;
};
