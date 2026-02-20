import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const universitySchema = new mongoose.Schema({              
  admissionWebsite: {                                 
    type: String,
    trim: true,
    default: '',
  },

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

  city: {
    type: String,
    enum: ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Sialkot', 'Gujrat', 'Bahawalpur', 'Sargodha'],
    trim: true,
  },

  institutionType: {
    type: String,
    enum: ['public', 'private', 'semi-government'],
    default: 'private',
    required: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, 
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },

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
      minPercentage: { type: Number, default: 0 },
      maxPercentage: { type: Number, default: 100 },
      isActive: { type: Boolean, default: true },
      fee: { type: Number, default: 0 },
      seats: { type: Number, default: 0 },    }],
    default: []
  },

  scholarships: {
    type: [{
      name:          { type: String, required: true },
      percentage:    { type: Number, default: 0 },
      deadline:      { type: Date },
      description:   { type: String },
      eligibility:   { type: String },
      documentUrl:   { type: String }, 
    }],
    default: []
  },

  events: {
    type: [{
      title:        { type: String, required: true },
      date:         { type: Date, required: true },
      location:     { type: String },
      description:  { type: String },
    }],
    default: []
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  logo: {
    type: String, 
  },


  otp: { type: String, select: false },
  otpExpires: { type: Date, select: false },

}, {
  timestamps: true,
});

universitySchema.pre('save', function(next) {
  if (!this.programs) {
    this.programs = [];
  }
  next();
});

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

universitySchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const programSchema = new mongoose.Schema({
  programName: { type: String, required: true }, 
  eligibilityCriteria: { type: Number, required: true, min: 0, max: 100 }, 
  fee: { type: Number },
  duration: { type: String },
  seats: { type: Number },
});

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  description: { type: String },
  percentage: { type: Number },
  deadline: { type: Date },
  eligibility: { type: String }, 
  documentUrl: { type: String }, 
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
});

const University = mongoose.model('University', universitySchema);
export default University;
