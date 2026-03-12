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
import { useProposals } from "../../hooks";
import { Trip } from "@/types/tripio";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { ContextualInfo } from "@/components/ui/ContextualInfo";
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Plus, 
  Package,
  User,
  FileText,
  AlignLeft,
  Trash2
} from "lucide-react";

interface ProposalFormProps {
  onSubmit: (data: CreateProposalFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  defaultType?: CreateProposalFormValues["type"];
  initialDestinationId?: string;
  onClose?: () => void;
  allowedTypes?: CreateProposalFormValues["type"][];
}

export const ProposalForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  tripId,
  trip,
  defaultType,
  allowedTypes,
}: ProposalFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
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
      requiresVoting: initialData?.requiresVoting ?? true,
      inventoryCategory: initialData?.inventoryCategory || "General",
      isPersonal: initialData?.isPersonal ?? false,
    },
  });

  const { data: participants = [] } = useParticipants(tripId);

  // Get other proposals if needed
  const { data: allProposals = [] } = useProposals(tripId);

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

  const titlePlaceholder =
    {
      activity: "Ej: Tour por el centro...",
      accommodation: "Ej: Hotel Palace, Airbnb...",
      transport: "Ej: Vuelo AR1234, Tren...",
      inventory: "Ej: Protector solar, Cámara...",
    }[selectedType] || "Ej: Título de la propuesta";

  const isPersonalTransport = useWatch({
    control,
    name: "isPersonalTransport",
  });
  const watchedStartDate = useWatch({ control, name: "startDate" });

  // Get YYYY-MM-DD for date inputs (Accommodation) or YYYY-MM-DDTHH:mm for datetime-local
  const toISO = (date: Date | null | undefined, includeTime: boolean = false) => {
    if (!date || isNaN(date.getTime())) return "";
    
    // For date-only (Accommodation), we always want the UTC day to avoid "day before" bugs
    // because valueAsDate on <input type="date"> works with UTC midnight.
    if (!includeTime) {
      return date.toISOString().split("T")[0];
    }

    // For datetime-local (Activity/Transport), we use local time as the user expects to see their local time
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  // Calculate the floor date (max of today and trip start)
  const getFloorDate = (includeTime: boolean = false) => {
    const today = new Date();
    if (!includeTime) {
      // Create a UTC midnight date for today to match valueAsDate behavior
      const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const tripStart = trip.startDate?.toDate();
      const floor = tripStart && tripStart > utcToday ? tripStart : utcToday;
      return toISO(floor, false);
    }
    
    today.setHours(0, 0, 0, 0);
    const tripStart = trip.startDate?.toDate();
    const floor = tripStart && tripStart > today ? tripStart : today;
    return toISO(floor, true);
  };

  const safeToLocalISO = (date: Date | null | undefined | string, includeTime: boolean = false) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return toISO(d, includeTime);
  };

  const floorDateISO = getFloorDate(true);
  const floorDateSimple = getFloorDate(false);

  const submitWrapper = (data: CreateProposalFormValues) => {
    const cleanedData = {
      ...data,
      options:
        data.responseType === "poll"
          ? data.options.filter((opt) => opt.value.trim() !== "")
          : [],
    };

    // Handle empty or invalid number input
    if (
      cleanedData.estimatedCost === undefined ||
      cleanedData.estimatedCost === null ||
      (typeof cleanedData.estimatedCost === "number" && isNaN(cleanedData.estimatedCost)) ||
      (typeof cleanedData.estimatedCost === "string" && (cleanedData.estimatedCost as string).trim() === "")
    ) {
      cleanedData.estimatedCost = null;
    }

    // Clean conditional fields if not applicable
    if (!isActivity && !isAccommodation && !isTransport) {
      cleanedData.location = null;
      cleanedData.estimatedCost = null;
    }

    // Dates strategy
    if (isInventory) {
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
      cleanedData.inventoryCategory = null;
      cleanedData.isPersonal = null;
    }

    // Clean destinationId - always clean it as we are removing destinations
    cleanedData.destinationId = null;

    // Validate poll options: need at least 2
    if (cleanedData.responseType === "poll") {
      const validOptions = cleanedData.options.filter(
        (opt) => opt.value.trim() !== "",
      );
      if (validOptions.length < 2) {
        return; 
      }
    }

    // Validate dates are within trip range and not in the past
    const tripStart = trip.startDate?.toDate();
    const tripEnd = trip.endDate?.toDate();
    const today = new Date();

    // Convert to Date objects that represent midnight local time for fair comparison
    const normalizeToMidnight = (d: Date | null | undefined, isUtcMidnight: boolean = false) => {
      if (!d || isNaN(d.getTime())) return null;
      if (isUtcMidnight) {
        // Extract UTC year, month, date, and create a LOCAL midnight Date
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      }
      // Just set to local midnight
      const newD = new Date(d);
      newD.setHours(0, 0, 0, 0);
      return newD;
    };

    if (cleanedData.startDate) {
      const proposalStartNode = new Date(cleanedData.startDate);
      // isAccommodation uses input type="date", which gives UTC midnight
      const proposalStart = normalizeToMidnight(proposalStartNode, isAccommodation);
      
      const todayMidnight = normalizeToMidnight(today);
      const tStart = normalizeToMidnight(tripStart, isAccommodation);
      const tEnd = tripEnd ? normalizeToMidnight(tripEnd, isAccommodation) : null;
      
      // Past date check
      if (proposalStart && todayMidnight && proposalStart < todayMidnight) {
        setError("startDate", { type: "manual", message: "La fecha no puede ser anterior a hoy" });
        return;
      }

      // Trip range check
      if (tStart && proposalStart && proposalStart < tStart) {
        setError("startDate", { type: "manual", message: "La fecha es anterior al inicio del viaje" });
        return;
      }
      if (tEnd && proposalStart && proposalStart > tEnd) {
        setError("startDate", { type: "manual", message: "La fecha es posterior al fin del viaje" });
        return;
      }
    }

    if (cleanedData.endDate) {
      const proposalEndNode = new Date(cleanedData.endDate);
      const proposalEnd = normalizeToMidnight(proposalEndNode, isAccommodation);
      const proposalStartNode = cleanedData.startDate ? new Date(cleanedData.startDate) : null;
      const proposalStart = proposalStartNode ? normalizeToMidnight(proposalStartNode, isAccommodation) : null;
      const tEnd = tripEnd ? normalizeToMidnight(tripEnd, isAccommodation) : null;
      
      if (proposalStart && proposalEnd && proposalEnd < proposalStart) {
        setError("endDate", { type: "manual", message: "La fecha de fin no puede ser anterior a la de inicio" });
        return;
      }

      if (tEnd && proposalEnd && proposalEnd > tEnd) {
        setError("endDate", { type: "manual", message: "La fecha es posterior al fin del viaje" });
        return;
      }
    }

    // Accommodation overlap check
    if (isAccommodation && cleanedData.startDate && cleanedData.endDate) {
      const proposalStartNode = new Date(cleanedData.startDate);
      const proposalEndNode = new Date(cleanedData.endDate);
      const newStart = normalizeToMidnight(proposalStartNode, true);
      const newEnd = normalizeToMidnight(proposalEndNode, true);

      if (newStart && newEnd) {
        const overlappingAccommodation = allProposals.find((p) => {
          if (p.type !== "accommodation" || p.status === "rejected") return false;
          if (initialData && p.id === initialData.id) return false;
          
          const existStartNode = p.startDate?.toDate();
          const existEndNode = p.endDate?.toDate();
          if (!existStartNode || !existEndNode) return false;
          
          const eStart = normalizeToMidnight(existStartNode, true);
          const eEnd = normalizeToMidnight(existEndNode, true);

          if (!eStart || !eEnd) return false;

          // Overlap logic: (StartA < EndB) && (EndA > StartB)
          // Esto permite expresamente que newStart === eEnd (o viceversa),
          // lo cual es necesario para alojamientos consecutivos.
          return newStart.getTime() < eEnd.getTime() && newEnd.getTime() > eStart.getTime();
        });

        if (overlappingAccommodation) {
          setError("startDate", { 
            type: "manual", 
            message: `Esta fecha se solapa con el alojamiento confirmado: ${overlappingAccommodation.title}` 
          });
          setError("endDate", { 
            type: "manual", 
            message: "Selecciona un rango de fechas que no coincida con otros alojamientos confirmados" 
          });
          return;
        }
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
        <div className={`grid ${allowedTypes && allowedTypes.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4 items-end`}>
          {(!allowedTypes || allowedTypes.length > 1) && (
            <div className="col-span-1">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Tipo
              </label>
              <select
                {...register("type")}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main appearance-none"
              >
                {(!allowedTypes || allowedTypes.includes("activity")) && (
                  <option value="activity">Actividad</option>
                )}
                {(!allowedTypes || allowedTypes.includes("accommodation")) && (
                  <option value="accommodation">Alojamiento</option>
                )}
                {(!allowedTypes || allowedTypes.includes("transport")) && (
                  <option value="transport">Transporte</option>
                )}
                {(!allowedTypes || allowedTypes.includes("inventory")) && (
                  <option value="inventory">Item para llevar</option>
                )}
              </select>
            </div>
          )}
          <div className={allowedTypes && allowedTypes.length === 1 ? "col-span-1" : "col-span-1"}>
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

        {/* Voting Requirements Toggle */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-neumorphic-inset-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                ¿Requiere votación?
                <ContextualInfo 
                  description="Si está activo, el grupo deberá votar para confirmar la propuesta. Si está desactivado, se confirma al instante y los votos sirven para confirmar asistencia/interés."
                />
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                {watch("requiresVoting")
                  ? "Se requiere una votación grupal para confirmar esta propuesta."
                  : "Los votos sirven para saber quién apoya la idea o se suma al plan."}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("requiresVoting")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {watch("requiresVoting") && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
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
        )}

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

        {isInventory && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Package className="w-3 h-3 text-primary/70" /> Categoría (Inventario)
              </label>
              <select
                {...register("inventoryCategory")}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main appearance-none"
              >
                <option value="General">General</option>
                <option value="Ropa">Ropa</option>
                <option value="Higiene">Higiene</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Camping">Camping</option>
                <option value="Documentos">Documentos</option>
                <option value="Comida/Bebida">Comida/Bebida</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            {!watch("isPersonal") && (
              <div className="flex items-center gap-2 mt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watch("isPersonal") || false}
                    {...register("isPersonal")}
                    className="w-4 h-4 accent-primary rounded shadow-sm"
                  />
                  <span>Es un ítem personal (solo yo lo veré)</span>
                  <ContextualInfo 
                    description="Los ítems personales no son visibles para el resto del grupo y no se incluyen en la planificación colectiva."
                  />
                </label>
              </div>
            )}
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
                <ContextualInfo 
                  description="Podés ingresar una dirección física o un link a Google Maps/Airbnb para que todos sepan cómo llegar."
                />
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
                <ContextualInfo 
                  title="Distribución de Costos"
                  description="Este valor representa el costo total de la propuesta. En el resumen financiero, este monto se dividirá equitativamente entre todos los participantes confirmados del viaje."
                />
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
                min={floorDateISO}
                max={safeToLocalISO(trip.endDate?.toDate(), true)}
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
                {isAccommodation ? "Inicio" : "Fecha y Hora de Salida"}
              </label>
              <input
                type={isAccommodation ? "date" : "datetime-local"}
                {...register("startDate", { valueAsDate: true })}
                min={floorDateSimple}
                max={safeToLocalISO(trip.endDate?.toDate(), false)}
                className="w-full bg-white rounded-tripio px-4 py-3 shadow-neumorphic-inset-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text-main"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {isAccommodation ? "Fin" : "Fecha y Hora de Llegada"}
              </label>
              <input
                type={isAccommodation ? "date" : "datetime-local"}
                {...register("endDate", { valueAsDate: true })}
                min={
                  safeToLocalISO(watchedStartDate, !isAccommodation) || floorDateSimple
                }
                max={safeToLocalISO(trip.endDate?.toDate(), !isAccommodation)}
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

        {/* This section has been moved up to be closer to the toggle */}

        <div className="pt-6">
          <NeumorphicButton
            type="submit"
            variant="primary"
            className="w-full text-lg shadow-vibrant"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? initialData
                ? "Guardando..."
                : "Creando..."
              : initialData
                ? "Guardar"
                : "Crear"}
          </NeumorphicButton>
        </div>
      </form>
    </div>
  );
};
