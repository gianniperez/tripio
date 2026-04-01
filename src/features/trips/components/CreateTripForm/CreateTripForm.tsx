"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { createTripSchema, type CreateTripInput } from "../../types";
import { tripService } from "../../api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useState } from "react";
import type { CreateTripFormProps } from "./CreateTripForm.types";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function CreateTripForm({ onSuccess, onCancel }: CreateTripFormProps) {
  const { currentUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTripInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      currency: "USD",
    },
  });

  const onSubmit = async (data: CreateTripInput) => {
    if (!currentUser) {
      setError("Debes estar autenticado para crear un viaje");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const tripId = await tripService.createTrip(currentUser.uid, data);
      onSuccess?.(tripId);
    } catch (err) {
      console.error("Error creating trip:", err);
      setError("Hubo un error al crear el viaje. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <NeumorphicInput
        label="Nombre del Viaje"
        placeholder="Ej: Expedición Patagonia"
        error={errors.name?.message}
        required
        {...register("name")}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Fecha de Inicio"
          type="date"
          error={errors.startDate?.message}
          {...register("startDate", { valueAsDate: true })}
        />
        <NeumorphicInput
          label="Fecha de Fin"
          type="date"
          error={errors.endDate?.message}
          {...register("endDate", { valueAsDate: true })}
        />
      </div>

      <NeumorphicInput
        label="Moneda Principal"
        type="select"
        options={[
          { value: "ARS", label: "Peso Argentino (ARS)" },
          { value: "USD", label: "Dólar Estadounidense (USD)" },
          { value: "EUR", label: "Euro (EUR)" },
          { value: "BRL", label: "Real Brasileño (BRL)" },
          { value: "CLP", label: "Peso Chileno (CLP)" },
          { value: "UYU", label: "Peso Uruguayo (UYU)" },
        ]}
        error={errors.currency?.message}
        required
        {...register("currency")}
      />

      <div className="flex flex-col gap-2">
        <NeumorphicInput
          type="file"
          label="Portada"
          placeholder={isSubmitting ? "Subiendo..." : "Seleccionar imagen"}
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              setIsSubmitting(true);
              try {
                const url = await uploadToCloudinary(file);
                setValue("coverImage", url);
              } catch (error) {
                console.error("Error al subir la imagen:", error);
              } finally {
                setIsSubmitting(false);
              }
            }
          }}
        />
      </div>

      <NeumorphicInput
        label="Descripción"
        type="textarea"
        placeholder="Cuéntanos más..."
        error={errors.description?.message}
        {...register("description")}
      />

      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center">
          {error}
        </div>
      )}
      <NeumorphicButton
        type="submit"
        variant="primary"
        className="shadow-neumorphic-sm! bg-primary text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creando..." : "Crear Viaje"}
      </NeumorphicButton>
    </form>
  );
}
