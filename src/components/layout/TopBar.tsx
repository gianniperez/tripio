"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useAuthStore } from "@/features/auth/stores";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTrip } from "@/features/trips/hooks";

export const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const pathname = usePathname();
  const params = useParams<{ tripId?: string }>();
  const { data: trip } = useTrip(params.tripId || "");

  const isTripPage = !!params.tripId && pathname.startsWith("/trips/");

  return (
    <>
      <header className="bg-white/80 h-16 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        {/* MOBILE VIEW (Back Arrow | Trip Name | Menu) */}
        <div className="flex md:hidden items-center justify-between w-full">
          {isTripPage ? (
            <>
              <Link
                href="/trips"
                className="p-2 -ml-2 text-secondary-deep hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="arrow_back" size={24} />
              </Link>
              <h2 className="text-sm font-black text-secondary-deep truncate px-4">
                {trip?.name || "Cargando..."}
              </h2>
            </>
          ) : (
            <Link href="/trips" className="flex items-center gap-2">
              <Image
                src="/isologo/orange.png"
                alt="Tripio Logo"
                width={28}
                height={28}
                className="w-auto h-auto"
              />
              <h1 className="text-xl font-black text-primary tracking-tight">
                tripio
              </h1>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -mr-2 text-secondary-deep hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="menu" size={28} />
          </button>
        </div>

        {/* DESKTOP VIEW (Logo + Identity | User Actions) */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Link href="/trips" className="flex items-center gap-3">
              <Image
                src="/isologo/orange.png"
                alt="Tripio Logo"
                width={32}
                height={32}
                className="rounded-md w-auto h-auto"
              />
              <h1 className="text-2xl font-black text-primary tracking-tight">
                tripio
              </h1>
            </Link>

            {isTripPage && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-xl font-light">/</span>
                <Link
                  href="/trips"
                  className="text-sm font-bold text-secondary hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  Mis viajes
                </Link>
                <span className="text-xl font-light">/</span>
                <span className="text-sm font-bold text-secondary-deep bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {trip?.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "Usuario"}
                  width={28}
                  height={28}
                  className="rounded-full shadow-sm"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-[10px] font-bold">
                  {user?.displayName?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-sm font-bold text-secondary-deep">
                {user?.displayName || "Usuario"}
              </span>
            </div>

            <button
              onClick={() => auth.signOut()}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-danger transition-colors cursor-pointer"
              title="Cerrar Sesión"
            >
              <Icon name="logout" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-100 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-150 w-72 bg-white shadow-2xl rounded-l-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Menú</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-full"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* User Info */}
          <div className="flex items-center rounded-full gap-3 p-3 bg-gray-50 border border-gray-100">
            {user?.photoURL ? (
              <Image
                src={user?.photoURL || ""}
                alt={user?.displayName || "Usuario"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
                <Image
                  src="/isologo/blue.png"
                  alt="Tripio Logo"
                  width={32}
                  height={32}
                  className="rounded-md w-auto h-auto"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.displayName || "Usuario"}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {isTripPage && (
              <>
                {[
                  {
                    name: "Inicio",
                    href: `/trips/${params.tripId}`,
                    icon: "dashboard",
                  },
                  {
                    name: "Propuestas",
                    href: `/trips/${params.tripId}/proposals`,
                    icon: "lightbulb",
                  },
                  {
                    name: "Actividades",
                    href: `/trips/${params.tripId}/activities`,
                    icon: "calendar_month",
                  },
                  {
                    name: "Logística",
                    href: `/trips/${params.tripId}/logistics`,
                    icon: "luggage",
                  },
                  {
                    name: "Finanzas",
                    href: `/trips/${params.tripId}/finances`,
                    icon: "payments",
                  },
                  {
                    name: "Configuración",
                    href: `/trips/${params.tripId}/settings`,
                    icon: "settings",
                  },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "text-gray-500 hover:bg-secondary/10 hover:text-secondary"
                      }`}
                    >
                      <Icon name={item.icon} size={22} fill={isActive} />
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                auth.signOut();
              }}
              className="rounded-tripio w-full flex items-center justify-center gap-2 p-4 text-sm font-bold text-white bg-danger hover:bg-red-600 transition-colors shadow-sm"
            >
              <Icon name="logout" className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
