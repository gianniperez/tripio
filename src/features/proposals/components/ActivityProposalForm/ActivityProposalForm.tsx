import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { useCreateProposal, useUpdateProposal } from "@/features/proposals/hooks/useProposals";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Timestamp } from "firebase/firestore";
import { UnifiedProposal } from "@/features/proposals/api/proposalsService";

interface ActivityProposalFormProps {
  tripId: string;
  initialData?: UnifiedProposal;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ActivityProposalForm({
  tripId,
  initialData,
  onSuccess,
  onCancel,
}: ActivityProposalFormProps) {
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
      date:
        initialData?.rawData?.date instanceof Timestamp
          ? initialData.rawData.date.toDate().toISOString().split("T")[0]
          : "",
      startTime:
        initialData?.rawData?.startTime instanceof Timestamp
          ? initialData.rawData.startTime.toDate().toTimeString().slice(0, 5)
          : "",
      costImpact: initialData?.rawData?.costImpact || "",
      notes: initialData?.description || "",
    },
  });

  const onSubmit = async (values: Record<string, any>) => {
    console.log("[FORM_DEBUG] onSubmit started with values:", values);

    if (!currentUser) {
      console.error("[FORM_DEBUG] currentUser is NULL! Form submission aborted.");
      setError("Usuario no autenticado, intenta recargar la página.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      console.log("[FORM_DEBUG] currentUser IS ok:", currentUser.uid);

      let combinedDate: Date | null = values.date ? new Date(values.date + "T12:00:00") : null;
      if (combinedDate && values.startTime) {
        const [hours, minutes] = values.startTime.split(":").map(Number);
        combinedDate = new Date(combinedDate);
        combinedDate.setHours(hours, minutes, 0, 0);
      }

      const proposalData = {
        title: values.title,
        location: values.location || null,
        locationUrl: values.location || null,
        date: combinedDate ? Timestamp.fromDate(combinedDate) : null,
        startTime: combinedDate && values.startTime ? Timestamp.fromDate(combinedDate) : null,
        costImpact: values.costImpact ? Number(values.costImpact) : null,
        description: values.notes || null,
      };

      console.log("[FORM_DEBUG] Dispatching...", isEdit ? "update" : "create", proposalData);

      if (isEdit) {
        await updateProposal({
          type: "activity",
          proposalId: initialData!.id,
          data: proposalData,
        });
      } else {
        await createProposal({
          type: "activity",
          userId: currentUser.uid,
          data: proposalData,
        });
      }

      console.log("[FORM_DEBUG] Proposal processed successfully in Firebase.");
      onSuccess();
    } catch (e) {
      console.error("[FORM_DEBUG] Error during submission:", e);
      setError("Error al guardar propuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.error("[FORM_DEBUG] Validation failed:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      <NeumorphicInput
        label="Título de la Actividad"
        placeholder="Ej: Cena en el puerto"
        error={errors.title?.message as string}
        required
        {...register("title", { required: "El título es obligatorio" })}
      />

      <NeumorphicInput
        label="Ubicación"
        placeholder="Ej: Restaurante La Marina"
        {...register("location")}
      />

      <div className="grid grid-cols-2 gap-4">
        <NeumorphicInput label="Fecha" type="date" {...register("date")} />
        <NeumorphicInput label="Hora" type="time" {...register("startTime")} />
      </div>

      <NeumorphicInput
        label="Costo Estimado"
        type="number"
        placeholder="0.00"
        {...register("costImpact")}
      />

      <NeumorphicInput
        label="Notas adicionales"
        type="textarea"
        placeholder="Cualquier detalle extra..."
        {...register("notes")}
      />

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <NeumorphicButton type="submit" variant="primary" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Sugerir Actividad"}
      </NeumorphicButton>
    </form>
  );
}
