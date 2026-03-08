"use client";

import { useState } from "react";
import { Menu, LogOut, X } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      <header className="md:hidden h-14 bg-background border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Image
            src="/isologo/orange.png"
            alt="Tripio Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <h1 className="text-2xl font-black text-primary tracking-tight">
            tripio
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-main hover:text-gray-50 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Menú</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 border border-gray-100">
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
                  className="rounded-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.displayName || "Usuario"}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                auth.signOut();
              }}
              className="rounded-tripio w-full flex items-center justify-center gap-2 p-3 text-sm font-bold text-white bg-danger hover:bg-red-600 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
