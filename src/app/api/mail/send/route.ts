import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";
import { renderInviteEmail } from "@/features/mail/templates/InviteEmail";
import { renderItemAssignedEmail } from "@/features/mail/templates/ItemAssignedEmail";

const FROM_EMAIL =
  process.env.SMTP_FROM_EMAIL || '"Tripio" <tripio.oficial@gmail.com>';

// --- Tipos de payload por tipo de mail ---

interface InvitePayload {
  to: string;
  tripName: string;
  inviterName: string;
  inviteUrl: string;
}

interface ItemAssignedPayload {
  to: string;
  itemName: string;
  tripName: string;
  assignerName: string;
  category?: string;
  tripUrl?: string;
}

type MailRequest =
  | { type: "invite"; payload: InvitePayload }
  | { type: "item_assigned"; payload: ItemAssignedPayload };

export async function POST(req: NextRequest) {
  // Validar configuración SMTP
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return NextResponse.json(
      { error: "Variables SMTP_USER o SMTP_PASSWORD no configuradas." },
      { status: 500 }
    );
  }

  let body: MailRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { type, payload } = body;

  if (!type || !payload) {
    return NextResponse.json(
      { error: "Se requieren 'type' y 'payload'." },
      { status: 400 }
    );
  }

  try {
    let subject: string;
    let html: string;

    if (type === "invite") {
      const p = payload as InvitePayload;

      if (!p.to || !p.tripName || !p.inviterName || !p.inviteUrl) {
        return NextResponse.json(
          { error: "Faltan campos requeridos para el tipo 'invite'." },
          { status: 400 }
        );
      }

      subject = `${p.inviterName} te invitó a ${p.tripName} en Tripio ✈️`;
      html = renderInviteEmail({
        tripName: p.tripName,
        inviterName: p.inviterName,
        inviteUrl: p.inviteUrl,
      });

      try {
        const info = await transporter.sendMail({
          from: FROM_EMAIL,
          to: p.to,
          subject,
          html,
        });
        return NextResponse.json({ success: true, messageId: info.messageId });
      } catch (error: any) {
        console.error("[mail/send] Nodemailer error (invite):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (type === "item_assigned") {
      const p = payload as ItemAssignedPayload;

      if (!p.to || !p.itemName || !p.tripName || !p.assignerName) {
        return NextResponse.json(
          { error: "Faltan campos requeridos para el tipo 'item_assigned'." },
          { status: 400 }
        );
      }

      subject = `Se te asignó "${p.itemName}" en ${p.tripName} 🎒`;
      html = renderItemAssignedEmail({
        itemName: p.itemName,
        tripName: p.tripName,
        assignerName: p.assignerName,
        category: p.category,
        tripUrl: p.tripUrl,
      });

      try {
        const info = await transporter.sendMail({
          from: FROM_EMAIL,
          to: p.to,
          subject,
          html,
        });
        return NextResponse.json({ success: true, messageId: info.messageId });
      } catch (error: any) {
        console.error("[mail/send] Nodemailer error (item_assigned):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: `Tipo de mail desconocido: ${type}` },
      { status: 400 }
    );
  } catch (err) {
    console.error("[mail/send] Error inesperado:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
