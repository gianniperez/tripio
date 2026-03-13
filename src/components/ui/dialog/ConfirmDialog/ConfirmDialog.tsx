"use client";

import { Modal } from "../Modal/Modal";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="flex flex-col items-center text-center gap-6">
        <div
          className={`${
            variant === "danger" ? " text-danger" : " text-primary"
          }`}
        >
          <Icon name="error" fill={true} size={56} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-text-main mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <NeumorphicButton
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            className="flex-1"
          >
            {cancelLabel}
          </NeumorphicButton>
          <NeumorphicButton
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            variant="primary"
            className="flex-1"
          >
            {isLoading ? "Procesando..." : confirmLabel}
          </NeumorphicButton>
        </div>
      </div>
    </Modal>
  );
}
