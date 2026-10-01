/**
 * Seeds the configurable booking time slots. Safe to run more than once —
 * existing slots (matched by value) are left untouched.
 * Run with: npm run seed
 */
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { TimeSlot } from "../src/models/TimeSlot.js";
import { DEFAULT_TIME_SLOTS } from "../src/utils/constants.js";

async function main() {
  await mongoose.connect(env.MONGODB_URI);

  for (const [index, slot] of DEFAULT_TIME_SLOTS.entries()) {
    await TimeSlot.updateOne({ value: slot.value }, { $setOnInsert: { ...slot, sortOrder: index } }, { upsert: true });
  }
  console.log(`Seeded ${DEFAULT_TIME_SLOTS.length} time slots.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
