"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Lightbulb, Wallet, Plane, Package, Loader2 } from "lucide-react";
import { useTrip } from "@/features/trips/hooks";

export const BottomBar = ({ tripId }: { tripId: string }) => {
  const pathname = usePathname();
  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading || !trip) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe h-20 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
      </nav>
    );
  }

  const features = trip.enabledFeatures || {
    finances: true,
    inventory: true,
    activities: true,
    logistics: true,
  };

  const MOBILE_NAV = [
    { 
      name: "Actividades", 
      href: `/trips/${tripId}/activities`, 
      icon: Lightbulb,
      enabled: features.activities 
    },
    { 
      name: "Logística", 
      href: `/trips/${tripId}/logistics`, 
      icon: Plane,
      enabled: features.logistics
    },
    { 
      name: "Inicio", 
      href: `/trips/${tripId}`, 
      icon: LayoutDashboard,
      enabled: true 
    },
    { 
      name: "Inventario", 
      href: `/trips/${tripId}/inventory`, 
      icon: Package,
      enabled: features.inventory 
    },
    { 
      name: "Finanzas", 
      href: `/trips/${tripId}/finances`, 
      icon: Wallet,
      enabled: features.finances 
    },
  ];

  const visibleNav = MOBILE_NAV.filter(item => item.enabled);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <ul className="flex justify-around items-center h-20">
        {visibleNav.map((item) => {
          const isActive =
            item.href === `/trips/${tripId}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center h-full space-y-1 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : ""}`}
                />
                <span
                  className={`text-[10px] font-bold ${isActive ? "text-primary" : ""}`}
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
