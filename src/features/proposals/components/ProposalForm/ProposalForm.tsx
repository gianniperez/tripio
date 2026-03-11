import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParticipants } from "@/features/participants/hooks";
import {
  Proposal,
  CreateProposalFormValues,
  createProposalSchema,
} from "../../types";
import { Trip } from "@/types/tripio";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import {
  FileText,
  AlignLeft,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

interface ProposalFormProps {
  onSubmit: (data: CreateProposalFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  defaultType?: string;
}

export const ProposalForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  tripId,
  trip,
  defaultType,
}: ProposalFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type:
        initialData?.type ||
        (defaultType as CreateProposalFormValues["type"]) ||
        "activity",
      estimatedCost: initialData?.estimatedCost ?? 0,
      location: initialData?.location || "",
      accessible: initialData?.accessible || false,
      isPersonalTransport: initialData?.isPersonalTransport || false,
      capacity: initialData?.capacity || undefined,
      quantity: initialData?.quantity || 1,
      assignedTo: initialData?.assignedTo || "",
      options: initialData?.options?.map((opt) => ({ value: opt })) || [],
      // Only pre-fill dates when editing an existing proposal
      startDate: initialData?.startDate?.toDate() || null,
      endDate: initialData?.endDate?.toDate() || null,
      deadline: initialData?.deadline?.toDate() || null,
      segmentId: initialData?.segmentId || "",
      responseType: initialData?.responseType || "rsvp",
    },
  });

  const { data: participants = [] } = useParticipants(tripId);

  const { data: userProfiles = {} } = useQuery({
    queryKey: ["users", participants.map((p) => p.uid)],
    queryFn: async () => {
      const profiles: Record<string, string> = {};
      for (const p of participants) {
        if (!p.uid) continue;
        const snap = await getDoc(doc(db, "users", p.uid));
        if (snap.exists()) {
          profiles[p.uid] = snap.data().displayName || p.uid;
        } else {
          profiles[p.uid] = p.uid;
        }
      }
      return profiles;
    },
    enabled: participants.length > 0,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const selectedType = useWatch({ control, name: "type" });
  const responseType = useWatch({ control, name: "responseType" });

  // Strict Conditional logic based on type
  const isActivity = selectedType === "activity";
  const isAccommodation = selectedType === "accommodation";
  const isTransport = selectedType === "transport";
  const isInventory = selectedType === "inventory";
  const isDestination = selectedType === "destination";

  const titlePlaceholder =
    {
      activity: "Ej: Cena en el puerto, Excursión...",
      accommodation: "Ej: Airbnb centro, Hotel Sol...",
      transport: "Ej: Vuelo LAX, Alquiler de auto...",
      inventory: "Ej: Protector solar, Cámara...",
      destination: "Ej: París, Playa del Carmen...",
    }[selectedType] || "Ej: Título de la propuesta";

  const isPersonalTransport = useWatch({
    control,
    name: "isPersonalTransport",
  });
  const watchedStartDate = useWatch({ control, name: "startDate" });

  const submitWrapper = (data: CreateProposalFormValues) => {
    const cleanedData = {
      ...data,
      options:
        data.responseType === "poll"
          ? data.options.filter((opt) => opt.value.trim() !== "")
          : [],
    };

    // Handle empty number input
    if (
      typeof cleanedData.estimatedCost !== "number" ||
      isNaN(cleanedData.estimatedCost)
    ) {
      cleanedData.estimatedCost = null;
    }

    // Clean conditional fields if not applicable
    if (!isActivity && !isAccommodation && !isTransport) {
      cleanedData.location = null;
      cleanedData.estimatedCost = null;
    }

    // Dates strategy
    if (isInventory || isDestination) {
      cleanedData.startDate = null;
      cleanedData.endDate = null;
    } else if (isActivity) {
      cleanedData.endDate = null; // Only one Date required for activity
    }

    if (!isTransport) {
      cleanedData.isPersonalTransport = null;
      cleanedData.capacity = null;
    } else if (!cleanedData.isPersonalTransport) {
      cleanedData.capacity = null;
    }

    if (!isInventory) {
      cleanedData.quantity = null;
      cleanedData.assignedTo = null;
    }
    // Validate poll options: need at least 2
    if (cleanedData.responseType === "poll") {
      const validOptions = cleanedData.options.filter(
        (opt) => opt.value.trim() !== "",
      );
      if (validOptions.length < 2) {
        alert("Las encuestas necesitan al menos 2 opciones.");
        return;
      }
    }

    // Validate dates are within trip range
    const tripStart = trip.startDate?.toDate();
    const tripEnd = trip.endDate?.toDate();
    if (tripStart && cleanedData.startDate) {
      const proposalStart = new Date(cleanedData.startDate);
      if (proposalStart < tripStart) {
        alert(
          `La fecha de inicio no puede ser anterior al inicio del viaje (${tripStart.toLocaleDateString()}).`,
        );
        return;
      }
      if (tripEnd && proposalStart > tripEnd) {
        alert(
          `La fecha de inicio no puede ser posterior al fin del viaje (${tripEnd.toLocaleDateString()}).`,
        );
        return;
      }
    }
    if (tripEnd && cleanedData.endDate) {
      const proposalEnd = new Date(cleanedData.endDate);
      if (proposalEnd > tripEnd) {
        alert(
          `La fecha de fin no puede ser posterior al fin del viaje (${tripEnd.toLocaleDateString()}).`,
        );
        return;
      }
    }

    onSubmit(cleanedData);
  };

  return (
    <div className="w-full">
      {/* Visual error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs text-red-600 font-bold mb-1">
            Por favor, revisa los campos marcados:
          </p>
          <ul className="list-disc list-inside text-[10px] text-red-500">
            {Object.entries(errors).map(([key, err]) => (
              <li key={key}>{err?.message?.toString()}</li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={(e) => {
          void handleSubmit(submitWrapper)(e);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="col-span-1">
            <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Tipo
            </label>
            <select
              {...register("type")}
              className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main appearance-none"
            >
              <option value="activity">Actividad</option>
              <option value="accommodation">Alojamiento</option>
              <option value="transport">Transporte</option>
              <option value="inventory">Item para llevar</option>
              <option value="destination">Destino</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Título
            </label>
            <NeumorphicInput
              {...register("title")}
              placeholder={titlePlaceholder}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
            <AlignLeft className="w-3 h-3" /> Descripción (opcional)
          </label>
          <textarea
            {...register("description")}
            rows={2}
            className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main placeholder:text-gray-400 resize-none"
            placeholder={
              isInventory
                ? "Detalles del ítem (ej: color, marca)..."
                : "Detalles adicionales..."
            }
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
            🔗 Link de referencia (opcional)
          </label>
          <NeumorphicInput
            {...register("referenceUrl")}
            placeholder="https://..."
            className="w-full"
          />
        </div>

        {isInventory && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-primary/70" /> Asignado a
                (Opcional)
              </label>
              <select
                {...register("assignedTo")}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main appearance-none"
              >
                <option value="">Sin asignar</option>
                {participants.map((p) => (
                  <option key={p.uid} value={p.uid}>
                    {userProfiles[p.uid] || "Cargando..."}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Plus className="w-3 h-3 text-primary/70" /> Cantidad
              </label>
              <NeumorphicInput
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="1"
                className="w-full"
              />
            </div>
          </div>
        )}

        {isTransport && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex items-center h-full pt-6">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isPersonalTransport")}
                  className="w-4 h-4 accent-primary rounded"
                />
                Es personal / Auto propio
              </label>
            </div>
            {isPersonalTransport && (
              <div className="col-span-1">
                <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Plus className="w-3 h-3 text-primary/70" /> Capacidad
                  (Personas)
                </label>
                <NeumorphicInput
                  type="number"
                  {...register("capacity", { valueAsNumber: true })}
                  placeholder="5"
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {(isActivity || isAccommodation || isTransport) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary/70" />{" "}
                {isAccommodation
                  ? "Dirección / Link"
                  : isTransport
                    ? "Punto de Salida / Ubicación"
                    : "Ubicación / Dirección"}
              </label>
              <NeumorphicInput
                {...register("location")}
                placeholder={
                  isAccommodation ? "Link o dirección" : "Ej: Centro histórico"
                }
                className="w-full"
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-green-500/70" />{" "}
                {isAccommodation ? "Costo Total" : "Costo"}
              </label>
              <NeumorphicInput
                type="number"
                {...register("estimatedCost", { valueAsNumber: true })}
                placeholder="0"
                className="w-full"
              />
            </div>
          </div>
        )}

        {isActivity && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Fecha y Hora
              </label>
              <input
                type="datetime-local"
                {...register("startDate", { valueAsDate: true })}
                min={
                  trip.startDate?.toDate().toISOString().slice(0, 16) ||
                  new Date().toISOString().slice(0, 16)
                }
                max={trip.endDate?.toDate().toISOString().slice(0, 16)}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main"
              />
            </div>
            <div className="col-span-1">
              <p className="text-[10px] text-slate-500 italic mt-1 ml-1 leading-tight">
                * Para verla en el Itinerario/Calendario, debe tener fecha.
              </p>
            </div>
          </div>
        )}

        {(isAccommodation || isTransport) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {isAccommodation ? "Check-in" : "Fecha y Hora de Salida"}
              </label>
              <input
                type={isAccommodation ? "date" : "datetime-local"}
                {...register("startDate", { valueAsDate: true })}
                min={
                  trip.startDate?.toDate().toISOString().split("T")[0] ||
                  new Date().toISOString().split("T")[0]
                }
                max={trip.endDate?.toDate().toISOString().split("T")[0]}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {isAccommodation ? "Check-out" : "Fecha y Hora de Llegada"}
              </label>
              <input
                type={isAccommodation ? "date" : "datetime-local"}
                {...register("endDate", { valueAsDate: true })}
                min={
                  watchedStartDate
                    ? new Date(watchedStartDate).toISOString().split("T")[0]
                    : trip.startDate?.toDate().toISOString().split("T")[0] ||
                      new Date().toISOString().split("T")[0]
                }
                max={trip.endDate?.toDate().toISOString().split("T")[0]}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main"
              />
            </div>
            {isAccommodation && (
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500 italic mt-1 ml-1 leading-tight">
                  * Un alojamiento de definirá tus Etapas y Tramos del viaje.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 mt-2 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">
              Tipo de Decisión
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  value="rsvp"
                  {...register("responseType")}
                  className="accent-primary w-4 h-4"
                />
                Confirmación (Sí/No/Tal vez)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  value="poll"
                  {...register("responseType")}
                  className="accent-primary w-4 h-4"
                />
                Encuesta (Opciones múltiples)
              </label>
            </div>
          </div>

          {responseType === "poll" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-slate-700 mb-1 block">
                Opciones
              </label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  <NeumorphicInput
                    {...register(`options.${index}.value`)}
                    placeholder={`Opción ${index + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="mt-3 text-sm font-bold text-primary flex items-center hover:opacity-80 transition-opacity bg-primary/5 px-3 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1" /> Añadir opción
              </button>
            </div>
          )}
        </div>

        <div className="pt-6">
          <NeumorphicButton
            type="submit"
            variant="primary"
            className="w-full text-lg shadow-vibrant"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? initialData
                ? "Actualizando..."
                : "Creando..."
              : initialData
                ? "Actualizar"
                : "Crear"}
          </NeumorphicButton>
        </div>
      </form>
    </div>
  );
};
