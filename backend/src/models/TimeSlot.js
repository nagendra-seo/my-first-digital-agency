import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true }, // "10:00 AM"
  value: { type: String, required: true, unique: true }, // "10:00"
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

export const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);
