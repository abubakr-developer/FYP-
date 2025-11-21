import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "", // Corrected typo from 'defult'
  },
  // document: {
  //   type: String,
  //   default: "",  
  // },
  resetOTP: {
  type: String,
},
  resetOTPExpiry: {
  type: Date,
},
role: {
    type: String,
    enum: ['student', 'universityAdmin', 'superAdmin'],
    default: 'student'
  },
  intermediatePercentage: { type: Number, min: 0, max: 100 },
  resultCardUrl: { type: String },
},
 { timestamps: true 
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
