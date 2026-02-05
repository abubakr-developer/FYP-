import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
  institutionName: { type: String, required: true, trim: true },
  officialEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contactPerson: { type: String, required: true },
  designation: { type: String },
  phone: { type: String, required: true },
  website: { type: String },
  address: { type: String },
  institutionType: { 
    type: String, 
    enum: ['public', 'private', 'semi-government'], 
    default: 'private' 
  },
  password: { type: String, required: true }, // ← hashed!
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true
  },
  
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // optional: track who approved
  rejectedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: null },

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

