import React from "react";
import Link from "next/link";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { ChevronRight } from "lucide-react";

export type CardVariant = "primary" | "secondary" | "tertiary";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  onClick?: () => void;
  variant?: CardVariant;
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
    bg: "bg-terciary",
    text: "text-terciary",
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
}: InfoCardProps) => {
  const styles = variantStyles[variant];

  const content = (
    <NeumorphicCard className="my-4 p-4 flex items-center gap-4 group hover:shadow-neumorphic-sm transition-all cursor-pointer">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.bg}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-text-main">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-semibold ${styles.text} shrink-0`}
      >
        <span>{ctaLabel}</span>
        <ChevronRight
          size={14}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </div>
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
