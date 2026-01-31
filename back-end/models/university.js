import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
  institutionName: { type: String, required: true, trim: true },
  officialEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  designation: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  website: { type: String, trim: true },
  address: { type: String, trim: true },
  institutionType: {
    type: String,
    enum: ['public', 'private', 'semi-government'],
    default: 'private',
    required: true
  },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });


const programSchema = new mongoose.Schema({
  programName: { type: String, required: true }, // e.g. "BS Computer Science", "BS-IT", "LLB"
  eligibilityCriteria: { type: Number, required: true, min: 0, max: 100 }, // minimum % required
  fee: { type: Number },
  duration: { type: String },
  seats: { type: Number },
});

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

