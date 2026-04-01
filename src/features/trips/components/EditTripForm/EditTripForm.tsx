"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { createTripSchema } from "../../types";
import { z } from "zod";
import { tripService } from "../../api";

import { useState } from "react";
import type { EditTripFormProps } from "./EditTripForm.types";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Timestamp } from "firebase/firestore";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

export function EditTripForm({ trip, userRole, onSuccess, onDelete }: EditTripFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper para convertir fecha a string YYYY-MM-DD
  const formatDateForInput = (dateValue: Timestamp | Date | null | undefined) => {
    if (!dateValue) return "";
    let d = dateValue;
    if ((d as Timestamp).toDate) {
      d = (d as Timestamp).toDate();
    } else {
      d = new Date(d as string | Date);
    }
    return (d as Date).toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.input<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: trip.name,
      description: trip.description || "",
      startDate: formatDateForInput(trip.startDate),
      endDate: formatDateForInput(trip.endDate),
      currency: trip.currency || "USD",
      coverImage: trip.coverImage || "",
      dailyBudget: trip.dailyBudget ?? undefined,
    },
  });

  const coverImage = watch("coverImage");

  const onSubmit = async (data: z.infer<typeof createTripSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await tripService.updateTrip(trip.id, data);
      onSuccess?.();
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Hubo un error al guardar los cambios. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (userRole !== "owner") return;
    if (
      !window.confirm("¿Seguro que deseas eliminar este viaje? Esta acción no se puede deshacer.")
    )
      return;

    setIsDeleting(true);
    setError(null);
    try {
      await tripService.deleteTrip(trip.id);
      onDelete?.(); // Ejecuta callback usualmente redirigiendo a "/"
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Hubo un error al eliminar el viaje.");
      setIsDeleting(false);
    }
  };

  return (
    <NeumorphicCard>
      <form onSubmit={handleSubmit((data: any) => onSubmit(data))} className="space-y-6">
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
          {coverImage && (
            <div className="flex flex-col gap-1 mb-2">
              <label className="font-display text-sm font-semibold text-main ml-2">Portada</label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Portada del viaje"
                className="w-full h-[120px] object-cover rounded-2xl shadow-sm"
              />
            </div>
          )}
          <NeumorphicInput
            type="file"
            label="Cambiar Portada"
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
          className="w-full shadow-neumorphic-sm! bg-[#F46A1F] text-white"
          disabled={isSubmitting || isDeleting}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </NeumorphicButton>

        {userRole === "owner" && (
          <NeumorphicButton
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
            variant="danger"
          >
            <span className="material-symbols-rounded text-[20px]">delete</span>
            {isDeleting ? "Eliminando..." : "Eliminar Viaje"}
          </NeumorphicButton>
        )}
      </form>
    </NeumorphicCard>
  );
}
