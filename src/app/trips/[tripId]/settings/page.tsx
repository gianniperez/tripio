"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTrip, useUpdateTrip, useDeleteTrip } from "@/features/trips/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTripSchema } from "@/features/trips/types";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { NeumorphicInput } from "@/components/NeumorphicInput";
import { NeumorphicButton } from "@/components/NeumorphicButton";
import { Timestamp } from "firebase/firestore";
import {
  MapPin,
  Calendar,
  Type,
  ChevronLeft,
  Save,
  Loader2,
} from "lucide-react";

export default function TripSettings() {
  const { tripId } = useParams<{ tripId: string }>();
  const router = useRouter();
  const { data: trip, isLoading } = useTrip(tripId);
  const updateMutation = useUpdateTrip();
  const deleteMutation = useDeleteTrip();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
  });

  useEffect(() => {
    if (trip) {
      reset({
        name: trip.name,
        destination: trip.destination || "",
        description: trip.description || "",
        startDate: trip.startDate
          ? trip.startDate.toDate().toISOString().split("T")[0]
          : undefined,
        endDate: trip.endDate
          ? trip.endDate.toDate().toISOString().split("T")[0]
          : undefined,
        currency: trip.currency || "USD",
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data: z.input<typeof createTripSchema>) => {
    try {
      const values = createTripSchema.parse(data);
      await updateMutation.mutateAsync({
        tripId,
        data: {
          name: values.name,
          destination: values.destination || null,
          description: values.description || null,
          currency: values.currency,
          startDate: values.startDate
            ? Timestamp.fromDate(values.startDate)
            : null,
          endDate: values.endDate ? Timestamp.fromDate(values.endDate) : null,
        },
      });
      // Small delay to allow Firestore to propagate
      setTimeout(() => {
        router.push(`/trips/${tripId}`);
      }, 500);
    } catch (error) {
      console.error("DEBUG - Update Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-xl shadow-neumorphic-sm text-gray-400 hover:text-primary transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-text-main tracking-tight font-nunito">
          Configuración del Viaje
        </h1>
      </div>

      <NeumorphicCard className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <NeumorphicInput
              label="Nombre del Viaje"
              leftIcon={<Type size={18} />}
              placeholder="Ej. Roadtrip Europa 2025"
              error={errors.name?.message}
              {...register("name")}
            />

            <NeumorphicInput
              label="Destino (Opcional)"
              leftIcon={<MapPin size={18} />}
              placeholder="¿A dónde van?"
              error={errors.destination?.message}
              {...register("destination")}
            />

            <div className="grid grid-cols-2 gap-4">
              <NeumorphicInput
                label="Fecha Inicio"
                type="date"
                leftIcon={<Calendar size={18} />}
                error={errors.startDate?.message}
                {...register("startDate")}
              />
              <NeumorphicInput
                label="Fecha Fin"
                type="date"
                leftIcon={<Calendar size={18} />}
                error={errors.endDate?.message}
                {...register("endDate")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <NeumorphicInput
                label="Moneda Principal del Viaje"
                placeholder="USD"
                {...register("currency")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 ml-1">
                Descripción
              </label>
              <textarea
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 shadow-neumorphic-inset-sm transition-all min-h-[100px]"
                placeholder="Escribe algo sobre este viaje..."
                {...register("description")}
              />
            </div>
          </div>

          <div className="pt-4">
            <NeumorphicButton
              type="submit"
              variant="primary"
              className="w-full py-4 text-sm font-black tracking-wide"
              disabled={updateMutation.isPending}
            >
              <div className="flex items-center justify-center gap-2">
                {updateMutation.isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                <span>
                  {updateMutation.isPending
                    ? "GUARDANDO..."
                    : "GUARDAR CAMBIOS"}
                </span>
              </div>
            </NeumorphicButton>
          </div>
        </form>
      </NeumorphicCard>

      {/* Delete Section */}
      <div className="mt-12 mb-8">
        <h3 className="text-red-500 font-bold mb-4 px-2">Zona de Peligro</h3>
        <NeumorphicCard className="p-6 border border-red-100">
          {!showConfirmDelete ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-gray-700">Eliminar Viaje</p>
                <p className="text-sm text-gray-500">
                  Esta acción no se puede deshacer. Todos los datos se perderán.
                </p>
              </div>
              <NeumorphicButton
                variant="danger"
                onClick={() => setShowConfirmDelete(true)}
              >
                Eliminar
              </NeumorphicButton>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-red-600 font-bold text-sm">
                ¿Estás completamente seguro de que quieres eliminar el viaje
                &quot;{trip?.name}&quot;?
              </p>
              <div className="flex items-center gap-3">
                <NeumorphicButton
                  variant="danger"
                  className="flex-1"
                  disabled={deleteMutation.isPending}
                  onClick={async () => {
                    await deleteMutation.mutateAsync(tripId);
                    router.push("/trips");
                  }}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 size={20} className="animate-spin mx-auto" />
                  ) : (
                    "Sí, eliminar para siempre"
                  )}
                </NeumorphicButton>
                <NeumorphicButton
                  variant="secondary"
                  className="flex-1"
                  disabled={deleteMutation.isPending}
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancelar
                </NeumorphicButton>
              </div>
            </div>
          )}
        </NeumorphicCard>
      </div>
    </div>
  );
}
