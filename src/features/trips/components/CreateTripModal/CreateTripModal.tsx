"use client";

import { CreateTripForm } from "../CreateTripForm";
import type { CreateTripModalProps } from "./CreateTripModal.types";
import { Modal } from "@/components/ui/dialog/Modal";

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Viaje"
      description="Completa los datos de tu viaje."
    >
      <CreateTripForm
        onSuccess={(tripId?: string) => {
          console.log("Trip created:", tripId);
          onClose();
          window.location.reload();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}
