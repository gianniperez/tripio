import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TripSegmentFormValues,
  tripSegmentSchema,
  TripSegment,
} from "../../../trips/types/segment";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { Icon } from "@/components/ui/Icon";

interface TripSegmentFormProps {
  onSubmit: (data: TripSegmentFormValues) => void;
  isSubmitting?: boolean;
  initialData?: TripSegment;
}

export const TripSegmentForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
}: TripSegmentFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TripSegmentFormValues>({
    resolver: zodResolver(tripSegmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      destination: initialData?.destination || "",
      startDate: initialData?.startDate?.toDate() || null,
      endDate: initialData?.endDate?.toDate() || null,
      order: initialData?.order || 0,
    },
  });

  const startDate = useWatch({ control, name: "startDate" });
  const todayStr = new Date().toISOString().split("T")[0];
  // Only allow end dates after start date
  const minEndDate = startDate
    ? new Date(startDate as string | number | Date).toISOString().split("T")[0]
    : todayStr;

  return (
    <div className="w-full">
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs text-red-600 font-bold mb-1">
            Revisa los campos:
          </p>
          <ul className="list-disc list-inside text-[10px] text-red-500">
            {Object.entries(errors).map(([key, err]) => {
              const errorMessage =
                err && typeof err === "object" && "message" in err
                  ? err.message
                  : "Error inválido";
              return <li key={key}>{String(errorMessage)}</li>;
            })}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit((data) =>
          onSubmit(data as unknown as TripSegmentFormValues),
        )}
        className="space-y-4"
      >
        <div>
          <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Icon name="label" className="w-3 h-3 text-primary/70" /> Nombre del
            Tramo
          </label>
          <NeumorphicInput
            {...register("name")}
            placeholder="Ej: Estadía en París"
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Icon name="map" className="w-3 h-3 text-primary/70" /> Destino
            (Opcional)
          </label>
          <NeumorphicInput
            {...register("destination")}
            placeholder="Ej: París, Francia"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Icon name="calendar_month" className="w-3 h-3" /> Inicio
            </label>
            <input
              type="date"
              min={todayStr}
              {...register("startDate", { valueAsDate: true })}
              className="w-full bg-transparent border-none outline-none shadow-inset rounded-xl px-4 py-3 text-slate-700 text-sm font-inter"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Icon name="calendar_month" className="w-3 h-3" /> Fin
            </label>
            <input
              type="date"
              min={minEndDate}
              {...register("endDate", { valueAsDate: true })}
              className="w-full bg-transparent border-none outline-none shadow-inset rounded-xl px-4 py-3 text-slate-700 text-sm font-inter"
            />
          </div>
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
                ? "Actualizar Tramo"
                : "Crear Tramo"}
          </NeumorphicButton>
        </div>
      </form>
    </div>
  );
};
