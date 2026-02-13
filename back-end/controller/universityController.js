import University from "../models/university.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


function getProgramFaculty(programName) {
  const programLower = programName.toLowerCase();
  
  if (programLower.includes('biology') || 
      programLower.includes('zoology') || 
      programLower.includes('chemistry') || 
      programLower.includes('mathematics') || 
      programLower.includes('math') || 
      programLower.includes('physics') || 
      programLower.includes('biotechnology')) {
    return 'Faculty of Sciences';
  }
  
  if (programLower.includes('computer') || 
      programLower.includes('software') || 
      programLower.includes('information technology') || 
      programLower.includes('artificial intelligence') || 
      programLower.includes('ai') ||
      programLower.includes('it ')) {
    return 'Faculty of Computing and Information Technology';
  }
  
  if (programLower.includes('english') || 
      programLower.includes('international relations') || 
      programLower.includes('media') || 
      programLower.includes('communication') || 
      programLower.includes('education') || 
      programLower.includes('islamic studies') || 
      programLower.includes('urdu')) {
    return 'Faculty of Humanities and Social Sciences';
  }
  
  if (programLower.includes('fashion') || 
      programLower.includes('textile') || 
      programLower.includes('graphic design') || 
      programLower.includes('design')) {
    return 'Faculty of Textile and Fashion Designing';
  }
  
  if (programLower.includes('pharmacy') || 
      programLower.includes('nutrition') || 
      programLower.includes('dietetics') || 
      programLower.includes('medical') || 
      programLower.includes('psychology') || 
      programLower.includes('physical therapy') ||
      programLower.includes('dpt')) {
    return 'Faculty of Pharmacy and Allied Health Sciences';
  }
  
  return 'Other';
}

export const registerUniversity = async (req, res) => {
  try {
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

    if (!institutionName || !officialEmail || !contactPerson || !phone || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    const existingUniversity = await University.findOne({ officialEmail: officialEmail.trim().toLowerCase() });
    if (existingUniversity) {
      return res.status(400).json({ success: false, message: "An institution with this email is already registered." });
    }

    const newUniversity = new University({
      institutionName,
      officialEmail: officialEmail.trim().toLowerCase(),
      contactPerson,
      designation,
      phone,
      website,
      address,
      institutionType,
      password, // Pass plain password; model pre-save hook will hash it
      status: 'pending',
      programs: [],
      scholarships: [],
      events: []
    });

    await newUniversity.save();

    res.status(201).json({
      success: true,
      message: "Registration successful! Your application is pending approval.",
    });
  } catch (error) {
    console.error("University Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const loginUniversity = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 2. Find university
    const university = await University.findOne({
      officialEmail: email.toLowerCase().trim(),
    }).select("+password");

    if (!university) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 3. Check if password exists
    if (!university.password) {
      console.warn(`No password set for university: ${email}`);
      return res.status(403).json({
        success: false,
        message: "Account configuration error. Contact support.",
      });
    }

    // 4. Verify password
    const isMatch = await bcrypt.compare(password, university.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 5. Check approval status
    if (university.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your university account is pending approval.",
      });
    }

    // 6. Generate token – IMPORTANT: match role with middleware
    const token = jwt.sign(
      {
        id: university._id,
        role: "university",           // ← must match isUniversityAdmin check
        email: university.officialEmail,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }                  // longer for university portal
    );

    // Optional: set httpOnly cookie (more secure than localStorage)
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      university: {
        id: university._id,
        institutionName: university.institutionName,
        officialEmail: university.officialEmail,
      },
    });
  } catch (error) {
    console.error("University Login Error:", {
      message: error.message,
      stack: error.stack?.substring(0, 200),
      email: req.body?.email,
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS
// ─────────────────────────────────────────────────────────────────────────────

export const addProgram = async (req, res) => {
  try {
    const universityId = req.user._id;
    const programData = req.body;
    const faculty = getProgramFaculty(programData.programName || programData.name || "");

    // Push new program to the programs array
    const updatedUni = await University.findByIdAndUpdate(
      universityId,
      { 
        $push: { programs: programData },
        $addToSet: { faculties: faculty }
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Program added", programs: updatedUni.programs });
  } catch (error) {
    console.error("Add Program Error:", error);
    res.status(500).json({ success: false, message: "Failed to add program" });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const university = await University.findById(req.user._id);
    res.status(200).json({ success: true, programs: university.programs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch programs" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHOLARSHIPS
// ─────────────────────────────────────────────────────────────────────────────

export const addScholarship = async (req, res) => {
  try {
    const universityId = req.user._id;
    const scholarshipData = req.body;

    const updatedUni = await University.findByIdAndUpdate(
      universityId,
      { $push: { scholarships: scholarshipData } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Scholarship added", scholarships: updatedUni.scholarships });
  } catch (error) {
    console.error("Add Scholarship Error:", error);
    res.status(500).json({ success: false, message: "Failed to add scholarship" });
  }
};

export const getScholarships = async (req, res) => {
  try {
    const university = await University.findById(req.user._id);
    res.status(200).json({ success: true, scholarships: university.scholarships || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch scholarships" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export const addEvent = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { title, date, location, description } = req.body;
    
    // Handle image upload (req.file is populated by multer)
    const posterUrl = req.file ? req.file.path : null; 

    const newEvent = { title, date, location, description, posterUrl };

    const updatedUni = await University.findByIdAndUpdate(
      universityId,
      { $push: { events: newEvent } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Event added", events: updatedUni.events });
  } catch (error) {
    console.error("Add Event Error:", error);
    res.status(500).json({ success: false, message: "Failed to add event" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const university = await University.findById(req.user._id);
    res.status(200).json({ success: true, events: university.events || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};