"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NeumorphicInput } from "@/components/NeumorphicInput";
import { NeumorphicButton } from "@/components/NeumorphicButton";
import { Modal } from "@/components/ui/dialog/Modal";
import { createTripSchema } from "../../types";
import { useCreateTrip } from "../../hooks";
import { MapPin, Type, Calendar } from "lucide-react";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const CreateTripModal = ({
  isOpen,
  onClose,
  userId,
}: CreateTripModalProps) => {
  const { mutate: createTrip, isPending } = useCreateTrip();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.input<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      destination: "",
      startDate: undefined,
      endDate: undefined,
      currency: "USD",
    },
  });

  const onSubmit = (data: z.input<typeof createTripSchema>) => {
    // Transform input to output values according to schema
    const validatedData = createTripSchema.parse(data);
    createTrip(
      { ...validatedData, userId },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Viaje">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-1">
        <NeumorphicInput
          label="Nombre del Viaje *"
          placeholder="Ej: Expedición Patagonia"
          leftIcon={<Type size={18} />}
          error={errors.name?.message}
          {...register("name")}
        />

        <NeumorphicInput
          label="Destino"
          placeholder="Ej: Bariloche, Argentina (opcional)"
          leftIcon={<MapPin size={18} />}
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
          <div className="flex flex-col gap-2 w-full">
            <label className="font-display text-sm font-semibold ml-2 text-text-main">
              Moneda Principal del Viaje
            </label>
            <select
              {...register("currency")}
              className="bg-white rounded-tripio w-full px-4 py-3 shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-text-main appearance-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ARS">ARS</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <NeumorphicButton
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </NeumorphicButton>
          <NeumorphicButton
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? "Creando..." : "Crear Viaje"}
          </NeumorphicButton>
        </div>
      </form>
    </Modal>
  );
};
