import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicToggle } from "@/components/neumorphic/NeumorphicToggle";
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
    watch,
    control,
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
      isPersonal: initialData?.rawData?.isPersonal || false,
      capacity: initialData?.rawData?.capacity || 4,
      priceEstimate: initialData?.rawData?.priceEstimate || "",
      notes: initialData?.description || "",
    },
  });

  const isPersonal = watch("isPersonal");

  const onSubmit = async (values: Record<string, any>) => {
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
        isPersonal: values.isPersonal,
        capacity: values.isPersonal ? Number(values.capacity) : null,
        priceEstimate: values.priceEstimate ? Number(values.priceEstimate) : null,
        notes: values.notes || null,
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
        error={errors.title?.message as string}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput label="Fecha de Salida" type="date" {...register("departure")} />
        <NeumorphicInput label="Fecha de Llegada" type="date" {...register("arrival")} />
      </div>

      <Controller
        name="isPersonal"
        control={control}
        render={({ field }) => (
          <NeumorphicToggle
            checked={field.value}
            onChange={field.onChange}
            label="¿Es transporte personal? (Ej. Mi auto)"
            className="px-1"
          />
        )}
      />

      {isPersonal && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <NeumorphicInput
            label="Capacidad (Cant de Pasajeros)"
            type="number"
            min="1"
            {...register("capacity", { min: 1 })}
          />
        </div>
      )}

      <NeumorphicInput
        label="Costo Estimado"
        type="number"
        placeholder="0.00"
        {...register("priceEstimate")}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Cualquier detalle extra..."
        {...register("notes")}
      />

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <NeumorphicButton type="submit" variant="primary" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Sugerir Transporte"}
      </NeumorphicButton>
    </form>
  );
}
