/**
 * Template de email para invitaciones a un viaje.
 * Devuelve HTML puro (compatible con todos los clientes de mail).
 */

interface InviteEmailProps {
  tripName: string;
  inviterName: string;
  inviteUrl: string;
}

export function renderInviteEmail({
  tripName,
  inviterName,
  inviteUrl,
}: InviteEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación a ${tripName} — Tripio</title>
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
                ¡Fuiste invitado a un viaje! 🗺️
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;color:#6b7280;line-height:1.6;">
                <strong style="color:#454545;">${inviterName}</strong> te invitó a unirte a
                <strong style="color:#f46a1f;">${tripName}</strong> en Tripio.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f0ebe5;margin:0 0 28px 0;" />

              <!-- Info viaje -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#fff7f0;border-radius:16px;padding:20px 24px;border-left:4px solid #f46a1f;">
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#f46a1f;">Viaje</p>
                    <p style="margin:0;font-size:20px;font-weight:800;color:#1a1a1a;">${tripName}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}"
                       style="display:inline-block;background-color:#f46a1f;color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 40px;border-radius:999px;letter-spacing:0.3px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      Unirme al viaje →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Link de respaldo -->
              <p style="margin:0 0 8px 0;font-size:12px;color:#9ca3af;text-align:center;">
                Si el botón no funciona, copiá este link:
              </p>
              <p style="margin:0;font-size:11px;color:#6b7280;text-align:center;word-break:break-all;background-color:#f9fafb;border-radius:8px;padding:10px 16px;">
                ${inviteUrl}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">
                Este link de invitación expira en 72 horas.
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
