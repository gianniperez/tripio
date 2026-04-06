"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/dialog/Modal";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { useLinkableEntities } from "../../hooks/useLinkableEntities";
import { Icon } from "@/components/ui/Icon";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { EntitySelectorModalProps } from "./EntitySelectorModal.types";

export function EntitySelectorModal({
  tripId,
  isOpen,
  onClose,
  onSelect,
}: EntitySelectorModalProps) {
  const { entities, isLoading } = useLinkableEntities(tripId);
  const [search, setSearch] = useState("");

  const filteredEntities = useMemo(() => {
    if (!entities) return [];
    return entities.filter(
      (e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [entities, search]);

  const getIcon = (type: string) => {
    switch (type) {
      case "activity":
        return "local_activity";
      case "accommodation":
        return "hotel";
      case "transport":
        return "directions_car";
      case "inventory":
        return "inventory_2";
      default:
        return "help";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "activity":
        return "Actividad";
      case "accommodation":
        return "Alojamiento";
      case "transport":
        return "Transporte";
      case "inventory":
        return "Inventario";
      default:
        return type;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vincular a..."
      description="Selecciona un hito confirmado para este gasto"
    >
      <div className="space-y-4">
        <NeumorphicInput
          placeholder="Buscar actividad, hotel, transporte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={false}
        />

        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Buscando unidades...</p>
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Icon name="search_off" size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">No se encontraron resultados</p>
            </div>
          ) : (
            filteredEntities.map((entity) => (
              <button
                key={`${entity.type}-${entity.id}`}
                onClick={() => {
                  onSelect(entity);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-transparent 
                           hover:border-brand-200 hover:bg-brand-50/10 transition-all text-left shadow-sm hover:shadow-md group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                                transition-colors group-hover:scale-105 active:scale-95
                                ${
                                  entity.type === "activity"
                                    ? "bg-primary/10 text-primary"
                                    : entity.type === "accommodation"
                                      ? "bg-indigo-50 text-indigo-500"
                                      : entity.type === "transport"
                                        ? "bg-brand-50 text-brand-500"
                                        : "bg-gray-100 text-gray-400"
                                }`}
                >
                  <Icon name={getIcon(entity.type)} size={22} fill />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate text-[15px]">{entity.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {getTypeName(entity.type)}
                    </span>
                    {entity.date && (
                      <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-md">
                        {format(entity.date, "d 'de' MMMM", { locale: es })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="chevron_right" size={20} className="text-brand-500" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
