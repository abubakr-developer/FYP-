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

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Merit Scholarship"
  description: { type: String },
  amount: { type: Number },
  deadline: { type: Date },
  eligibility: { type: String }, // e.g., "Min 80% marks"
  documentUrl: { type: String }, // Cloudinary URL for any doc
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Career Workshop"
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  posterUrl: { type: String }, // Cloudinary URL
});

const University = mongoose.model('University', universitySchema);
export default University;

