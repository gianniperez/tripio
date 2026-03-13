import { Modal } from "@/components/ui/dialog/Modal";
import { useCreateTrip } from "../../hooks";
import { TripForm } from "../TripForm/TripForm";
import { TripFormValues } from "../TripForm/TripForm.types";
import { createTripSchema } from "../../types";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const CreateTripModal = ({
  isOpen,
  onClose,
  userId,
}: CreateTripModalProps) => {
  const { mutate: createTrip, isPending } = useCreateTrip();

  const onSubmit = (data: TripFormValues) => {
    // Validamos y transformamos los datos (especialmente las fechas de string a Date)
    const validatedData = createTripSchema.parse(data);

    createTrip(
      { ...validatedData, userId },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Viaje"
      description="Completa los datos de tu viaje."
    >
      <div className="p-1">
        <TripForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isPending={isPending}
          submitLabel="Crear Viaje"
        />
      </div>
    </Modal>
  );
};
