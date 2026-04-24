"use server";

import { SignJWT } from "jose";

/**
 * Genera un Magic Link asincrónicamente con una vigencia de 72hs.
 * Contiene el tripId, el uid de quien invita y el rol propuesto de ingreso.
 */
export async function generateInviteToken(
  tripId: string,
  inviterUid: string,
  role: string = "collaborator"
): Promise<string> {
  // Secret Key temporal (Idealmente en .env.local de prod real)
  const secretKey = new TextEncoder().encode(
    process.env.INVITATION_SECRET || "tripio_development_secret_signature"
  );

  const token = await new SignJWT({ tripId, inviterUid, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("72h")
    .sign(secretKey);

  // Construye la URL Base Local / Prod
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return `${baseUrl}/invite/${token}`;
}
