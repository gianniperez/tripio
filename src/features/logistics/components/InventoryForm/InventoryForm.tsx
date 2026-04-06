"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { RequiresVotingSelector } from "@/features/trips/components/RequiresVotingSelector";
import { inventorySchema } from "../../types/logisticsSchemas";
import { useCreateInventory, useUpdateInventory } from "../../hooks/useLogistics";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

import { InventoryConfirmed } from "@/types/models";

interface InventoryFormProps {
  tripId: string;
  initialData?: InventoryConfirmed;
  onSuccess: () => void;
}

export function InventoryForm({ tripId, initialData, onSuccess }: InventoryFormProps) {
  const { currentUser } = useAuthStore();
  const { mutateAsync: createInv } = useCreateInventory(tripId);
  const { mutateAsync: updateInv } = useUpdateInventory(tripId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "general",
      quantity: initialData?.quantity?.toString() || "1",
      priceEstimate: initialData?.priceEstimate?.toString() || "",
      description: initialData?.description || "",
      requiresVoting: false,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!currentUser) {
      setError("Debes estar autenticado");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        await updateInv({ inventoryId: initialData!.id, updates: data });
      } else {
        await createInv({ userId: currentUser.uid, data });
      }
      onSuccess();
    } catch (err) {
      console.error(`Error ${isEdit ? "updating" : "creating"} inventory item:`, err);
      setError(`Error al ${isEdit ? "actualizar" : "crear"}. Intenta de nuevo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <NeumorphicInput
        label="Nombre del Ítem"
        placeholder="Ej: Carbón, Botiquín, Pack de Agua"
        error={errors.title?.message as string}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <NeumorphicInput
        type="select"
        label="Categoría"
        error={errors.category?.message as string}
        required
        {...register("category")}
        options={[
          { label: "General", value: "general" },
          { label: "Electrónica", value: "electronica" },
          { label: "Salud / Farmacia", value: "salud" },
          { label: "Comida / Bebida", value: "comida" },
          { label: "Documentación", value: "documentacion" },
          { label: "Ropa / Equipo", value: "equipo" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Cantidad"
          type="number"
          min="1"
          {...register("quantity", { min: 1 })}
        />
        <NeumorphicInput
          label="Costo Estimado"
          type="number"
          placeholder="0.00"
          {...register("priceEstimate")}
        />
      </div>
      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Ej: Traer al menos 2 bolsas"
        {...register("description")}
      />

      <div className="pt-2">
        <Controller
          name="requiresVoting"
          control={control}
          render={({ field }) => (
            <RequiresVotingSelector value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center">
          {error}
        </div>
      )}

      <NeumorphicButton
        type="submit"
        variant="primary"
        className="flex-1 bg-primary text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Ítem"}
      </NeumorphicButton>
    </form>
  );
}
