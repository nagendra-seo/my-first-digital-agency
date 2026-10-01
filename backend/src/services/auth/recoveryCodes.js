import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

const RECOVERY_CODE_COUNT = 10;
const HASH_ROUNDS = 10;

function formatCode(raw) {
  const hex = raw.toString("hex").toUpperCase().slice(0, 8);
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

/** Generates one-time recovery codes. Plaintext is returned once (to show
 *  the admin) and never stored — only bcrypt hashes persist. */
export async function generateRecoveryCodes() {
  const plaintext = Array.from({ length: RECOVERY_CODE_COUNT }, () => formatCode(randomBytes(8)));
  const hashes = await Promise.all(plaintext.map((code) => bcrypt.hash(code, HASH_ROUNDS)));
  return { plaintext, hashes };
}

/** Returns the index of the matching hash (so the caller can remove it —
 *  one-time use) or null if no code matched. */
export async function matchRecoveryCode(submitted, hashes) {
  const normalized = submitted.trim().toUpperCase();
  for (let i = 0; i < hashes.length; i++) {
    if (await bcrypt.compare(normalized, hashes[i])) return i;
  }
  return null;
}
