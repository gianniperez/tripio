"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrip } from "@/features/trips/hooks";
import { Icon } from "@/components/ui/Icon";

export const BottomBar = ({ tripId }: { tripId: string }) => {
  const pathname = usePathname();
  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading || !trip) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe h-20 flex items-center justify-center">
        <Icon
          name="progress_activity"
          className="w-5 h-5 animate-spin text-gray-300"
        />
      </nav>
    );
  }

  const features = trip.enabledFeatures || {
    finances: true,
    activities: true,
    logistics: true,
  };

  const MOBILE_NAV = [
    {
      name: "Propuestas",
      href: `/trips/${tripId}/proposals`,
      icon: "lightbulb",
      enabled: true,
    },
    {
      name: "Actividades",
      href: `/trips/${tripId}/activities`,
      icon: "calendar_month",
      enabled: features.activities,
    },
    {
      name: "Inicio",
      href: `/trips/${tripId}`,
      icon: "dashboard",
      enabled: true,
    },
    {
      name: "Logística",
      href: `/trips/${tripId}/logistics`,
      icon: "luggage",
      enabled: features.logistics,
    },
    {
      name: "Finanzas",
      href: `/trips/${tripId}/finances`,
      icon: "payments",
      enabled: features.finances,
    },
  ];

  const visibleNav = MOBILE_NAV.filter((item) => item.enabled);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100/50 z-50 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <ul className="flex justify-around items-center h-20">
        {visibleNav.map((item) => {
          const isActive =
            item.href === `/trips/${tripId}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <li key={item.name} className="flex-1 h-full">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center h-full transition-all duration-300 relative ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 w-1 h-1 bg-primary rounded-full" />
                )}
                <Icon
                  name={item.icon}
                  size={20}
                  fill={isActive}
                  className={`mb-1 ${isActive ? "text-primary" : ""}`}
                />
                <span
                  className={`text-[10px] font-black tracking-tight ${isActive ? "text-primary" : "text-gray-400/80"}`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
