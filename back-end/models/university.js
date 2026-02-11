import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const universitySchema = new mongoose.Schema({
  // Basic information
  institutionName: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },

  officialEmail: {
    type: String,
    required: [true, 'Official email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },

  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true,
    minlength: [2, 'Contact person name is too short'],
  },

  designation: {
    type: String,
    trim: true,
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^(\+92|0)[0-9]{10}$/, 'Please enter a valid Pakistani phone number'],
  },

  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+$/, 'Please enter a valid website URL'],
  },

  address: {
    type: String,
    trim: true,
  },

  // You might want to split address into structured fields later
  // city: String,
  // province: String,
  // postalCode: String,

  institutionType: {
    type: String,
    enum: ['public', 'private', 'semi-government'],
    default: 'private',
    required: true,
  },

  // Security – password should NEVER be stored plain text
  password: {
    type: String,
    required: [true, 'Password is required'],
    // Note: You MUST hash this before saving (use bcrypt in pre-save hook)
    select: false, // never return password in queries by default
  },

  // Relationship with admin user
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },

  // Status workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true,
  },

  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  rejectionReason: {
    type: String,
    trim: true,
  },

programs: {
    type: [{
      programName: { type: String, required: true },
      duration: { type: String },
      eligibilityCriteria: { type: String },
      fee: { type: Number, default: 0 },
      seats: { type: Number, default: 0 },    }],
    default: []
  },

  scholarships: {
    type: [{
      name:          { type: String, required: true },
      amount:        { type: Number, default: 0 },
      deadline:      { type: Date },
      description:   { type: String },
      eligibility:   { type: String },
      documentUrl:   { type: String },   // optional for future file uploads
    }],
    default: []
  },

  events: {
    type: [{
      title:        { type: String, required: true },
      date:         { type: Date, required: true },
      location:     { type: String },
      description:  { type: String },
      posterUrl:    { type: String },    // optional
    }],
    default: []
  },

  // Optional: logo / banner
  logo: {
    type: String, // URL or public_id from cloudinary
  },

}, {
  timestamps: true,
});

// Optional: auto-initialize programs array if missing
universitySchema.pre('save', function(next) {
  if (!this.programs) {
    this.programs = [];
  }
  next();
});

// Optional: password hashing middleware (VERY IMPORTANT!)
universitySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
universitySchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


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

