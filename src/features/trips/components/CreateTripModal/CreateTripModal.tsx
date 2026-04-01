"use client";

import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { CreateTripForm } from "../CreateTripForm";
import { Icon } from "@/components/ui/Icon";
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
        onSuccess={() => {
          onClose();
          window.location.reload();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}
