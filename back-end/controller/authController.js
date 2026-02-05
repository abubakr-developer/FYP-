import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import validator from "validator"
import otpGenerator from "otp-generator"

export const register = async (req, res) => {
  try {
    // Debug: Log the incoming request body
    console.log("Received req.body:", req.body);

    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing or empty",
      });
    }

    // Destructure all fields from req.body (matching frontend field names)
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      confirmPassword, 
      percentage 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Validate password strength (matching frontend validation)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate phone number (basic validation)
    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // Validate percentage if provided
    if (percentage !== undefined && percentage !== null && percentage !== "") {
      const percentageNum = parseFloat(percentage);
      if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
        return res.status(400).json({
          success: false,
          message: "Percentage must be between 0 and 100",
        });
      }
    }

    // Check if email exists
    const isEmailExist = await User.findOne({ email: email.toLowerCase() });
    if (isEmailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Create new user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      percentage: percentage ? parseFloat(percentage) : null,
    });

    await user.save();

    // Validate JWT secret
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "JWT secret key is not configured",
      });
    }

    // Create JWT token
    // Include role in token to allow role-based middleware to work without extra DB lookups
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h", // Extended to 24h for better UX
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        percentage: user.percentage,
      },
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(", "),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const login = async (req, res) => {
  try {
    // Log incoming login attempt (mask password for security)
    console.log("Login attempt:", { email: req.body?.email });

    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("Login Error: missing body", { body: req.body });
      return res.status(400).json({
        success: false,
        message: "Request body is missing or empty",
      });
    }

    const { email, password } = req.body;

    if (!email) {
      console.error("Login Error: missing email", { body: req.body });
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password) {
      console.error("Login Error: missing password", { email });
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // Normalize email lookup
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error("Login Error: user not found", { email });
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.error("Login Error: invalid password", { email });
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Include role in token to allow role-based middleware checks
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY
    );

    // Set auth cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    return res.status(200).json({ success: true, user, token });

  } catch (error) {
    console.error("Login Error:", { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout: clears the auth cookie
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const otpStorage = new Map();

export const forgetPassword = async (req, res) => {
  try {
       
    const { email } = req.body;

    // Validate email input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Generate JWT token
    // const token = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "10m" }
    // ); 

    // other option

    const otp = otpGenerator.generate(6, {
    digits : true,
    lowerCaseAlpabets : true,
    upperCaseAlphabets : false,
    specialChars : false,
  })

  const expiry = Date.now() + 5 * 60 * 1000; 
  otpStorage.set(email, { otp, expiry });



    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });

    // Email options with otp as body parameter
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
             <p>Your Otp is ${otp}</p>
             <p>The Otp will expire in 10 minutes.</p>
             <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send email using Promise
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    // Extract token from query parameter
    const { email, otp } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Verify token
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find user by ID
//      const storedData = otpStorage.get(email);
// console.log("what is user otp:", otp)
//   console.log(storedData)
//     if(!otp==storedData.otp){
//  return res.status(404).json({ message: "Otp not found" });
//     }
    const user = await User.findOne({ email:email });
    console.log("what is decoded user", user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate new password
    if (!req.body.newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
      const trimmedNewPassword = req.body.newPassword.trim();
      const hashedPassword = await bcrypt.hash(trimmedNewPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    // console.error("Error in resetPassword:", error);
    // if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    //   return res.status(401).json({ message: "Invalid or expired token" });
    // }
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};


export const verifyOtp = async (req, res) => {
  try{
   const {email, otp} = req.body;
   if (!email || !otp){
    return res.status(400).json({message : "Email or otp is required"})
   }
 const storedData = otpStorage.get(email);

 if (!storedData){
  return res.status(400).json({ error: 'No OTP found for this email' });
 }
if (Date.now() > storedData.expiry){
  
  return res.status(400).json({ error: 'OTP has expired' });
}
if (storedData.otp !== otp) {
  return res.status(400).json({ error: 'Invalid OTP' });
  }
  return res.json({ message: 'OTP verified successfully' });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Update profile (provided, unchanged)
export const updateProfile = async (req, res) => {
  console.log(">>>>>>>>>>>>>>", req.body);
  try {
    const { id } = req.params;
    const updateData = {};

    // Dynamically add fields to update only if provided in req.body
    if (req.body.name) {
      updateData.name = req.body.name;
    }
    if (req.body.profileImage) {
      updateData.profileImage = req.body.profileImage;
    }

    if (Object.keys(updateData).length === 0) {
      console.log('No data provided to update for user ID:', id);
      return res.status(400).json({ message: "No data provided to update" });
    }
    console.log('Updating user ID:', id);

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('User not found for ID:', id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User updated successfully:', updatedUser);
    res.status(200).json({
      message: "User updated successfully",
      user: {
        name: updatedUser.name,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: "Server-error" });
  }
};

// Fetch current user (assumed for /api/auth/me)
export const getCurrentUser = async (req, res) => {
  try {
    console.log(req.user._id)
    const user = await User.findById(req.user._id); // Assume req.user is set by auth middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error occur" });
  }
};
