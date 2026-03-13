import React from "react";
import { Modal } from "@/components/ui/dialog/Modal";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCost } from "../hooks/useCostMutations";
import { EventCategory } from "@/types/tripio";
import { Icon } from "@/components/ui/Icon";

const expenseSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(50, "Máximo 50 caracteres"),
  amount: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "El monto debe ser mayor a 0",
    ),
  category: z.enum([
    "accommodation",
    "transport",
    "food",
    "activity",
    "other",
  ] as const),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  userId: string;
}

export const AddExpenseModal = ({
  isOpen,
  onClose,
  tripId,
  userId,
}: AddExpenseModalProps) => {
  const createCost = useCreateCost();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "other",
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await createCost.mutateAsync({
        tripId,
        data: {
          description: data.description,
          amount: Number(data.amount),
          category: data.category as EventCategory,
          linkedEventId: null,
          linkedProposalId: null,
          costType: "per_person",
          splitType: "custom",
          customSplit: { [userId]: Number(data.amount) },
          createdBy: userId,
        },
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Gasto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <NeumorphicInput
          label="Descripción"
          placeholder="Ej: Seguro de viaje"
          {...register("description")}
          error={errors.description?.message}
        />

        <NeumorphicInput
          label="Monto"
          type="number"
          placeholder="0.00"
          {...register("amount")}
          error={errors.amount?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 ml-1">
            Categoría
          </label>
          <div className="relative">
            <select
              {...register("category")}
              className="w-full h-12 px-4 rounded-xl bg-surface border-none shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main appearance-none"
            >
              <option value="accommodation">Alojamiento</option>
              <option value="transport">Transporte</option>
              <option value="food">Comida</option>
              <option value="activity">Actividad</option>
              <option value="other">Otro</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          {errors.category?.message && (
            <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1">
              <Icon name="warning" className="w-3 h-3" />
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="pt-4 flex gap-3">
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
            className="flex-1 flex justify-center items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Icon name="progress_activity" className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Guardando..." : "Guardar"}
          </NeumorphicButton>
        </div>
      </form>
    </Modal>
  );
};
