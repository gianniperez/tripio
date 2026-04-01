import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { useCreateProposal, useUpdateProposal } from "@/features/proposals/hooks/useProposals";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Timestamp } from "firebase/firestore";
import { UnifiedProposal } from "@/features/proposals/api/proposalsService";

interface TransportProposalFormProps {
  tripId: string;
  initialData?: UnifiedProposal;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransportProposalForm({
  tripId,
  initialData,
  onSuccess,
  onCancel,
}: TransportProposalFormProps) {
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
      departure:
        initialData?.rawData?.departure instanceof Timestamp
          ? initialData.rawData.departure.toDate().toISOString().split("T")[0]
          : "",
      arrival:
        initialData?.rawData?.arrival instanceof Timestamp
          ? initialData.rawData.arrival.toDate().toISOString().split("T")[0]
          : "",
      priceEstimate: initialData?.rawData?.priceEstimate || "",
      capacity: initialData?.rawData?.capacity || "4",
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
        departure: values.departure
          ? Timestamp.fromDate(new Date(values.departure + "T12:00:00"))
          : null,
        arrival: values.arrival ? Timestamp.fromDate(new Date(values.arrival + "T12:00:00")) : null,
        priceEstimate: values.priceEstimate ? Number(values.priceEstimate) : null,
        capacity: Number(values.capacity) || 4,
        description: values.notes || null,
      };

      if (isEdit) {
        await updateProposal({
          type: "transport",
          proposalId: initialData!.id,
          data: proposalData,
        });
      } else {
        await createProposal({
          type: "transport",
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
        label="Medio de Transporte"
        placeholder="Ej: Auto de Juan, Vuelo LATAM, Tren..."
        error={errors.title?.message?.toString()}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput label="Fecha de Salida" type="date" {...register("departure")} />
        <NeumorphicInput label="Fecha de Llegada" type="date" {...register("arrival")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput
          label="Costo Estimado"
          type="number"
          placeholder="0.00"
          {...register("priceEstimate")}
        />
        <NeumorphicInput label="Capacidad (pasajeros)" type="number" {...register("capacity")} />
      </div>

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Pros, contras, equipaje..."
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
          {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Sugerir Transporte"}
        </NeumorphicButton>
      </div>
    </form>
  );
}
