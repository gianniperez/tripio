"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProposalSchema, CreateProposalFormValues } from "../../types";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { VotingSection } from "../VotingSection/VotingSection";
import { InventoryFormProps } from "./InventoryForm.types";

export const InventoryForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  defaultIsPersonal = true,
}: InventoryFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: "inventory",
      estimatedCost: initialData?.estimatedCost,
      quantity: initialData?.quantity,
      assignedTo: initialData?.assignedTo || "",
      isPersonal: initialData?.isPersonal ?? defaultIsPersonal,
      inventoryCategory: initialData?.inventoryCategory || "General",
      responseType: initialData?.responseType || "rsvp",
      requiresVoting:
        initialData?.requiresVoting ?? (defaultIsPersonal ? false : true),
      options: initialData?.options?.map((opt) => ({ value: opt })) || [],
    },
  });

  const isPersonal = watch("isPersonal");

  const categories = [
    { value: "General", label: "General" },
    { value: "Ropa", label: "Ropa" },
    { value: "Electrónica", label: "Electrónica" },
    { value: "Salud", label: "Salud / Aseo" },
    { value: "Documentos", label: "Documentos" },
    { value: "Comida", label: "Comida / Bebida" },
    { value: "Equipo", label: "Equipo / Herramientas" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Toggle Personal / Grupal */}
        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200 shadow-neumorphic-inset-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-700">
              Ítem Personal
            </span>
            <span className="text-xs text-gray-500">
              ¿Solo tú necesitas esto?
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("isPersonal")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        <NeumorphicInput
          {...register("title")}
          label="¿Qué necesitas llevar?"
          required={true}
          placeholder="Ej: Protector solar"
          error={errors.title?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            label="Categoría"
            type="select"
            {...register("inventoryCategory")}
            options={categories}
          />
          <NeumorphicInput
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            label="Cantidad"
            placeholder="1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            type="number"
            {...register("estimatedCost", { valueAsNumber: true })}
            label="Costo (opcional)"
            placeholder="0"
          />
          {!isPersonal && (
            <NeumorphicInput
              {...register("assignedTo")}
              label="Asignar a"
              placeholder="Nombre del encargado"
            />
          )}
        </div>

        <NeumorphicInput
          {...register("description")}
          label="Descripción o notas"
          type="textarea"
          placeholder="Cualquier aclaración sobre el ítem..."
        />
      </div>

      {!isPersonal && (
        <VotingSection
          register={register}
          control={control}
          watch={watch}
          errors={errors}
        />
      )}

      <NeumorphicButton type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting
          ? "Guardando..."
          : initialData
            ? "Guardar Cambios"
            : "Añadir al Inventario"}
      </NeumorphicButton>
    </form>
  );
};
