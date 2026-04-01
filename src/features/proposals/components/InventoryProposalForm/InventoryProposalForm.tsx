import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { useCreateProposal, useUpdateProposal } from "@/features/proposals/hooks/useProposals";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { UnifiedProposal } from "@/features/proposals/api/proposalsService";

interface InventoryProposalFormProps {
  tripId: string;
  initialData?: UnifiedProposal;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InventoryProposalForm({
  tripId,
  initialData,
  onSuccess,
  onCancel,
}: InventoryProposalFormProps) {
  const { currentUser } = useAuthStore();
  const { mutateAsync: createProposal } = useCreateProposal(tripId);
  const { mutateAsync: updateProposal } = useUpdateProposal(tripId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.rawData?.category || "general",
      quantity: initialData?.rawData?.quantity || "1",
      priceEstimate: initialData?.rawData?.priceEstimate || "",
      notes: initialData?.description || "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const proposalData = {
        title: values.title,
        category: values.category || "general",
        quantity: Number(values.quantity) || 1,
        priceEstimate: values.priceEstimate ? Number(values.priceEstimate) : null,
        description: values.notes || null,
      };

      if (isEdit) {
        await updateProposal({
          type: "inventory",
          proposalId: initialData!.id,
          data: proposalData,
        });
      } else {
        await createProposal({
          type: "inventory",
          userId: currentUser.uid,
          data: proposalData,
        });
      }

      onSuccess();
    } catch (e) {
      console.error(e);
      setError("Error al guardar propuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <NeumorphicInput
        label="Nombre del Ítem"
        placeholder="Ej: Carbón, Carpa, Heladera"
        error={errors.title?.message?.toString()}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <NeumorphicInput
        type="select"
        label="Categoría"
        required
        {...register("category")}
        options={[
          { label: "General", value: "general" },
          { label: "Salud / Farmacia", value: "salud" },
          { label: "Comida / Bebida", value: "comida" },
          { label: "Ropa / Equipo", value: "equipo" },
          { label: "Electrónica", value: "electronica" },
          { label: "Documentación", value: "documentacion" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Cantidad"
          type="number"
          min="1"
          {...register("quantity", { min: 1 })}
        />
        <NeumorphicInput
          label="Prepuesto Estimado"
          type="number"
          placeholder="0.00"
          {...register("priceEstimate")}
        />
      </div>

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Ej: Tenemos que comprar 2 bolsas de 3kg"
        {...register("notes")}
      />

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div className="flex gap-4 mt-6">
        <NeumorphicButton type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </NeumorphicButton>
        <NeumorphicButton
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Sugerir Ítem"}
        </NeumorphicButton>
      </div>
    </form>
  );
}
