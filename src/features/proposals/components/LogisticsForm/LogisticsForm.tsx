"use client";
import { clsx } from "clsx";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProposalSchema, CreateProposalFormValues } from "../../types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { Icon } from "@/components/ui/Icon";
import { VotingSection } from "../VotingSection/VotingSection";
import { FilterTabBar, Tab } from "@/components/ui/FilterTabBar";
import { logisticsFormConfig } from "../../data/logisticsForms";
import { LogisticsFormProps } from "./LogisticsForm.types";

export const LogisticsForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  defaultType = null,
  onTypeChange,
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
      estimatedCost: initialData?.estimatedCost,
      location: initialData?.location || "",
      startDate: initialData?.startDate?.toDate() || null,
      endDate: initialData?.endDate?.toDate() || null,
      responseType: initialData?.responseType || "rsvp",
      requiresVoting: initialData?.requiresVoting ?? true,
      options: initialData?.options?.map((opt: any) => ({ value: opt })) || [],
      isPersonalTransport: initialData?.isPersonalTransport ?? false,
      capacity: initialData?.capacity,
      referenceUrl: initialData?.referenceUrl || "",
    },
  });

  const watchedType = watch("type");
  const isPersonalTransport = watch("isPersonalTransport");

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
          onTabChange={(id) => {
            const newType = id as "accommodation" | "transport";
            setValue("type", newType);
            onTypeChange?.(newType);
          }}
          className="bg-gray-100/50 shadow-neumorphic-inset-sm border-none"
        />

        {watchedType && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              {logisticsFormConfig[watchedType].inputs.map((input) => {
                // Validación de visibilidad condicional
                if (input.showIf && !input.showIf(watch())) return null;

                const inputProps = {
                  ...register(
                    input.name as any,
                    {
                      ...(input.type === "number" && { valueAsNumber: true }),
                      ...(input.type === "datetime-local" && {
                        valueAsDate: true,
                      }),
                    } as any,
                  ),
                  label: input.label,
                  type: input.type === "toggle" ? "checkbox" : input.type,
                  placeholder: input.placeholder,
                  required: input.required,
                  error: (errors as any)[input.name]?.message,
                };

                // Renderizado especial paraToggle
                if (input.type === "toggle") {
                  return (
                    <div
                      key={input.name}
                      className="col-span-2 bg-gray-50 p-4 rounded-3xl border border-gray-200 shadow-neumorphic-inset-sm flex items-center justify-between transition-all duration-300"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">
                          {input.label}
                        </span>
                        {input.placeholder && (
                          <span className="text-[10px] text-gray-500">
                            {input.placeholder}
                          </span>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(input.name as any)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  );
                }

                return (
                  <div
                    key={input.name}
                    className={clsx(
                      input.gridCols === 1 ? "col-span-1" : "col-span-2",
                      "animate-in fade-in slide-in-from-top-2 duration-300",
                    )}
                  >
                    <NeumorphicInput {...inputProps} />
                  </div>
                );
              })}
            </div>

            <VotingSection
              register={register}
              control={control}
              watch={watch}
              errors={errors}
            />

            <NeumorphicButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : initialData
                  ? "Guardar Cambios"
                  : logisticsFormConfig[watchedType]?.cta || "Crear Propuesta"}
            </NeumorphicButton>
          </div>
        )}
      </div>
    </form>
  );
};
