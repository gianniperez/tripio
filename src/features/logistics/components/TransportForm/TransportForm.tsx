"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicToggle } from "@/components/neumorphic/NeumorphicToggle";
import { RequiresVotingSelector } from "@/features/trips/components/RequiresVotingSelector";
import { transportSchema } from "../../types/logisticsSchemas";
import { useCreateTransport, useUpdateTransport } from "../../hooks/useLogistics";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { toDate } from "@/utils/date-utils";

import { TransportConfirmed } from "@/types/models";

interface TransportFormProps {
  tripId: string;
  initialData?: TransportConfirmed;
  onSuccess: () => void;
}

export function TransportForm({ tripId, initialData, onSuccess }: TransportFormProps) {
  const { currentUser } = useAuthStore();
  const { mutateAsync: createTrans } = useCreateTransport(tripId);
  const { mutateAsync: updateTrans } = useUpdateTransport(tripId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      title: initialData?.title || "",
      departure: toDate(initialData?.departure)?.toISOString().split("T")[0] || "",
      arrival: toDate(initialData?.arrival)?.toISOString().split("T")[0] || "",
      isPersonal: initialData?.capacity ? true : false,
      capacity: initialData?.capacity?.toString() || "4",
      priceEstimate: initialData?.priceEstimate?.toString() || "",
      description: initialData?.description || "",
      requiresVoting: false,
    },
  });

  const isPersonal = watch("isPersonal");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!currentUser) {
      setError("Debes estar autenticado");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedData = {
        ...data,
        departure: data.departure ? new Date(data.departure + "T12:00:00") : null,
        arrival: data.arrival ? new Date(data.arrival + "T12:00:00") : null,
        priceEstimate: data.priceEstimate ? Number(data.priceEstimate) : null,
        capacity: data.isPersonal ? Number(data.capacity) : null,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isEdit) {
        await updateTrans({ id: initialData!.id, data: formattedData as any });
      } else {
        await createTrans({ userId: currentUser.uid, data: formattedData as any });
      }
      onSuccess();
    } catch (err) {
      console.error(`Error ${isEdit ? "updating" : "creating"} transport:`, err);
      setError(`Error al ${isEdit ? "actualizar" : "crear"}. Intenta de nuevo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <NeumorphicInput
        label="Medio de Transporte"
        placeholder="Ej: Auto de Juan, Vuelo LATAM, Tren..."
        error={errors.title?.message as string}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Fecha de Salida"
          type="date"
          error={errors.departure?.message as string}
          required
          {...register("departure")}
        />
        <NeumorphicInput
          label="Fecha de Llegada"
          type="date"
          error={errors.arrival?.message as string}
          required
          {...register("arrival")}
        />
      </div>

      <Controller
        name="isPersonal"
        control={control}
        render={({ field }) => (
          <NeumorphicToggle
            checked={field.value}
            onChange={field.onChange}
            label="¿Es transporte personal? (Ej. Mi auto)"
            className="px-1"
          />
        )}
      />

      {isPersonal && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <NeumorphicInput
            label="Capacidad (Cant de Pasajeros)"
            type="number"
            min="1"
            error={errors.capacity?.message as string}
            {...register("capacity")}
          />
        </div>
      )}

      <NeumorphicInput
        label="Costo Estimado"
        type="number"
        placeholder="0.00"
        error={errors.priceEstimate?.message as string}
        {...register("priceEstimate")}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Cualquier detalle extra..."
        error={errors.description?.message as string}
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
        {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Transporte"}
      </NeumorphicButton>
    </form>
  );
}
