"use client";

import { Modal } from "../Modal/Modal";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { AlertTriangle } from "lucide-react";

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
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            variant === "danger"
              ? "bg-red-100 text-red-500"
              : "bg-primary/10 text-primary"
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-text-main mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer flex-1 py-3 px-4 rounded-tripio text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <NeumorphicButton
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Procesando..." : confirmLabel}
          </NeumorphicButton>
        </div>
      </div>
    </Modal>
  );
}
