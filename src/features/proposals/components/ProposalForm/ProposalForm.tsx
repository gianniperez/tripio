import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Proposal,
  CreateProposalFormValues,
  createProposalSchema,
} from "../../types";
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
} from "lucide-react";

interface ProposalFormProps {
  onSubmit: (data: CreateProposalFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
}

export const ProposalForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
}: ProposalFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "activity",
      estimatedCost: initialData?.estimatedCost ?? undefined,
      location: initialData?.location || "",
      accessible: initialData?.accessible || false,
      options: initialData?.options?.map((opt) => ({ value: opt })) || [],
      // Handle Firebase Timestamp to JS Date conversion if editing
      startDate: initialData?.startDate?.toDate() || null,
      endDate: initialData?.endDate?.toDate() || null,
      deadline: initialData?.deadline?.toDate() || null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const selectedType = watch("type");

  // Conditional logic for field visibility
  const showLocation = ["activity", "accommodation", "transport"].includes(
    selectedType,
  );
  const showCost = ["activity", "accommodation", "transport"].includes(
    selectedType,
  );
  const showDates = ["activity", "accommodation", "transport"].includes(
    selectedType,
  );
  const showInventoryInfo = selectedType === "inventory";

  const submitWrapper = (data: CreateProposalFormValues) => {
    // Filter empty options and transform back to string[]
    const optionStrings =
      data.options?.map((o) => o.value).filter((v) => v && v.trim() !== "") ||
      [];

    const cleanedData = {
      ...data,
      options: optionStrings as unknown as typeof data.options,
    };

    // Handle empty number input
    if (
      typeof cleanedData.estimatedCost !== "number" ||
      isNaN(cleanedData.estimatedCost)
    ) {
      cleanedData.estimatedCost = null;
    }

    // Clean conditional fields if not applicable
    if (!showLocation) cleanedData.location = null;
    if (!showCost) cleanedData.estimatedCost = null;
    if (!showDates) {
      cleanedData.startDate = null;
      cleanedData.endDate = null;
    }
    if (selectedType !== "transport") {
      cleanedData.transportType = null;
      cleanedData.capacity = null;
    }
    if (selectedType !== "inventory") {
      cleanedData.quantity = null;
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
              className="w-full bg-white shadow-soft rounded-xl px-4 py-3 text-sm text-slate-700 outline-primary appearance-none border-none font-medium"
            >
              <option value="activity">Actividad</option>
              <option value="accommodation">Alojamiento</option>
              <option value="transport">Transporte</option>
              <option value="inventory">Item para llevar</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Título
            </label>
            <NeumorphicInput
              {...register("title")}
              placeholder="Ej: Cena en el puerto"
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
            className="w-full bg-transparent border-none outline-none shadow-inset rounded-2xl px-4 py-3 text-slate-700 resize-none font-inter text-sm"
            placeholder={
              showInventoryInfo
                ? "Detalles del ítem (ej: color, marca)..."
                : "Detalles adicionales..."
            }
          />
        </div>

        {selectedType === "inventory" && (
          <div className="grid grid-cols-2 gap-4">
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

        {selectedType === "transport" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Plus className="w-3 h-3 text-primary/70" /> Tipo de Transporte
              </label>
              <select
                {...register("transportType")}
                className="w-full bg-white shadow-soft rounded-xl px-4 py-3 text-sm text-slate-700 outline-primary appearance-none border-none font-medium"
              >
                <option value="personal">Personal (Auto/Camioneta)</option>
                <option value="public">Público (Avión/Bus)</option>
              </select>
            </div>
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
          </div>
        )}

        {(showLocation || showCost) && (
          <div className="grid grid-cols-2 gap-4">
            {showLocation && (
              <div className="col-span-1">
                <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary/70" />{" "}
                  {selectedType === "accommodation" ? "Dirección" : "Ubicación"}
                </label>
                <NeumorphicInput
                  {...register("location")}
                  placeholder="Ej: Centro histórico"
                  className="w-full"
                />
              </div>
            )}
            {showCost && (
              <div className="col-span-1">
                <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-green-500/70" />{" "}
                  {selectedType === "accommodation" ? "Costo Total" : "Costo"}
                </label>
                <NeumorphicInput
                  type="number"
                  {...register("estimatedCost", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {showDates && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Inicio
              </label>
              <input
                type="date"
                {...register("startDate", { valueAsDate: true })}
                className="w-full bg-transparent border-none outline-none shadow-inset rounded-xl px-4 py-3 text-slate-700 text-sm font-inter"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Fin
              </label>
              <input
                type="date"
                {...register("endDate", { valueAsDate: true })}
                className="w-full bg-transparent border-none outline-none shadow-inset rounded-xl px-4 py-3 text-slate-700 text-sm font-inter"
              />
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 mt-2">
          <label className="text-sm font-bold text-slate-700 mb-1">
            Opciones de decisión (Opcional)
          </label>
          <p className="text-[10px] text-slate-500 mb-3">
            El RSVP (&quot;Sí/No/No me sumo&quot;) es automático. Agrega
            opciones si necesitas elegir entre alternativas específicas.
          </p>

          <div className="space-y-2">
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
          </div>

          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="mt-3 text-sm font-bold text-primary flex items-center hover:opacity-80 transition-opacity bg-primary/5 px-3 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-1" /> Añadir opción específica
          </button>
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
                ? "Actualizar Propuesta"
                : "Lanzar Propuesta"}
          </NeumorphicButton>
        </div>
      </form>
    </div>
  );
};
