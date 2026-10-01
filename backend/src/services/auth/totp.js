import { Secret, TOTP } from "otpauth";
import QRCode from "qrcode";
import { encryptSecret, decryptSecret } from "./crypto.js";

const ISSUER = "My First Digital Agency";

export function generateTotpSecret() {
  const secret = new Secret({ size: 20 });
  return { base32: secret.base32, encrypted: encryptSecret(secret.base32) };
}

function buildTotp(base32Secret, accountEmail) {
  return new TOTP({
    issuer: ISSUER,
    label: accountEmail,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(base32Secret),
  });
}

export async function generateOtpAuthQrDataUrl(base32Secret, accountEmail) {
  const totp = buildTotp(base32Secret, accountEmail);
  return QRCode.toDataURL(totp.toString(), { margin: 1, width: 240 });
}

/** Verifies a 6-digit code, allowing ±1 step (30s) of clock drift. */
export function verifyTotpCode(encryptedSecret, accountEmail, code) {
  const base32Secret = decryptSecret(encryptedSecret);
  const totp = buildTotp(base32Secret, accountEmail);
  return totp.validate({ token: code, window: 1 }) !== null;
}
