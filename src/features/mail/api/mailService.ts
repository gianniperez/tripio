/**
 * mailService — Cliente del módulo de mail.
 * Hace fetch al Route Handler /api/mail/send.
 * Se usa desde componentes cliente y Server Actions.
 */

const MAIL_ENDPOINT = "/api/mail/send";

// --- Tipos ---

export interface SendInviteMailParams {
  to: string;
  tripName: string;
  inviterName: string;
  inviteUrl: string;
}

export interface SendItemAssignedMailParams {
  to: string;
  itemName: string;
  tripName: string;
  assignerName: string;
  category?: string;
  tripUrl?: string;
}

// --- Helper interno ---

async function post<T>(payload: T): Promise<void> {
  try {
    const res = await fetch(MAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("[mailService] Error al enviar mail:", err);
    }
  } catch (err) {
    // Fire-and-forget: el mail nunca debe bloquear la UX
    console.warn("[mailService] Error de red al enviar mail:", err);
  }
}

// --- API pública ---

export const mailService = {
  /**
   * Envía el email de invitación con el magic link.
   */
  sendInviteMail(params: SendInviteMailParams): void {
    post({ type: "invite", payload: params });
  },

  /**
   * Envía el email de notificación cuando se asigna un ítem de inventario.
   */
  sendItemAssignedMail(params: SendItemAssignedMailParams): void {
    post({ type: "item_assigned", payload: params });
  },
};
