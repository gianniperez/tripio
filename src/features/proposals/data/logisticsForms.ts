import { FormType } from "@/types/FormType";
import { ProposalType } from "../types";

export const logisticsFormConfig: Record<string, FormType> = {
  accommodation: {
    title: "Alojamiento",
    description: "Define dónde se hospedará el grupo",
    cta: "Guardar Alojamiento",
    inputs: [
      {
        name: "title",
        label: "Nombre del Alojamiento",
        type: "text",
        required: true,
        placeholder: "Ej: Hotel Central",
      },
      {
        name: "location",
        label: "Ubicación",
        type: "text",
        placeholder: "Ej: Av. Siempreviva 123",
      },
      {
        name: "startDate",
        label: "Desde (Check-in)",
        type: "datetime-local",
        gridCols: 1,
      },
      {
        name: "endDate",
        label: "Hasta (Check-out)",
        type: "datetime-local",
        gridCols: 1,
      },
      {
        name: "estimatedCost",
        label: "Costo Estimado",
        type: "number",
        placeholder: "0",
      },
      {
        name: "description",
        label: "Notas adicionales",
        type: "textarea",
        placeholder: "Detalles sobre la reserva, comodidades, etc.",
      },
    ],
  },
  transport: {
    title: "Transporte",
    description: "Configura cómo se moverá el grupo",
    cta: "Guardar Transporte",
    inputs: [
      {
        name: "title",
        label: "Título / Referencia",
        type: "text",
        required: true,
        placeholder: "Ej: Vuelo AR1234, Alquiler de Van, Auto de Juan",
      },
      {
        name: "startDate",
        label: "Salida / Inicio",
        type: "datetime-local",
        gridCols: 1,
      },
      {
        name: "endDate",
        label: "Llegada / Fin",
        type: "datetime-local",
        gridCols: 1,
      },
      {
        name: "estimatedCost",
        label: "Costo Estimado",
        type: "number",
        placeholder: "0",
      },
      {
        name: "isPersonalTransport",
        label: "¿Es transporte personal?",
        type: "toggle",
      },
      {
        name: "capacity",
        label: "Capacidad (Cant. de Personas)",
        type: "number",
        placeholder: "0",
        showIf: (values) => values.isPersonalTransport === true,
      },
      {
        name: "description",
        label: "Notas adicionales",
        type: "textarea",
        placeholder: "Horarios, punto de encuentro, etc.",
      },
    ],
  },
};

export const getLogisticsFormConfig = (type: ProposalType | null): FormType => {
  if (!type) {
    return {
      title: "Nueva Propuesta",
      description: "Selecciona el tipo de propuesta",
      cta: "Continuar",
      inputs: [],
    };
  }
  return (
    logisticsFormConfig[type] || {
      title: "Propuesta",
      description: "Completa los detalles",
      cta: "Guardar",
      inputs: [],
    }
  );
};
