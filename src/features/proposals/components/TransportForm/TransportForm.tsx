"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransportSchema,
  CreateTransportFormValues,
} from "@/features/transport/types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { VotingSection } from "../VotingSection/VotingSection";
import { TransportFormProps } from "./TransportForm.types";

export function TransportForm({
  onSubmit,
  isSubmitting = false,
  initialData,
  isProposalMode = false,
}: TransportFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateTransportFormValues>({
    resolver: zodResolver(createTransportSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      endDate: initialData?.endDate?.toDate() || null,
      responseType: initialData?.responseType || "rsvp",
      requiresVoting: initialData?.requiresVoting ?? isProposalMode,
      options: initialData?.options?.map((opt: any) => ({ value: opt })) || [],
      isPersonalTransport: initialData?.isPersonalTransport ?? false,
      capacity: initialData?.capacity,
    },
  });

  const isPersonalTransport = watch("isPersonalTransport");

  const handleFormSubmit = (data: CreateTransportFormValues) => {
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
          label="Título / Referencia"
          required={true}
          placeholder="Ej: Vuelo AR1234, Alquiler de Van, Auto de Juan"
          error={errors.title?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            type="datetime-local"
            {...register("startDate", { valueAsDate: true })}
            label="Salida / Inicio"
            error={errors.startDate?.message}
          />
          <NeumorphicInput
            type="datetime-local"
            {...register("endDate", { valueAsDate: true })}
            label="Llegada / Fin"
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

        {/* Toggle Campo Personal */}
        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200 shadow-neumorphic-inset-sm flex items-center justify-between transition-all duration-300">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-700">
              ¿Es transporte personal?
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("isPersonalTransport")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {isPersonalTransport && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <NeumorphicInput
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              label="Capacidad (Cant. de Personas)"
              placeholder="0"
              error={errors.capacity?.message}
            />
          </div>
        )}

        <NeumorphicInput
          type="textarea"
          {...register("description")}
          label="Notas adicionales"
          placeholder="Horarios, punto de encuentro, etc."
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
            : "Guardar Transporte"}
      </NeumorphicButton>
    </form>
  );
}