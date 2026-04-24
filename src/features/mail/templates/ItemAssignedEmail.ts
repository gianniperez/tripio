/**
 * Template de email para notificación de ítem de inventario asignado.
 * Devuelve HTML puro (compatible con todos los clientes de mail).
 */

interface ItemAssignedEmailProps {
  itemName: string;
  tripName: string;
  assignerName: string;
  category?: string;
  tripUrl?: string;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  general: { label: "General", icon: "📦" },
  electronica: { label: "Electrónica", icon: "🔌" },
  salud: { label: "Salud", icon: "💊" },
  comida: { label: "Comida", icon: "🍎" },
  documentacion: { label: "Documentación", icon: "📄" },
  equipo: { label: "Equipamiento", icon: "🎒" },
  other: { label: "Otros", icon: "📦" },
};

export function renderItemAssignedEmail({
  itemName,
  tripName,
  assignerName,
  category = "other",
  tripUrl,
}: ItemAssignedEmailProps): string {
  const cat = CATEGORY_LABELS[category] ?? CATEGORY_LABELS["other"];

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ítem asignado en ${tripName} — Tripio</title>
</head>
<body style="margin:0;padding:0;background-color:#fffaf5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#454545;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffaf5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f46a1f;border-radius:16px;padding:12px 24px;">
                    <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      ✈️ Tripio
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background-color:#ffffff;border-radius:24px;padding:40px 36px;box-shadow:6px 6px 16px #e4ddd6,-6px -6px 16px rgba(255,255,255,0.8);">

              <!-- Título -->
              <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:900;color:#1a1a1a;line-height:1.2;">
                ¡Tenés un ítem asignado! ${cat.icon}
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;color:#6b7280;line-height:1.6;">
                <strong style="color:#454545;">${assignerName}</strong> te asignó la responsabilidad de traer algo para
                <strong style="color:#f46a1f;">${tripName}</strong>.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f0ebe5;margin:0 0 28px 0;" />

              <!-- Detalle del ítem -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#f0fdf4;border-radius:16px;padding:20px 24px;border-left:4px solid #10b981;">
                    <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#10b981;">
                      ${cat.icon} ${cat.label}
                    </p>
                    <p style="margin:0 0 4px 0;font-size:22px;font-weight:800;color:#1a1a1a;">${itemName}</p>
                    <p style="margin:0;font-size:13px;color:#6b7280;">Para el viaje: <strong>${tripName}</strong></p>
                  </td>
                </tr>
              </table>

              <!-- Qué significa -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#f9fafb;border-radius:12px;padding:16px 20px;">
                    <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#374151;">¿Qué tenés que hacer?</p>
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.7;">
                      ✅ Conseguir o comprar <strong>${itemName}</strong><br/>
                      ✅ Marcarlo como listo en la app cuando lo tengas<br/>
                      ✅ ¡Listo, eso es todo!
                    </p>
                  </td>
                </tr>
              </table>

              ${
                tripUrl
                  ? `
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${tripUrl}"
                       style="display:inline-block;background-color:#008b8b;color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 40px;border-radius:999px;letter-spacing:0.3px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      Ver inventario del viaje →
                    </a>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">
                Recibiste este mail porque sos participante de <strong>${tripName}</strong> en Tripio.
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                © ${new Date().getFullYear()} Tripio — Organizador de viajes grupales
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}
