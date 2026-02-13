import University from "../models/university.js"; // Assuming a university model exists
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Handler for University Registration
export const registerUniversity = async (req, res) => {
  try {
    console.log("Received university registration request:", req.body);

    const {
      institutionName,
      officialEmail,
      contactPerson,
      designation,
      phone,
      website,
      address,
      institutionType,
      password,
      confirmPassword,
    } = req.body;

    // Basic validation
    if (!institutionName || !officialEmail || !contactPerson || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
    
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long.",
        });
    }

    // Check if university with the same email already exists
    const existingUniversity = await University.findOne({ officialEmail: officialEmail.trim().toLowerCase() });
    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: "An institution with this email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new university instance
    const newUniversity = new University({
      institutionName,
      officialEmail: officialEmail.trim().toLowerCase(),
      contactPerson,
      designation,
      phone,
      website,
      address,
      institutionType,
      password: hashedPassword,
      // FIX: Set to approved immediately for development/testing (removes pending logic so recommendations work).
      // If you want approval flow, add an admin endpoint to update this later.
      isApproved: true,
      approvalStatus: 'approved',
    });

    await newUniversity.save();

    res.status(201).json({
      success: true,
      message: "Registration successful!",
    });

  } catch (error) {
    console.error("University Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
      error: error.message,
    });
  }
};

// Handler for University Login
export const loginUniversity = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Find university by official email
    const university = await University.findOne({ officialEmail: email.toLowerCase() });
    if (!university) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, university.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // FIX: Optional - Add check for approved status if you re-enable pending flow later.
    // if (university.approvalStatus !== 'approved') {
    //   return res.status(403).json({ success: false, message: "Account pending approval." });
    // }

    // Create JWT token
    const token = jwt.sign({ id: university._id, role: 'university' }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });

  } catch (error) {
    console.error("University Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};