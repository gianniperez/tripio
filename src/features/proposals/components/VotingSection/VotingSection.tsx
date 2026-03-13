"use client";

import { useFieldArray } from "react-hook-form";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicInput } from "@/components/neumorphic/NeumorphicInput";
import { ContextualInfo } from "@/components/ui/ContextualInfo";
import { VotingSectionProps } from "./VotingSection.types";

export const VotingSection = ({
  register,
  control,
  watch,
  errors,
}: VotingSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const requiresVoting = watch("requiresVoting");
  const responseType = watch("responseType");

  return (
    <div className="space-y-4">
      {/* Voting Requirements Toggle */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-neumorphic-inset-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
              ¿Requiere votación?
              <ContextualInfo description="Si está activo, el grupo deberá votar para confirmar la propuesta. Si está desactivado, se confirma al instante y los votos sirven para confirmar asistencia/interés." />
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              {requiresVoting
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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
      </div>

      {requiresVoting && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Tipo de Decisión
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  value="rsvp"
                  {...register("responseType")}
                  className="cursor-pointer accent-primary text-sm"
                />
                Confirmación (Sí/No/Tal vez)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  value="poll"
                  {...register("responseType")}
                  className="cursor-pointer accent-primary"
                />
                Encuesta (Opciones múltiples)
              </label>
            </div>
          </div>

          {responseType === "poll" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-gray-700 mb-1 block">
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
                    error={errors.options?.[index]?.value?.message}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="cursor-pointer p-2 text-gray-400 hover:text-danger transition-colors"
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="cursor-pointer mt-3 text-sm font-bold text-secondary flex items-center hover:opacity-80 transition-opacity bg-secondary/10 px-3 py-2 rounded-xl"
              >
                <Icon name="add" className="mr-1" />
                Añadir opción
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
