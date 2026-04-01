import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { useCreateProposal, useUpdateProposal } from "@/features/proposals/hooks/useProposals";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Timestamp } from "firebase/firestore";
import { UnifiedProposal } from "@/features/proposals/api/proposalsService";

interface AccommodationProposalFormProps {
  tripId: string;
  initialData?: UnifiedProposal;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AccommodationProposalForm({
  tripId,
  initialData,
  onSuccess,
  onCancel,
}: AccommodationProposalFormProps) {
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
      location: initialData?.rawData?.location || "",
      checkIn:
        initialData?.rawData?.checkIn instanceof Timestamp
          ? initialData.rawData.checkIn.toDate().toISOString().split("T")[0]
          : "",
      checkOut:
        initialData?.rawData?.checkOut instanceof Timestamp
          ? initialData.rawData.checkOut.toDate().toISOString().split("T")[0]
          : "",
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
        location: values.location || null,
        checkIn: values.checkIn ? Timestamp.fromDate(new Date(values.checkIn + "T12:00:00")) : null,
        checkOut: values.checkOut
          ? Timestamp.fromDate(new Date(values.checkOut + "T12:00:00"))
          : null,
        priceEstimate: values.priceEstimate ? Number(values.priceEstimate) : null,
        notes: values.notes || null,
      };

      if (isEdit) {
        await updateProposal({
          type: "accommodation",
          proposalId: initialData!.id,
          data: proposalData,
        });
      } else {
        await createProposal({
          type: "accommodation",
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
        label="Nombre del Alojamiento"
        placeholder="Ej: Airbnb en el centro"
        error={errors.title?.message?.toString()}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <NeumorphicInput
        label="Ubicación"
        placeholder="Dirección o enlace"
        {...register("location")}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput label="Check-in" type="date" {...register("checkIn")} />
        <NeumorphicInput label="Check-out" type="date" {...register("checkOut")} />
      </div>

      <NeumorphicInput
        label="Costo Estimado Total"
        type="number"
        placeholder="0.00"
        {...register("priceEstimate")}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Pros, contras, camas disponibles..."
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
          {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Sugerir Alojamiento"}
        </NeumorphicButton>
      </div>
    </form>
  );
}
