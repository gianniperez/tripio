"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  createAccommodationSchema, 
  CreateAccommodationFormValues 
} from "@/features/accommodation/types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { VotingSection } from "../VotingSection/VotingSection";
import { AccommodationFormProps } from "./AccommodationForm.types";

export function AccommodationForm({
  onSubmit,
  isSubmitting = false,
  initialData,
  isProposalMode = false,
}: AccommodationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateAccommodationFormValues>({
    resolver: zodResolver(createAccommodationSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      estimatedCost: initialData?.estimatedCost,
      location: initialData?.location || "",
      startDate: initialData?.startDate?.toDate() || null,
      endDate: initialData?.endDate?.toDate() || null,
      responseType: initialData?.responseType || "rsvp",
      requiresVoting: initialData?.requiresVoting ?? isProposalMode,
      options: initialData?.options?.map((opt: any) => ({ value: opt })) || [],
    },
  });

  const handleFormSubmit = (data: CreateAccommodationFormValues) => {
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        setError("endDate", {
          type: "manual",
          message: "La fecha de fin no puede ser anterior al inicio",
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
          label="Nombre del Alojamiento"
          required={true}
          placeholder="Ej: Hotel Central"
          error={errors.title?.message}
        />
        <NeumorphicInput
          {...register("location")}
          label="Ubicación"
          placeholder="Ej: Av. Siempreviva 123"
          error={errors.location?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            type="datetime-local"
            {...register("startDate", { valueAsDate: true })}
            label="Desde (Check-in)"
            error={errors.startDate?.message}
          />
          <NeumorphicInput
            type="datetime-local"
            {...register("endDate", { valueAsDate: true })}
            label="Hasta (Check-out)"
            error={errors.endDate?.message}
          />
        </div>
        <NeumorphicInput
          type="number"
          {...register("estimatedCost", { valueAsNumber: true })}
          label="Costo Estimado"
          placeholder="0"
          error={errors.estimatedCost?.message}
        />
        <NeumorphicInput
          type="textarea"
          {...register("description")}
          label="Notas adicionales"
          placeholder="Detalles sobre la reserva, comodidades, etc."
          error={errors.description?.message}
        />
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
          ? "Guardando..."
          : initialData
            ? "Guardar Cambios"
            : "Guardar Alojamiento"}
      </NeumorphicButton>
    </form>
  );
}