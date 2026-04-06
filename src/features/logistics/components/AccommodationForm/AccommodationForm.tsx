"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { RequiresVotingSelector } from "@/features/trips/components/RequiresVotingSelector";
import { accommodationSchema } from "../../types/logisticsSchemas";
import {
  useCreateAccommodation,
  useUpdateAccommodation,
} from "../../hooks/useLogistics";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { toDate } from "@/utils/date-utils";

import { AccommodationConfirmed } from "@/types/models";

interface AccommodationFormProps {
  tripId: string;
  initialData?: AccommodationConfirmed;
  onSuccess: () => void;
}

export function AccommodationForm({ tripId, initialData, onSuccess }: AccommodationFormProps) {
  const { currentUser } = useAuthStore();
  const { mutateAsync: createAcc } = useCreateAccommodation(tripId);
  const { mutateAsync: updateAcc } = useUpdateAccommodation(tripId);

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
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      title: initialData?.title || "",
      location: initialData?.location || "",
      checkIn: toDate(initialData?.checkIn)?.toISOString().split("T")[0] || "",
      checkOut: toDate(initialData?.checkOut)?.toISOString().split("T")[0] || "",
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
      const formattedData = {
        ...data,
        checkIn: data.checkIn ? new Date(data.checkIn + "T12:00:00") : null,
        checkOut: data.checkOut ? new Date(data.checkOut + "T12:00:00") : null,
        priceEstimate: data.priceEstimate ? Number(data.priceEstimate) : null,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isEdit) {
        await updateAcc({ id: initialData!.id, data: formattedData as any });
      } else {
        await createAcc({ userId: currentUser.uid, data: formattedData as any });
      }
      onSuccess();
    } catch (err) {
      console.error(`Error ${isEdit ? "updating" : "creating"} accommodation:`, err);
      setError(`Error al ${isEdit ? "actualizar" : "crear"}. Intenta de nuevo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <NeumorphicInput
        label="Nombre del Alojamiento"
        placeholder="Ej: Airbnb en el centro"
        error={errors.title?.message?.toString()}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <NeumorphicInput
        label="Ubicación"
        placeholder="Dirección o enlace"
        error={errors.location?.message?.toString()}
        {...register("location")}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Check-in"
          type="date"
          error={errors.checkIn?.message?.toString()}
          required
          {...register("checkIn")}
        />
        <NeumorphicInput
          label="Check-out"
          type="date"
          error={errors.checkOut?.message?.toString()}
          required
          {...register("checkOut")}
        />
      </div>

      <NeumorphicInput
        label="Costo Estimado Total"
        type="number"
        placeholder="0.00"
        error={errors.priceEstimate?.message?.toString()}
        {...register("priceEstimate")}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Pros, contras, camas disponibles..."
        error={errors.description?.message?.toString()}
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
        {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Alojamiento"}
      </NeumorphicButton>
    </form>
  );
}
