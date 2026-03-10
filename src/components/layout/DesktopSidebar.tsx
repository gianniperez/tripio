"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map as MapIcon,
  Lightbulb,
  Users,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";

export const DesktopSidebar = ({ tripId }: { tripId: string }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: "Inicio", href: `/trips/${tripId}`, icon: LayoutDashboard },
    { name: "Propuestas", href: `/trips/${tripId}/proposals`, icon: Lightbulb },
    { name: "Itinerario", href: `/trips/${tripId}/logistics`, icon: MapIcon },
    { name: "Finanzas", href: `/trips/${tripId}/finances`, icon: Wallet },
    { name: "Participantes", href: `/trips/${tripId}/participants`, icon: Users },
    { name: "Configuración", href: `/trips/${tripId}/settings`, icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <Image src="/isologo/orange.png" alt="Logo" width={32} height={32} />
        <span className="text-xl font-black text-primary tracking-tight">tripio</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === `/trips/${tripId}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-primary/5 text-primary shadow-neumorphic-inset-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
