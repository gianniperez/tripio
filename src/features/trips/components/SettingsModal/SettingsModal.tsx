import React, { useEffect, useState } from "react";
import { useTrip, useUpdateTrip, useDeleteTrip } from "@/features/trips/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTripSchema } from "@/features/trips/types";
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
  Users,
  ToggleLeft,
  Trash2,
  Image as LucideImage,
  LayoutGrid,
  Package,
  Wallet,
  Settings,
} from "lucide-react";
import { ParticipantsManager } from "@/features/participants/components/ParticipantsManager/ParticipantsManager";
import { useParticipants, useRemoveParticipant, useInviteParticipant } from "@/features/participants/hooks";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateParticipant } from "@/features/trips/hooks";
import Image from "next/image";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

type TabType = "general" | "features" | "participants";

export const SettingsModal = ({
  isOpen,
  onClose,
  tripId,
}: SettingsModalProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: trip, isLoading } = useTrip(tripId);
  const { data: participants = [] } = useParticipants(tripId);
  const updateMutation = useUpdateTrip();
  const deleteMutation = useDeleteTrip();
  const updateParticipantMutation = useUpdateParticipant();
  const removeParticipantMutation = useRemoveParticipant();
  const inviteParticipantMutation = useInviteParticipant(tripId, trip?.name || "Viaje");
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
  });

  const currentCoverImage = watch("coverImage");
  const enabledFeatures = watch("enabledFeatures");

  useEffect(() => {
    if (trip) {
      // Ensure all features are present, default to true if missing (for legacy trips)
      const features = {
        logistics: trip.enabledFeatures?.logistics ?? true,
        activities: trip.enabledFeatures?.activities ?? true,
        inventory: trip.enabledFeatures?.inventory ?? true,
        finances: trip.enabledFeatures?.finances ?? true,
      };
      
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
        enabledFeatures: features,
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
          enabledFeatures: values.enabledFeatures,
        },
      });

      // Date range validation logic (kept from original)
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
            batch.update(proposalDoc.ref, {
              status: "pending",
              votes: {},
              optionVotes: {},
              confirmedAt: null,
            });
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

  const ToggleFeature = ({ name, label, icon: Icon }: { name: keyof NonNullable<z.input<typeof createTripSchema>["enabledFeatures"]>, label: string, icon: React.ElementType }) => {
    const isEnabled = enabledFeatures?.[name];
    return (
      <div 
        onClick={() => setValue(`enabledFeatures.${name}`, !isEnabled, { shouldDirty: true })}
        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
          isEnabled ? "bg-primary/5 border border-primary/10" : "bg-gray-50 border border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isEnabled ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-400"}`}>
            <Icon size={18} />
          </div>
          <span className={`text-sm font-bold ${isEnabled ? "text-primary" : "text-gray-500"}`}>{label}</span>
        </div>
        <div className={`w-10 h-5 rounded-full relative transition-all ${isEnabled ? "bg-primary" : "bg-gray-300"}`}>
          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isEnabled ? "right-1" : "left-1"}`} />
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administrar Viaje">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 font-medium">Cargando...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs Navigation */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl shadow-neumorphic-inset-sm">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "general" ? "bg-white shadow-neumorphic-sm text-primary" : "text-gray-400"
              }`}
            >
              <Settings size={14} />
              General
            </button>
            <button
              onClick={() => setActiveTab("features")}
              className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "features" ? "bg-white shadow-neumorphic-sm text-primary" : "text-gray-400"
              }`}
            >
              <ToggleLeft size={14} />
              Features
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "participants" ? "bg-white shadow-neumorphic-sm text-primary" : "text-gray-400"
              }`}
            >
              <Users size={14} />
              Personas
            </button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === "general" && (
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

                  <NeumorphicInput
                    label="Moneda Principal"
                    placeholder="USD"
                    {...register("currency")}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 ml-1">Portada</label>
                    {currentCoverImage && (
                      <div className="w-full h-32 rounded-2xl overflow-hidden mb-2 relative">
                      <Image src={currentCoverImage} alt="Portada" fill className="object-cover" />
                    </div>
                    )}
                    <NeumorphicInput
                      leftIcon={<LucideImage size={18} />}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      error={errors.coverImage?.message}
                      {...register("coverImage")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 ml-1">Descripción</label>
                    <textarea
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm shadow-neumorphic-inset-sm min-h-[100px]"
                      placeholder="Cuéntanos más..."
                      {...register("description")}
                    />
                  </div>
                </div>

                <NeumorphicButton type="submit" variant="primary" className="w-full py-4" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                  GUARDAR CAMBIOS
                </NeumorphicButton>

                <div className="pt-4 border-t border-gray-100">
                  {!showConfirmDelete ? (
                    <button type="button" onClick={() => setShowConfirmDelete(true)} className="flex items-center justify-center w-full py-3 text-red-500 text-xs font-bold hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={14} className="mr-2" />
                      ELIMINAR VIAJE
                    </button>
                  ) : (
                    <div className="space-y-3 p-4 bg-red-50 rounded-2xl">
                      <p className="text-[10px] text-red-600 font-black text-center uppercase tracking-wider">¿Estás seguro? Se borrará todo.</p>
                      <div className="flex gap-2">
                        <NeumorphicButton variant="danger" className="flex-1 py-2 text-xs" onClick={handleDelete}>SÍ, BORRAR</NeumorphicButton>
                        <NeumorphicButton variant="secondary" className="flex-1 py-2 text-xs" onClick={() => setShowConfirmDelete(false)}>NO</NeumorphicButton>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}

            {activeTab === "features" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-medium px-1">Activa o desactiva las secciones principales del viaje.</p>
                <div className="grid gap-3">
                  <ToggleFeature name="activities" label="Actividades" icon={LayoutGrid} />
                  <ToggleFeature name="inventory" label="Inventario" icon={Package} />
                  <ToggleFeature name="finances" label="Finanzas" icon={Wallet} />
                  <ToggleFeature name="logistics" label="Logística" icon={Calendar} />
                </div>
                <div className="pt-6">
                  <NeumorphicButton variant="primary" className="w-full" onClick={handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                    GUARDAR PREFERENCIAS
                  </NeumorphicButton>
                </div>
              </div>
            )}

            {activeTab === "participants" && (
              <div className="space-y-4">
                  <ParticipantsManager 
                    participants={participants}
                    currentUserId={currentUser?.uid || ""}
                    onUpdateRole={(participantId, role) => 
                      updateParticipantMutation.mutate({ tripId, participantId, data: { role } })
                    }
                    onUpdatePermissions={(participantId, customPermissions) => 
                      updateParticipantMutation.mutate({ tripId, participantId, data: { customPermissions } })
                    }
                    onRemoveParticipant={(participantId) => 
                      removeParticipantMutation.mutate({ tripId, participantId })
                    }
                    onInviteParticipant={async (role) => {
                      const id = await inviteParticipantMutation.mutateAsync({ 
                        role, 
                        invitedByToken: currentUser?.uid || "", 
                        invitedByName: currentUser?.displayName || "Admin" 
                      });
                      return id;
                    }}
                  />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
