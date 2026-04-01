"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicToggle } from "@/components/neumorphic/NeumorphicToggle";
import { RequiresVotingSelector } from "@/features/trips/components/RequiresVotingSelector";
import { transportSchema } from "../../types/logisticsSchemas";
import { logisticsService } from "../../api/logisticsService";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

interface TransportFormProps {
  tripId: string;
  onSuccess: () => void;
}

export function TransportForm({ tripId, onSuccess }: TransportFormProps) {

  const { currentUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      title: "",
      departure: "",
      arrival: "",
      isPersonal: false,
      capacity: "4",
      priceEstimate: "",
      notes: "",
      requiresVoting: false,
    },
  });

  const isPersonal = watch("isPersonal");

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
      await logisticsService.createTransport(tripId, currentUser.uid, formattedData as any);
      onSuccess();
    } catch (err) {
      console.error("Error creating transport:", err);
      setError("Error al crear. Intenta de nuevo.");
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
        error={errors.notes?.message as string}
        {...register("notes")}
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
        {isSubmitting ? "Guardando..." : "Crear Transporte"}
      </NeumorphicButton>
    </form>
  );
}
