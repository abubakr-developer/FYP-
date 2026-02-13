import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, "Email cannot exceed 255 characters"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    intermediatePercentage: {
      type: Number,
      min: [0, "Percentage cannot be less than 0"],
      max: [100, "Percentage cannot exceed 100"],
      default: null,
    },
    // Inside userSchema
    fieldOfInterest: {
      type: String,
      enum: [
        "Faculty of Sciences",
        "Faculty of Computing and Information Technology",
        "Faculty of Humanities and Social Sciences",
        "Faculty of Textile and Fashion Designing",
        "Faculty of Pharmacy and Allied Health Sciences",
        "Other",
      ],
      default: null,
    },

    intermediateBoard: {
      type: String,
      trim: true,
      default: "",
    },

    intermediateYear: {
      type: Number,
      default: null,
    },
    profileImage: {
      type: String,
      default: "",
    },
    resultCardUrl: {
      type: String,
      default: "",
    },
    resetOTP: {
      type: String,
      default: null,
    },
    resetOTPExpiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "universityAdmin", "superAdmin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for better query performance
userSchema.index({ phone: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
