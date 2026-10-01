import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/** Simple, explainable password-strength check enforced when an admin
 *  account is created. */
export function isPasswordStrongEnough(password) {
  if (password.length < 12) {
    return { ok: false, reason: "Use at least 12 characters." };
  }
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (variety < 3) {
    return { ok: false, reason: "Mix at least 3 of: lowercase, uppercase, numbers, symbols." };
  }
  const common = ["password", "admin123", "letmein", "qwerty", "12345678"];
  if (common.some((c) => password.toLowerCase().includes(c))) {
    return { ok: false, reason: "That password is too common. Choose something less guessable." };
  }
  return { ok: true };
}
