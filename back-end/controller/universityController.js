import University from "../models/university.js";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// University Registration
export const registerUniversity = async (req, res) => {
  try {
    const { institutionName, officialEmail, contactPerson, phone, password, designation, website, address, institutionType } = req.body;

    if (!institutionName || !officialEmail || !contactPerson || !phone || !password) {
      return res.status(400).json({ message: "Required fields missing", success: false });
    }

    const existingUni = await University.findOne({ officialEmail: officialEmail.toLowerCase() });
    const existingUser = await User.findOne({ email: officialEmail.toLowerCase() });
    if (existingUni || existingUser) {
      return res.status(400).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uni = new University({
      institutionName,
      officialEmail: officialEmail.toLowerCase(),
      contactPerson,
      designation,
      phone,
      website,
      address,
      institutionType,
      password: hashedPassword,
      status: 'pending'
    });

    await uni.save();

    // Create a user account for university admin
    const [firstName, ...remaining] = (contactPerson || '').trim().split(/\s+/);
    const lastName = remaining.length ? remaining.join(' ') : '';

    const adminUser = new User({
      firstName: firstName || 'Admin',
      lastName: lastName || '',
      email: officialEmail.toLowerCase(),
      phone: phone || '',
      password: hashedPassword,
      role: 'universityAdmin'
    });

    try {
      await adminUser.save();
    } catch (userErr) {
      console.error('Error creating admin user:', userErr);
      if (userErr.name === 'ValidationError') {
        const errors = Object.values(userErr.errors).map(e => e.message).join(', ');
        return res.status(400).json({ message: `Invalid admin user data: ${errors}`, success: false, errors: userErr.errors });
      }
      if (userErr.code === 11000) {
        return res.status(400).json({ message: 'Email or phone already registered', success: false });
      }
      return res.status(500).json({ message: 'Failed to create admin user', success: false });
    }

    // Link admin user to university
    uni.adminId = adminUser._id;
    await uni.save();

    return res.status(201).json({ message: "University registration submitted", success: true, university: { id: uni._id, status: uni.status } });
  } catch (error) {
    console.error("Error registering university:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: `Invalid university data: ${errors}`, success: false, errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'University email already registered', success: false });
    }
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// University login
export const loginUniversity = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required", success: false });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'universityAdmin' });
    if (!user) return res.status(400).json({ message: "Admin user not found", success: false });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password", success: false });

    // Check university approval status
    const uni = await University.findOne({ adminId: user._id });
    if (!uni) return res.status(400).json({ message: "Associated university not found", success: false });
    if (uni.status !== 'approved') return res.status(403).json({ message: "University not approved yet", success: false });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" });

    return res.status(200).json({ message: "Login successful", success: true, token });
  } catch (error) {
    console.error("University login error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Add Course/Program (with admission criteria)
export const addProgram = async (req, res) => {
  try {
    const { programName, eligibilityCriteria, fee, duration, seats } = req.body;

    if (!programName || !eligibilityCriteria) {
      return res.status(400).json({ message: "Program name and eligibility criteria required.", success: false });
    }

    const university = await University.findOne({ adminId: req.user._id });
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
    const university = await University.findOne({ adminId: req.user._id });
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

    const university = await University.findOne({ adminId: req.user._id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    const documentUrl = req.file?.path || (typeof uploadToCloudinary === 'function' ? await uploadToCloudinary(req.file, 'scholarships') : null);

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
    const university = await University.findOne({ adminId: req.user._id });
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

    const university = await University.findOne({ adminId: req.user._id });
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    const posterUrl = req.file?.path || (typeof uploadToCloudinary === 'function' ? await uploadToCloudinary(req.file, 'events') : null);

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
    const university = await University.findOne({ adminId: req.user._id });
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