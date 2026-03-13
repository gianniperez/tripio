"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../ui/Icon";

export const DesktopSidebar = ({ tripId }: { tripId?: string }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Inicio", path: "", icon: "Dashboard" },
    { label: "Actividades", path: "/activities", icon: "lightbulb" },
    { label: "Logística", path: "/logistics", icon: "travel" },
    { label: "Inventario", path: "/inventory", icon: "package_2" },
    { label: "Finanzas", path: "/finances", icon: "payments" },
  ];

  if (!tripId) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background border-r border-secondary/10 sticky top-16 h-[calc(100vh-64px)] z-30">
      {/* Navigation Context Header */}
      <div className="p-6 pb-2">
        <Link
          href="/trips"
          className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors group"
        >
          <Icon
            name="arrow_back"
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Mis viajes</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const href = `/trips/${tripId}${item.path}`;
          const isActive = pathname === href;

          return (
            <Link
              key={item.path}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-secondary hover:bg-secondary/5 hover:text-secondary-dark"
              }`}
            >
              <Icon
                name={item.icon}
                size={20}
                fill={true}
                className={isActive ? "text-white" : "text-secondary font-bold"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
