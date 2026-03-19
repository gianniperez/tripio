import type { TransportCardProps } from "./TransportCard.types";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/dialog/ConfirmDialog/ConfirmDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function TransportCard({ item, canManage, onEdit, onDelete, userProfiles }: TransportCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <NeumorphicCard className="mb-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border-l-4 border-l-emerald-500/30">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        {canManage && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
            >
              <Icon name="more_vert" className="w-4 h-4" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Icon name="edit" className="w-3.5 h-3.5 mr-2" /> Editar
                </button>
                <button
                  onClick={() => {
                    setShowActions(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Icon name="delete" className="w-3.5 h-3.5 mr-2" /> Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 opacity-80 flex items-center gap-1">
            <Icon name="directions_car" className="w-3 h-3" /> Transporte
          </span>
          <h3 className="text-xl font-bold font-nunito text-text-main leading-tight pr-8">
            {item.title}
          </h3>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-slate-600 mb-4 font-inter leading-relaxed">
          {item.description}
        </p>
      )}

      {item.segmentId && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
            <Icon name="location_on" className="w-3 h-3" />
            Tramo asignado
          </span>
        </div>
      )}

      {item.isPersonalTransport != null && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border mr-2
          ${item.isPersonalTransport ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-200'}">
          <Icon name={item.isPersonalTransport ? "directions_car" : "directions_bus"} className="w-3 h-3" />
          {item.isPersonalTransport ? "Transporte Personal" : "Transporte Público"}
          {item.isPersonalTransport && item.capacity && ` (Capacidad: ${item.capacity})`}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-slate-500 font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
        {item.startDate && (
          <div className="flex items-center">
            <Icon
              name="calendar_month"
              className="w-3.5 h-3.5 mr-2 text-primary/50"
            />
            <span className="truncate">
              {format(item.startDate.toDate(), "d MMM p", { locale: es })}
              {item.endDate &&
                ` - ${format(item.endDate.toDate(), "d MMM p", { locale: es })}`}
            </span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center">
            <Icon
              name="location_on"
              className="w-3.5 h-3.5 mr-2 text-primary/50"
            />
            <span className="truncate" title={item.location}>
              {item.location}
            </span>
          </div>
        )}
        {item.estimatedCost && (
          <div className="flex items-center">
            <Icon
              name="attach_money"
              className="w-3.5 h-3.5 mr-2 text-green-500/50"
            />
            <span>${item.estimatedCost} est.</span>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        title="Eliminar transporte"
        message={`¿Estás seguro de eliminar "${item.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </NeumorphicCard>
  );
}