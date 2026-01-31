import University from "../models/university.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper: fallback upload handler — uses local multer `req.files` paths when Cloudinary not configured
const uploadToCloudinary = async (file, folder = 'misc') => {
  // Allow passing either multer file object or arrays from req.files
  if (!file) return null;

  // If an array was passed (e.g. req.files.file), take the first
  const f = Array.isArray(file) ? file[0] : file;

  // multer.diskStorage gives `path` on the file object (or use `filename` + folder)
  if (f.path) {
    // Return a URL path that Express static middleware can serve (`/uploads/...`)
    return `/${f.path.replace(/\\/g, '/')}`;
  }

  // If only `filename` and destination are available
  if (f.filename && f.destination) {
    const p = `${f.destination.replace(/\\/g, '/')}/${f.filename}`.replace(/\/+/g, '/');
    return `/${p}`;
  }

  // No recognized file info — return null rather than throwing to avoid crashing
  return null;
};

export const registerUniversity = async (req, res) => {
  try {
    // Debug: Log incoming data
    console.log("University registration - req.body:", req.body);

    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing or empty",
      });
    }

    // Destructure fields (matching frontend)
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

    // Required fields
    if (!institutionName || !officialEmail || !contactPerson || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided (institutionName, officialEmail, contactPerson, phone, password, confirmPassword)",
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Password strength (same as student)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(officialEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid official email format",
      });
    }

    // Optional: stricter check for official/academic email (e.g. .edu.pk)
    if (!officialEmail.toLowerCase().endsWith('.edu.pk') && !officialEmail.toLowerCase().includes('university')) {
      // This is optional – many real institutions use gmail/outlook too
      // You can make it warning instead of error
    }

    // Phone length (basic)
    if (phone.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number should be at least 10 characters",
      });
    }

    // Institution type validation
    const validTypes = ['public', 'private', 'semi-government'];
    if (!validTypes.includes(institutionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid institution type. Allowed: public, private, semi-government",
      });
    }

    // Check email uniqueness
    const existingUniversity = await University.findOne({ officialEmail: officialEmail.toLowerCase() });
    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: "This official email is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Create university document (starts as pending)
    const university = new University({
      institutionName: institutionName.trim(),
      officialEmail: officialEmail.toLowerCase().trim(),
      contactPerson: contactPerson.trim(),
      designation: designation ? designation.trim() : null,
      phone: phone.trim(),
      website: website ? website.trim() : null,
      address: address ? address.trim() : null,
      institutionType,
      password: hashedPassword,
      status: 'pending', // ← important – real flow needs admin approval
    });

    await university.save();

    // JWT – optional (you can skip token for universities or issue temporary access)
    // Many platforms give universities a "pending" dashboard instead of immediate login
    let token = null;
    if (process.env.JWT_SECRET_KEY) {
      token = jwt.sign(
        { id: university._id, role: 'university', status: university.status },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );
    } else {
      console.warn("JWT_SECRET_KEY not set – no token generated");
    }

    // Response (do NOT send password or full sensitive data)
    return res.status(201).json({
      success: true,
      university: {
        id: university._id,
        institutionName: university.institutionName,
        officialEmail: university.officialEmail,
        contactPerson: university.contactPerson,
        phone: university.phone,
        institutionType: university.institutionType,
        status: university.status,
      },
      token, // optional – can be null or omitted
      message: "University registration submitted successfully. Your account is pending approval.",
    });

  } catch (error) {
    console.error("University Registration Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during university registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Add Course/Program (with admission criteria)
export const addProgram = async (req, res) => {
  try {
    const { programName, eligibilityCriteria, fee, duration, seats } = req.body;

    if (!programName || !eligibilityCriteria) {
      return res.status(400).json({ message: "Program name and eligibility criteria required.", success: false });
    }

    const university = await University.findOne({ adminId: req.user.id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    university.programs.push({
      programName,
      eligibilityCriteria: Number(eligibilityCriteria),
      fee: Number(fee),
      duration,
      seats: Number(seats),
    });

    await university.save();

    return res.status(200).json({
      message: "Program added successfully",
      success: true,
      data: university.programs[university.programs.length - 1],
    });
  } catch (error) {
    console.error("Error adding program:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get All Programs
export const getPrograms = async (req, res) => {
  try {
    const university = await University.findOne({ adminId: req.user.id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    return res.status(200).json({
      message: "Programs fetched successfully",
      success: true,
      data: university.programs,
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Add Scholarship
export const addScholarship = async (req, res) => {
  try {
    const { name, description, amount, deadline, eligibility } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Scholarship name required.", success: false });
    }

    const university = await University.findOne({ adminId: req.user.id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    // Support multer `.files` structure: prefer `file` field, fall back to `image`.
    const scholarshipFile = (req.files && (req.files.file?.[0] || req.files.image?.[0])) || null;
    const documentUrl = await uploadToCloudinary(scholarshipFile, 'scholarships');

    university.scholarships.push({
      name,
      description,
      amount: Number(amount),
      deadline: deadline ? new Date(deadline) : null,
      eligibility,
      documentUrl,
    });

    await university.save();

    return res.status(200).json({
      message: "Scholarship added successfully",
      success: true,
      data: university.scholarships[university.scholarships.length - 1],
    });
  } catch (error) {
    console.error("Error adding scholarship:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get All Scholarships
export const getScholarships = async (req, res) => {
  try {
    const university = await University.findOne({ adminId: req.user.id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    return res.status(200).json({
      message: "Scholarships fetched successfully",
      success: true,
      data: university.scholarships,
    });
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Add Event
export const addEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date required.", success: false });
    }

    const university = await University.findOne({ adminId: req.user.id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    // Support multer `.files` structure: prefer `image` field, fall back to `file`.
    const eventFile = (req.files && (req.files.image?.[0] || req.files.file?.[0])) || null;
    const posterUrl = await uploadToCloudinary(eventFile, 'events');

    university.events.push({
      title,
      description,
      date: new Date(date),
      location,
      posterUrl,
    });

    await university.save();

    return res.status(200).json({
      message: "Event added successfully",
      success: true,
      data: university.events[university.events.length - 1],
    });
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const university = await University.findOne({ adminId: req.user.id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    return res.status(200).json({
      message: "Events fetched successfully",
      success: true,
      data: university.events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};