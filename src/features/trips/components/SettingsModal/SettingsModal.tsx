import React from "react";
import { Modal } from "@/components/ui/dialog/Modal/Modal";
import { SettingsView } from "../SettingsView/SettingsView";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  tripId,
}: SettingsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administrar Viaje">
      <SettingsView tripId={tripId} onClose={onClose} />
    </Modal>
  );
};
