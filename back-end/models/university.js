import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  programName: { type: String, required: true }, // e.g. "BS Computer Science", "BS-IT", "LLB"
  eligibilityCriteria: { type: Number, required: true, min: 0, max: 100 }, // minimum % required
  fee: { type: Number },
  duration: { type: String },
  seats: { type: Number },
});

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  logoUrl: { type: String },
  programs: [programSchema],
}, { timestamps: true });

const University = mongoose.model('University', universitySchema);
export default University;