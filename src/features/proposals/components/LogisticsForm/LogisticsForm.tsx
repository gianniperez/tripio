"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProposalSchema, CreateProposalFormValues } from "../../types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { Icon } from "@/components/ui/Icon";
import { VotingSection } from "../VotingSection/VotingSection";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { LogisticsFormProps } from "./LogisticsForm.types";

export const LogisticsForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  defaultType = "accommodation",
}: LogisticsFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: (initialData?.type as any) || defaultType,
      estimatedCost: initialData?.estimatedCost ?? 0,
      location: initialData?.location || "",
      startDate: initialData?.startDate?.toDate() || null,
      endDate: initialData?.endDate?.toDate() || null,
      responseType: initialData?.responseType || "rsvp",
      requiresVoting: initialData?.requiresVoting ?? true,
      options: initialData?.options?.map((opt: any) => ({ value: opt })) || [],
      isPersonalTransport: initialData?.isPersonalTransport ?? false,
      capacity: initialData?.capacity ?? 0,
      referenceUrl: initialData?.referenceUrl || "",
    },
  });

  const watchedType = watch("type");

  const tabs: Tab[] = [
    { id: "accommodation", label: "Alojamiento", icon: <Icon name="hotel" /> },
    {
      id: "transport",
      label: "Transporte",
      icon: <Icon name="directions_car" />,
    },
  ];

  const handleFormSubmit = (data: CreateProposalFormValues) => {
    // Validaciones de fechas
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
        {/* Selector de Tipo */}
        <FilterTabBar
          tabs={tabs}
          activeTab={watchedType}
          onTabChange={(id) => setValue("type", id as any)}
          className="bg-gray-100/50 shadow-neumorphic-inset-sm border-none"
        />

        <NeumorphicInput
          {...register("title")}
          label="Título / Nombre"
          required={true}
          placeholder={
            watchedType === "accommodation"
              ? "Ej: Hotel Central"
              : "Ej: Vuelo AR1234"
          }
          error={errors.title?.message}
        />

        <NeumorphicInput
          {...register("location")}
          label="Ubicación / Dirección"
          placeholder="Ej: Av. Siempreviva 123"
        />

        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            type="datetime-local"
            {...register("startDate", { valueAsDate: true })}
            label="Desde"
            placeholder="Check-in"
          />
          <NeumorphicInput
            type="datetime-local"
            {...register("endDate", { valueAsDate: true })}
            label="Hasta"
            placeholder="Check-out"
            error={errors.endDate?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            type="number"
            {...register("estimatedCost", { valueAsNumber: true })}
            label="Costo Estimado"
            placeholder="0"
          />
          <NeumorphicInput
            {...register("referenceUrl")}
            label="Link de Referencia"
            placeholder="https://..."
            error={errors.referenceUrl?.message}
          />
        </div>

        {watchedType === "transport" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200 shadow-neumorphic-inset-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">
                  Transporte personal
                </span>
                <span className="text-[10px] text-gray-500">
                  ¿Vas en tu propio vehículo?
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
            <NeumorphicInput
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              label="Capacidad (personas)"
              placeholder="0"
            />
          </div>
        )}

        <NeumorphicInput
          {...register("description")}
          label="Notas adicionales"
          type="textarea"
          placeholder="Cualquier detalle importante..."
        />
      </div>

      <VotingSection
        register={register}
        control={control}
        watch={watch}
        errors={errors}
      />

      <NeumorphicButton type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting
          ? "Guardando..."
          : initialData
            ? "Guardar Cambios"
            : "Crear Propuesta"}
      </NeumorphicButton>
    </form>
  );
};
