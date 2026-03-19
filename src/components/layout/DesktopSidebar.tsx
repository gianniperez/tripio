"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../ui/Icon";

export const DesktopSidebar = ({ tripId }: { tripId?: string }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Inicio", path: "", icon: "dashboard" },
    { label: "Propuestas", path: "/proposals", icon: "lightbulb" },
    { label: "Actividades", path: "/activities", icon: "calendar_month" },
    { label: "Logística", path: "/logistics", icon: "luggage" },
    { label: "Finanzas", path: "/finances", icon: "payments" },
  ];

  if (!tripId) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/50 border-r border-gray-100 sticky top-16 h-[calc(100vh-64px)] z-30">
      <nav className="flex-1 px-4 py-6 flex flex-col overflow-y-auto">
        <div className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const href = `/trips/${tripId}${item.path}`;
            const isActive = pathname === href;

            return (
              <Link
                key={item.path}
                href={href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-500 hover:bg-secondary/20 hover:text-secondary"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  fill={true}
                  className={
                    isActive
                      ? "text-white"
                      : "group-hover:text-secondary text-gray-500 font-bold"
                  }
                />
                {item.label}
              </Link>
            );
          })}

          {/* Settings Section */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <Link
              href={`/trips/${tripId}/settings`}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                pathname === `/trips/${tripId}/settings`
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-500 hover:bg-secondary/20 hover:text-secondary"
              }`}
            >
              <Icon
                name="settings"
                size={20}
                fill={true}
                className={
                  pathname === `/trips/${tripId}/settings`
                    ? "text-white"
                    : "group-hover:text-secondary text-gray-500 font-bold"
                }
              />
              Configuración
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
};
