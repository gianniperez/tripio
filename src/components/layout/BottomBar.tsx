"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map as MapIcon,
  Lightbulb,
  Users,
  Wallet,
} from "lucide-react";

export const BottomBar = ({ tripId }: { tripId: string }) => {
  const pathname = usePathname();

  const MOBILE_NAV = [
    { name: "Inicio", href: `/trips/${tripId}`, icon: LayoutDashboard },
    { name: "Propuestas", href: `/trips/${tripId}/proposals`, icon: Lightbulb },
    { name: "Itinerario", href: `/trips/${tripId}/logistics`, icon: MapIcon },
    { name: "Finanzas", href: `/trips/${tripId}/finances`, icon: Wallet },
    {
      name: "Participantes",
      href: `/trips/${tripId}/participants`,
      icon: Users,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <ul className="flex justify-around items-center h-20">
        {MOBILE_NAV.map((item) => {
          const isActive =
            item.href === `/trips/${tripId}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center h-full space-y-1 ${
                  isActive
                    ? "text-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${isActive ? "text-primary" : ""}`}
                />
                <span
                  className={`text-[10px] font-semibold ${isActive ? "text-primary" : ""}`}
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
