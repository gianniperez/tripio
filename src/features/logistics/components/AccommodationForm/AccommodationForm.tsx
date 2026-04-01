"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { RequiresVotingSelector } from "@/features/trips/components/RequiresVotingSelector";
import { accommodationSchema } from "../../types/logisticsSchemas";
import { logisticsService } from "../../api/logisticsService";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

interface AccommodationFormProps {
  tripId: string;
  onSuccess: () => void;
}

export function AccommodationForm({ tripId, onSuccess }: AccommodationFormProps) {

  const { currentUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      title: "",
      location: "",
      checkIn: "",
      checkOut: "",
      priceEstimate: "",
      notes: "",
      requiresVoting: false,
    },
  });

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
        checkIn: data.checkIn ? new Date(data.checkIn + "T12:00:00") : null,
        checkOut: data.checkOut ? new Date(data.checkOut + "T12:00:00") : null,
        priceEstimate: data.priceEstimate ? Number(data.priceEstimate) : null,
      };
      await logisticsService.createAccommodation(tripId, currentUser.uid, formattedData as any);
      onSuccess();
    } catch (err) {
      console.error("Error creating accommodation:", err);
      setError("Error al crear. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <NeumorphicInput
        label="Nombre del Alojamiento"
        placeholder="Ej: Airbnb en el centro"
        error={errors.title?.message as string}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <NeumorphicInput
        label="Ubicación"
        placeholder="Dirección o enlace"
        error={errors.location?.message as string}
        {...register("location")}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Check-in"
          type="date"
          error={errors.checkIn?.message as string}
          required
          {...register("checkIn")}
        />
        <NeumorphicInput
          label="Check-out"
          type="date"
          error={errors.checkOut?.message as string}
          required
          {...register("checkOut")}
        />
      </div>

      <NeumorphicInput
        label="Costo Estimado Total"
        type="number"
        placeholder="0.00"
        error={errors.priceEstimate?.message as string}
        {...register("priceEstimate")}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Pros, contras, camas disponibles..."
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
        {isSubmitting ? "Guardando..." : "Crear Alojamiento"}
      </NeumorphicButton>
    </form>
  );
}
