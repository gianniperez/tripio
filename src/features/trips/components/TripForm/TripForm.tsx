"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema } from "../../types";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
import { TripFormProps, TripFormValues } from "./TripForm.types";

export const TripForm = ({
  onSubmit,
  defaultValues,
  isPending,
  submitLabel = "Guardar",
  onCancel,
}: TripFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      currency: "USD",
      description: "",
      coverImage: "",
      ...defaultValues,
    },
  });

  const startDate = useWatch({ control, name: "startDate" });
  const currentCoverImage = useWatch({ control, name: "coverImage" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <NeumorphicInput
          label="Nombre del Viaje"
          placeholder="Ej: Expedición Patagonia"
          icon={<Icon name="label" size={18} />}
          required={true}
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="grid grid-cols-2 gap-4">
          <NeumorphicInput
            label="Fecha de Inicio"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <NeumorphicInput
            label="Fecha de Fin"
            type="date"
            error={errors.endDate?.message}
            min={
              startDate
                ? new Date(startDate as string | number | Date)
                    .toISOString()
                    .split("T")[0]
                : undefined
            }
            {...register("endDate")}
          />
        </div>

        <NeumorphicInput
          label="Moneda Principal"
          type="select"
          required={true}
          placeholder="Selecciona moneda..."
          {...register("currency")}
          options={[
            { value: "ARS", label: "Peso Argentino (ARS)" },
            { value: "USD", label: "Dólar Estadounidense (USD)" },
            { value: "EUR", label: "Euro (EUR)" },
            { value: "BRL", label: "Real Brasileño (BRL)" },
            { value: "CLP", label: "Peso Chileno (CLP)" },
            { value: "UYU", label: "Peso Uruguayo (UYU)" },
          ]}
          error={errors.currency?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 ml-1">
            Portada
          </label>
          {currentCoverImage && (
            <div className="w-full h-32 rounded-2xl overflow-hidden mb-2 relative">
              <Image
                src={currentCoverImage}
                alt="Portada"
                fill
                className="object-cover"
              />
            </div>
          )}
          <NeumorphicInput
            icon={<Icon name="image" size={18} />}
            placeholder="https://ejemplo.com/imagen.jpg"
            error={errors.coverImage?.message}
            {...register("coverImage")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 ml-1">
            Descripción
          </label>
          <textarea
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm shadow-gray-inset min-h-[100px] focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            placeholder="Cuéntanos más..."
            {...register("description")}
          />
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        {onCancel && (
          <NeumorphicButton
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
          >
            Cancelar
          </NeumorphicButton>
        )}
        <NeumorphicButton
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isPending}
        >
          {isPending ? (
            <Icon
              name="progress_activity"
              size={18}
              className="animate-spin mr-2"
            />
          ) : (
            <Icon name="save" size={18} className="mr-2" />
          )}
          {submitLabel}
        </NeumorphicButton>
      </div>
    </form>
  );
};
