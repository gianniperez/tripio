"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createActivitySchema,
  CreateActivityFormValues,
} from "@/features/activities/types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { Icon } from "@/components/ui/Icon";
import { VotingSection } from "../VotingSection/VotingSection";
import { ActivityFormProps } from "./ActivityForm.types";

export const ActivityForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  trip,
  isProposalMode = false,
}: ActivityFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateActivityFormValues>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      estimatedCost: initialData?.estimatedCost,
      location: initialData?.location || "",
      startDate: initialData?.startDate?.toDate() || null,
      endDate: null,
      responseType: initialData?.responseType || "rsvp",
      requiresVoting: initialData?.requiresVoting ?? isProposalMode,
      options: initialData?.options?.map((opt) => ({ value: opt })) || [],
    },
  });

  // Get YYYY-MM-DDTHH:mm for datetime-local
  const toISO = (date: Date | null | undefined) => {
    if (!date || isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const getFloorDate = () => {
    const tripStart = trip.startDate?.toDate();
    if (!tripStart) return "";
    return toISO(tripStart);
  };

  const floorDateISO = getFloorDate();

  const handleFormSubmit = (data: CreateActivityFormValues) => {
    // Validaciones de fechas específicas para actividades
    if (data.startDate) {
      const tripStart = trip.startDate?.toDate();
      const tripEnd = trip.endDate?.toDate();
      const proposalStart = new Date(data.startDate);

      if (tripStart && proposalStart < tripStart) {
        setError("startDate", {
          type: "manual",
          message: "La fecha es anterior al inicio del viaje",
        });
        return;
      }
      if (tripEnd && proposalStart > tripEnd) {
        setError("startDate", {
          type: "manual",
          message: "La fecha es posterior al fin del viaje",
        });
        return;
      }
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <NeumorphicInput
          {...register("title")}
          label="Titulo"
          required={true}
          placeholder="Ej: Tour por el centro..."
          error={errors.title?.message}
        />
        <NeumorphicInput
          {...register("location")}
          label="Ubicación"
          placeholder="Ej: Centro histórico"
        />
        <NeumorphicInput
          type="number"
          {...register("estimatedCost", { valueAsNumber: true })}
          label="Costo Estimado"
          placeholder="0"
        />
        <NeumorphicInput
          type="datetime-local"
          {...register("startDate", { valueAsDate: true })}
          label="Fecha y Hora"
          placeholder="0"
          min={floorDateISO}
          max={toISO(trip.endDate?.toDate())}
        />
        <p className="flex items-center gap-2 border p-2 rounded-lg text-sm text-primary-extralight bg-primary-extralight/10">
          <Icon name="info" />
          Se mostrará en el itinerario si tiene fecha asignada.
        </p>
      </div>

      <VotingSection
        register={register as any}
        control={control as any}
        watch={watch as any}
        errors={errors as any}
        isProposalMode={isProposalMode}
      />

      <NeumorphicButton type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting
          ? initialData
            ? "Guardando..."
            : "Creando..."
          : initialData
            ? "Guardar Cambios"
            : "Crear Actividad"}
      </NeumorphicButton>
    </form>
  );
};
