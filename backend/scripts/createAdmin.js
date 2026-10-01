/**
 * One-time CLI to create the initial admin account.
 * Run with: npm run create-admin
 *
 * There is deliberately no public admin registration endpoint — this
 * script (run again later with a new email) is the only way to add one.
 */
import readline from "readline";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { Admin } from "../src/models/Admin.js";

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); }));
}

function askHidden(question) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) { ask(question).then(resolve); return; }
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let input = "";
    const onData = (char) => {
      const c = char.toString();
      if (c === "\n" || c === "\r" || c === "\u0004") {
        stdin.setRawMode(false); stdin.pause(); stdin.removeListener("data", onData);
        process.stdout.write("\n"); resolve(input); return;
      }
      if (c === "\u0003") process.exit(1);
      if (c === "\u007f") { input = input.slice(0, -1); return; }
      input += c;
      process.stdout.write("*");
    };
    stdin.on("data", onData);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPasswordStrongEnough(password) {
  if (password.length < 12) return { ok: false, reason: "Use at least 12 characters." };
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (variety < 3) return { ok: false, reason: "Mix at least 3 of: lowercase, uppercase, numbers, symbols." };
  return { ok: true };
}

async function main() {
  console.log("\nMy First Digital Agency — create the initial admin account\n");
  await mongoose.connect(env.MONGODB_URI);

  const existingCount = await Admin.countDocuments();
  if (existingCount > 0) {
    console.log(`There ${existingCount === 1 ? "is already 1 admin" : `are already ${existingCount} admins`} in the database.`);
    const proceed = await ask("Create another admin anyway? (y/N): ");
    if (proceed.toLowerCase() !== "y") { console.log("Cancelled."); process.exit(0); }
  }

  let email = "";
  while (!isValidEmail(email)) {
    email = await ask("Admin email: ");
    if (!isValidEmail(email)) console.log("Please enter a valid email address.");
  }

  const existing = await Admin.findOne({ email });
  if (existing) { console.log("An admin with that email already exists."); process.exit(1); }

  let password = "";
  for (;;) {
    password = await askHidden("Password (min 12 chars, mixed case/number/symbol): ");
    const strength = isPasswordStrongEnough(password);
    if (!strength.ok) { console.log(strength.reason); continue; }
    const confirm = await askHidden("Confirm password: ");
    if (confirm !== password) { console.log("Passwords didn't match — try again.\n"); continue; }
    break;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.create({ email, passwordHash });

  console.log(`\nAdmin account created: ${admin.email}`);
  console.log("Two-factor authentication is NOT yet enabled — you'll be prompted to set it up from Settings after your first login.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
