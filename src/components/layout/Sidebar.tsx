"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Lightbulb, LogOut } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores";
import { auth } from "@/lib/firebase";

const NAVIGATION = [
  { name: "Inicio", href: "/", icon: LayoutDashboard },
  { name: "Propuestas", href: "/proposals", icon: Lightbulb },
  { name: "Logística", href: "/logistics", icon: Package },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto z-40">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 mb-4">
        <Image
          src="/isologo/orange.png"
          alt="Tripio Logo"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <h1 className="text-2xl font-black text-primary-dark tracking-tight">
          tripio
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {NAVIGATION.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-background-soft text-primary"
                  : "text-gray-500 hover:bg-background-soft hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.displayName || "Usuario"}
            </p>
          </div>
        </div>

        <button
          onClick={() => auth.signOut()}
          className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-danger hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
