import React from "react";
import { InventoryConfirmed } from "@/types/models";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";

interface InventoryListProps {
  items: InventoryConfirmed[];
  currentUserUid: string;
  onStatusChange: (itemId: string, updates: Partial<InventoryConfirmed>) => void;
  onDelete?: (item: InventoryConfirmed) => void;
  canEdit?: boolean;
}

export const InventoryList = ({
  items,
  currentUserUid,
  onStatusChange,
  onDelete,
  canEdit = false,
}: InventoryListProps) => {
  if (!items.length) {
    return (
      <EmptyState
        title="Nada en inventario"
        description="Los ítems aparecerán aquí cuando se agreguen o se confirmen."
      />
    );
  }

  // Helper type check to avoid typescript errors later
  type ValidCategory = 
    | "general" 
    | "electronica" 
    | "salud" 
    | "comida" 
    | "documentacion" 
    | "equipo" 
    | "other";

  // Agrupación por categoría
  const grouped = items.reduce(
    (acc, item) => {
      const cat = (item.category as ValidCategory) || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, InventoryConfirmed[]>
  );

  const handleToggle = (item: InventoryConfirmed) => {
    if (item.status === "needed") {
      // Tomar responsabilidad
      onStatusChange(item.id, { status: "assigned", assignedTo: currentUserUid });
    } else if (item.status === "assigned" && item.assignedTo === currentUserUid) {
      // Marcar como listo
      onStatusChange(item.id, { status: "done" });
    } else if (item.status === "done" && item.assignedTo === currentUserUid) {
      // Deshacer responsabilidad
      onStatusChange(item.id, { status: "needed", assignedTo: null });
    }
  };

  const getStatusIcon = (status: string, assignedTo: string | null) => {
    if (status === "done") return <Icon name="check_circle" className="text-success" fill />;
    if (status === "assigned" && assignedTo === currentUserUid)
      return <Icon name="pending" className="text-primary" />;
    if (status === "assigned") return <Icon name="person" className="text-slate-400" />;
    return <Icon name="radio_button_unchecked" className="text-slate-300" />;
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "general": return "General";
      case "electronica": return "Electrónica";
      case "salud": return "Salud y Botiquín";
      case "comida": return "Comida y Bebida";
      case "documentacion": return "Documentación";
      case "equipo": return "Equipamiento";
      case "other": return "Otros";
      default: return cat;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "general": return "category";
      case "electronica": return "devices";
      case "salud": return "medical_services";
      case "comida": return "restaurant";
      case "documentacion": return "description";
      case "equipo": return "backpack";
      case "other": return "category";
      default: return "category";
    }
  };

  return (
    <div className="space-y-6">
      {(Object.entries(grouped) as [ValidCategory, InventoryConfirmed[]][]).map(
        ([category, catItems]) => (
          <div key={category} className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Icon name={getCategoryIcon(category)} size={16} />
              {getCategoryLabel(category)}
            </h4>

            <NeumorphicCard className="divide-y divide-border-main/40 p-0 overflow-hidden">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    item.status === "done" ? "bg-slate-50 opacity-70" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 flex-1 cursor-pointer`}
                    onClick={() => {
                      // Solo puede togglear si está needed o es el asignado
                      if (item.status === "needed" || item.assignedTo === currentUserUid) {
                        handleToggle(item);
                      }
                    }}
                  >
                    <button className="flex-shrink-0 transition-transform active:scale-90">
                      {getStatusIcon(item.status, item.assignedTo)}
                    </button>

                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${item.status === "done" ? "line-through text-slate-400" : "text-text-main"}`}
                      >
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {canEdit && onDelete && (
                    <button
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
                      onClick={() => onDelete(item)}
                    >
                      <Icon name="close" size={18} />
                    </button>
                  )}
                </div>
              ))}
            </NeumorphicCard>
          </div>
        )
      )}
    </div>
  );
};
