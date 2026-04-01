import { Trip } from "@/types/models";

export interface EditTripFormProps {
  trip: Trip;
  userRole: string; // Se usará para saber si es "owner" y habilitarle eliminar
  onSuccess?: () => void;
  onDelete?: () => void;
}
