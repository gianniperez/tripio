"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { RequiresVotingSelector } from "../RequiresVotingSelector";
import { createActivitySchema, type CreateActivityInput } from "../../types";
import { tripService } from "../../api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Icon } from "@/components/ui/Icon";
import { z } from "zod";

interface ActivityFormProps {
  tripId: string;
  mode?: "direct" | "proposal";
  onSuccess: () => void;
}

export function ActivityForm({ tripId, mode = "direct", onSuccess }: ActivityFormProps) {
  const { currentUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.input<typeof createActivitySchema>>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      requiresVoting: mode === "proposal",
      title: "",
      location: "",
      costImpact: null,
      date: null,
      startTime: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateActivityInput) => {

    if (!currentUser) {
      setError("Debes estar autenticado");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (data.requiresVoting) {
        await tripService.createProposal(tripId, currentUser.uid, data);
      } else {
        await tripService.createActivity(tripId, currentUser.uid, data);
      }
      onSuccess();
    } catch (err) {
      console.error("Error creating activity/proposal:", err);
      setError("Error al crear. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      <NeumorphicInput
        label="Título de la Actividad"
        placeholder="Ej: Cena en el puerto"
        error={errors.title?.message}
        required
        {...register("title")}
      />

      <NeumorphicInput
        label="Ubicación"
        placeholder="Ej: Restaurante La Marina"
        error={errors.location?.message}
        {...register("location")}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Fecha"
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />
        <NeumorphicInput
          label="Hora"
          type="time"
          error={errors.startTime?.message}
          {...register("startTime")}
        />
      </div>

      <NeumorphicInput
        label="Costo Estimado"
        type="number"
        placeholder="0.00"
        error={errors.costImpact?.message}
        {...register("costImpact", { valueAsNumber: true })}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Cualquier detalle extra..."
        error={errors.description?.message}
        {...register("description")}
      />

      <p className="flex items-center gap-2 border p-2 rounded-lg text-sm text-primary-extralight bg-primary-extralight/10">
        <Icon name="info" />
        Se mostrará en el itinerario si tiene fecha asignada.
      </p>

      {mode !== "proposal" && (
        <div className="pt-2">
          <Controller
            name="requiresVoting"
            control={control}
            render={({ field }) => (
              <RequiresVotingSelector value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      )}

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
        {isSubmitting ? "Guardando..." : "Crear Actividad"}
      </NeumorphicButton>
    </form>
  );
}
