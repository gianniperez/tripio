import React, { useEffect, useState } from "react";
import { useTrip, useUpdateTrip, useDeleteTrip } from "@/features/trips/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTripSchema } from "@/features/trips/types";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import {
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Type,
  Save,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  tripId,
}: SettingsModalProps) => {
  const router = useRouter();
  const { data: trip, isLoading } = useTrip(tripId);
  const updateMutation = useUpdateTrip();
  const deleteMutation = useDeleteTrip();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
  });

  const currentCoverImage = watch("coverImage");

  useEffect(() => {
    if (trip) {
      reset({
        name: trip.name,
        description: trip.description || "",
        startDate: trip.startDate
          ? trip.startDate.toDate().toISOString().split("T")[0]
          : undefined,
        endDate: trip.endDate
          ? trip.endDate.toDate().toISOString().split("T")[0]
          : undefined,
        currency: trip.currency || "USD",
        coverImage: trip.coverImage || "",
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data: z.input<typeof createTripSchema>) => {
    try {
      const values = createTripSchema.parse(data);
      const newStartDate = values.startDate
        ? Timestamp.fromDate(values.startDate)
        : null;
      const newEndDate = values.endDate
        ? Timestamp.fromDate(values.endDate)
        : null;

      await updateMutation.mutateAsync({
        tripId,
        data: {
          name: values.name,
          description: values.description || null,
          currency: values.currency,
          startDate: newStartDate,
          endDate: newEndDate,
          coverImage: values.coverImage || null,
        },
      });

      // Reset confirmed proposals whose dates fall outside the new trip range
      if (newStartDate || newEndDate) {
        const proposalsRef = collection(db, "trips", tripId, "proposals");
        const confirmedQuery = query(
          proposalsRef,
          where("status", "==", "confirmed"),
        );
        const snap = await getDocs(confirmedQuery);
        const batch = writeBatch(db);
        let hasResets = false;

        const tripStart = newStartDate?.toDate();
        const tripEnd = newEndDate?.toDate();

        for (const proposalDoc of snap.docs) {
          const p = proposalDoc.data();
          const pStart = p.startDate?.toDate?.();
          const pEnd = p.endDate?.toDate?.();

          if (!pStart && !pEnd) continue;

          const isOutOfRange =
            (tripStart && pStart && pStart < tripStart) ||
            (tripEnd && pStart && pStart > tripEnd) ||
            (tripEnd && pEnd && pEnd > tripEnd) ||
            (tripStart && pEnd && pEnd < tripStart);

          if (isOutOfRange) {
            // Reset proposal to pending, clear votes
            batch.update(proposalDoc.ref, {
              status: "pending",
              votes: {},
              optionVotes: {},
              confirmedAt: null,
            });

            // Delete linked events
            const eventsQ = query(
              collection(db, "trips", tripId, "events"),
              where("linkedProposalId", "==", proposalDoc.id),
            );
            const eventsSnap = await getDocs(eventsQ);
            eventsSnap.forEach((e) => batch.delete(e.ref));

            // Delete linked costs
            const costsQ = query(
              collection(db, "trips", tripId, "costs"),
              where("linkedProposalId", "==", proposalDoc.id),
            );
            const costsSnap = await getDocs(costsQ);
            costsSnap.forEach((c) => batch.delete(c.ref));

            hasResets = true;
          }
        }

        if (hasResets) {
          await batch.commit();
        }
      }

      onClose();
    } catch (error) {
      console.error("DEBUG - Update Error:", error);
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(tripId);
    onClose();
    router.push("/trips");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración del Viaje">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 font-medium">Cargando configuración...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <NeumorphicInput
                label="Nombre del Viaje"
                leftIcon={<Type size={18} />}
                placeholder="Ej. Roadtrip Europa 2025"
                error={errors.name?.message}
                {...register("name")}
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
                <NeumorphicInput
                  label="Moneda Principal del Viaje"
                  placeholder="USD"
                  {...register("currency")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 ml-1">
                    Foto de Portada (Enlace web)
                  </label>

                  {currentCoverImage && (
                    <div className="w-full h-32 rounded-2xl overflow-hidden mb-2 relative">
                      <img
                        src={currentCoverImage}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <NeumorphicInput
                    placeholder="https://images.unsplash..."
                    leftIcon={<ImageIcon size={18} />}
                    error={errors.coverImage?.message}
                    {...register("coverImage")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1">
                  Descripción
                </label>
                <textarea
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 shadow-neumorphic-inset-sm transition-all min-h-[100px]"
                  placeholder="Escribe algo sobre este viaje..."
                  {...register("description")}
                />
              </div>
            </div>

            <div className="pt-4">
              <NeumorphicButton
                type="submit"
                variant="primary"
                className="w-full py-4 text-sm font-black tracking-wide"
                disabled={updateMutation.isPending}
              >
                <div className="flex items-center justify-center gap-2">
                  {updateMutation.isPending ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  <span>
                    {updateMutation.isPending
                      ? "GUARDANDO..."
                      : "GUARDAR CAMBIOS"}
                  </span>
                </div>
              </NeumorphicButton>
            </div>
          </form>

          {/* Delete Section */}
          <div className="mt-8 mb-2">
            <h3 className="text-red-500 font-bold mb-4 px-2">
              Zona de Peligro
            </h3>
            <NeumorphicCard className="p-6 border border-red-100">
              {!showConfirmDelete ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-700">Eliminar Viaje</p>
                    <p className="text-sm text-gray-500">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                  <NeumorphicButton
                    variant="danger"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    Eliminar
                  </NeumorphicButton>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-red-600 font-bold text-sm">
                    ¿Estás completamente seguro de que quieres eliminar el viaje
                    &quot;{trip?.name}&quot;?
                  </p>
                  <div className="flex flex-col gap-3">
                    <NeumorphicButton
                      variant="danger"
                      className="w-full"
                      disabled={deleteMutation.isPending}
                      onClick={handleDelete}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 size={20} className="animate-spin mx-auto" />
                      ) : (
                        "Sí, eliminar para siempre"
                      )}
                    </NeumorphicButton>
                    <NeumorphicButton
                      variant="secondary"
                      className="w-full"
                      disabled={deleteMutation.isPending}
                      onClick={() => setShowConfirmDelete(false)}
                    >
                      Cancelar
                    </NeumorphicButton>
                  </div>
                </div>
              )}
            </NeumorphicCard>
          </div>
        </div>
      )}
    </Modal>
  );
};
