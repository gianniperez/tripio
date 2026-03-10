import React from "react";
import Link from "next/link";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

export type CardVariant = "primary" | "secondary" | "tertiary";

interface QuickAccessCardProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  variant?: CardVariant;
}

const variantStyles: Record<
  CardVariant,
  { bg: string; iconContainerBg: string; text: string }
> = {
  primary: {
    bg: "border border-primary/5",
    iconContainerBg: "bg-primary-extralight/20",
    text: "text-primary",
  },
  secondary: {
    bg: "border border-secondary/5",
    iconContainerBg: "bg-secondary/10",
    text: "text-secondary",
  },
  tertiary: {
    bg: "border border-terciary/5",
    iconContainerBg: "bg-terciary/10",
    text: "text-terciary",
  },
};

export const QuickAccessCard = ({
  icon,
  title,
  href,
  variant = "primary",
}: QuickAccessCardProps) => {
  const styles = variantStyles[variant];

  // We add the text color specifically to the icon using cloneElement if possible,
  // or wrap it in a div that cascades the color down
  return (
    <Link href={href}>
      <NeumorphicCard
        className={`p-6 flex flex-col items-center gap-3 text-center hover:shadow-xl transition-all cursor-pointer h-full glass-card group ${styles.bg}`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${styles.iconContainerBg} ${styles.text}`}
        >
          {icon}
        </div>
        <span className="font-bold text-sm text-secondary-deep">{title}</span>
      </NeumorphicCard>
    </Link>
  );
};
