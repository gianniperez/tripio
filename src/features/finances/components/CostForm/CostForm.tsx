"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useTrip } from "@/features/trips/hooks/useTrip";
import { useAddCost } from "@/features/finances/hooks/useCosts";
import type { CostFormProps } from "./CostForm.types";
import { CategoryCost } from "@/types/models";
import { Icon } from "@/components/ui/Icon";
import { EntitySelectorModal } from "../EntitySelectorModal/EntitySelectorModal";
import { LinkableEntity } from "../../hooks/useLinkableEntities";


const schema = z.object({
  title: z.string().min(1, "El título es requerido"),
  amount: z.number().positive("El monto debe ser numérico y positivo"),
  date: z.string().min(1, "La fecha es requerida"),
  category: z.enum([
    "accommodation",
    "transport",
    "food",
    "general",
    "health",
    "equipment",
    "activity",
    "other",
  ]),
  splitType: z.enum(["equal", "custom"]),
});

type FormData = z.infer<typeof schema>;

export function CostForm({ tripId, onSuccess, onCancel }: CostFormProps) {
  const { currentUser } = useAuthStore();
  const { data: trip } = useTrip(tripId);
  const addCostMutation = useAddCost(tripId);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "general",
      splitType: "equal",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const splitType = useWatch({ control, name: "splitType" });
  const baseAmount = useWatch({ control, name: "amount" }) || 0;

  // For custom split, we store { [userId]: amount }
  const [customSplit, setCustomSplit] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<LinkableEntity | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'activity': return 'local_activity';
      case 'accommodation': return 'hotel';
      case 'transport': return 'directions_car';
      case 'inventory': return 'inventory_2';
      default: return 'help';
    }
  };


  const handleCustomSplitChange = (uid: string, value: string) => {
    setCustomSplit((prev) => ({
      ...prev,
      [uid]: Number(value),
    }));
  };

  const onSubmit = (data: FormData) => {
    if (!currentUser) return;

    const participants = trip?.participantIds || [currentUser.uid];

    // Auto-calculate equal split
    let finalSplit: Record<string, number> = {};

    if (data.splitType === "equal") {
      const perPerson = Number((data.amount / participants.length).toFixed(2));
      participants.forEach((uid) => {
        finalSplit[uid] = perPerson;
      });
      // Adjust the first one for any rounding error to match exact total
      const totalAllocated = perPerson * participants.length;
      if (totalAllocated !== data.amount) {
        finalSplit[participants[0]] += Number((data.amount - totalAllocated).toFixed(2));
      }
    } else {
      finalSplit = customSplit;
      // Validate custom split matches total
      const customTotal = Object.values(finalSplit).reduce((a, b) => a + b, 0);
      if (Math.abs(customTotal - data.amount) > 0.01) {
        alert(
          `La suma del split custom (${customTotal}) no coincide con el total (${data.amount}).`
        );
        return;
      }
    }

    addCostMutation.mutate(
      {
        userId: currentUser.uid,
        title: data.title,
        amount: data.amount,
        currency: trip?.currency || "USD",
        date: new Date(data.date),
        category: data.category as CategoryCost,
        paidBy: { [currentUser.uid]: data.amount }, // App assumes current user paid 100% for MVP
        splitTo: finalSplit,
        linkedTo: selectedEntity?.id || null,
        linkedType: selectedEntity?.type || null,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeumorphicInput
          label="Título/Concepto"
          {...register("title")}
          error={errors.title?.message}
        />

        <NeumorphicInput
          label={`Monto Total (${trip?.currency || "USD"})`}
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeumorphicInput
          label="Fecha"
          type="date"
          {...register("date")}
          error={errors.date?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <select
            {...register("category")}
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 
                          border border-gray-200 dark:border-gray-700 text-gray-900 
                          dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500
                          shadow-inner"
          >
            <option value="accommodation">Alojamiento</option>
            <option value="transport">Transporte</option>
            <option value="food">Comida / Restaurante</option>
            <option value="activity">Actividad / Entrada</option>
            <option value="health">Salud / Médico</option>
            <option value="equipment">Equipamiento</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Vínculo (Opcional) */}
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                            ${selectedEntity ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Icon name={selectedEntity ? getIcon(selectedEntity.type) : "link"} size={20} fill={!!selectedEntity} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vínculo (Opcional)</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[150px] md:max-w-[200px]">
                {selectedEntity ? selectedEntity.title : "Sin actividad vinculada"}
              </p>
            </div>
          </div>
          
          <NeumorphicButton 
            variant="secondary" 
            type="button" 
            className="px-4 py-2 w-auto h-auto text-[10px]"
            onClick={() => setIsModalOpen(true)}
          >
            {selectedEntity ? "Cambiar" : "Vincular"}
          </NeumorphicButton>
        </div>
        
        {selectedEntity && (
          <button 
            type="button"
            onClick={() => setSelectedEntity(null)}
            className="mt-2 text-[10px] text-brand-500 font-bold uppercase hover:underline"
          >
            Eliminar vínculo
          </button>
        )}
      </div>

      <EntitySelectorModal 
        tripId={tripId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(entity: LinkableEntity) => {
          setSelectedEntity(entity);
          if (entity.category) {
            setValue("category", entity.category as CategoryCost);
          }
        }}
      />

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          División del Costo (Split)
        </h4>

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="equal"
              {...register("splitType")}
              className="accent-brand-500"
            />
            <span className="text-sm dark:text-gray-300">Partes iguales</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="custom"
              {...register("splitType")}
              className="accent-brand-500"
            />
            <span className="text-sm dark:text-gray-300">Montos específicos</span>
          </label>
        </div>

        {splitType === "custom" && trip?.participantIds && (
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 mb-2">
              Ingresa cuánto debe poner cada participante de los {baseAmount}.
            </p>
            {trip.participantIds.map((uid) => (
              <div key={uid} className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300 font-medium">
                  {uid === currentUser?.uid ? "Tú" : `ID: ${uid.substring(0, 6)}...`}
                </span>
                <div className="w-1/2">
                  <NeumorphicInput
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={customSplit[uid] || ""}
                    onChange={(e) => handleCustomSplitChange(uid, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {onCancel && (
          <NeumorphicButton variant="secondary" onClick={onCancel} type="button">
            Cancelar
          </NeumorphicButton>
        )}
        <NeumorphicButton variant="primary" type="submit" disabled={addCostMutation.isPending}>
          {addCostMutation.isPending ? "Guardando..." : "Guardar Gasto"}
        </NeumorphicButton>
      </div>
    </form>
  );
}
