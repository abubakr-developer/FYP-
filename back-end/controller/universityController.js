import University from "../models/university.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/sendEmail.js";


function getProgramFaculty(programName) {
  const programLower = programName.toLowerCase();
  
  // 1. Faculty of Computing & Information Technology
  if (programLower.includes('computer') || 
      programLower.includes('software') || 
      programLower.includes('information technology') || 
      programLower.includes('artificial intelligence') || 
      programLower.includes('data science') ||
      programLower.includes('cyber') ||
      programLower.includes('computing') ||
      /\bcs\b/.test(programLower) || 
      /\bit\b/.test(programLower) || 
      /\bai\b/.test(programLower)) {
    return 'Faculty of Computing & Information Technology';
  }
  
  // 2. Faculty of Engineering & Architecture
  if (programLower.includes('engineering') || 
      programLower.includes('architecture')) {
    return 'Faculty of Engineering & Architecture';
  }

  // 3. Faculty of Humanities & Social Sciences
  if (programLower.includes('education') || 
      programLower.includes('english') || 
      programLower.includes('islamic') || 
      programLower.includes('media') || 
      programLower.includes('communication') || 
      programLower.includes('politics') || 
      programLower.includes('international relations') || 
      programLower.includes('urdu') || 
      programLower.includes('psychology') || 
      programLower.includes('sociology') || 
      programLower.includes('history') ||
      programLower.includes('arts')) {
    return 'Faculty of Humanities & Social Sciences';
  }
  
  // 4. Faculty of Law
  if (programLower.includes('law') || 
      programLower.includes('llb') || 
      programLower.includes('legal') || 
      programLower.includes('paralegal')) {
    return 'Faculty of Law';
  }
  
  // 5. Faculty of Management & Administrative Sciences
  if (programLower.includes('aviation') || 
      programLower.includes('business') || 
      programLower.includes('bba') || 
      programLower.includes('commerce') || 
      programLower.includes('economics') || 
      programLower.includes('accounting') || 
      programLower.includes('finance') || 
      programLower.includes('mba') || 
      programLower.includes('management') || 
      programLower.includes('admin')) {
    return 'Faculty of Management & Administrative Sciences';
  }

  // 7. Faculty of Pharmacy & Allied Health Sciences (Check before Sciences)
  if (programLower.includes('pharmacy') || 
      programLower.includes('pharmd') || 
      programLower.includes('physiotherapy') || 
      programLower.includes('rehabilitation') || 
      programLower.includes('dpt') || 
      programLower.includes('dietetics') || 
      programLower.includes('nutrition') || 
      programLower.includes('medical lab') || 
      programLower.includes('imaging') || 
      programLower.includes('radiography') || 
      programLower.includes('health')) {
    return 'Faculty of Pharmacy & Allied Health Sciences';
  }

  // 6. Faculty of Sciences (Generic Science check last)
  if (programLower.includes('biochemistry') || 
      programLower.includes('biology') || 
      programLower.includes('zoology') || 
      programLower.includes('biotechnology') || 
      programLower.includes('chemistry') || 
      programLower.includes('mathematics') || 
      programLower.includes('math') || 
      programLower.includes('physics') || 
      programLower.includes('botany') || 
      programLower.includes('science') || 
      programLower.includes('bio') ||
      programLower.includes('fsc') || 
      programLower.includes('intermediate')) {
    return 'Faculty of Sciences';
  }

  // 8. Faculty of Textile & Fashion Designing
  if (programLower.includes('fashion') || 
      programLower.includes('textile') || 
      programLower.includes('design')) {
    return 'Faculty of Textile & Fashion Designing';
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

    const existingDeleted = await University.findOne({ officialEmail: req.body.officialEmail, isDeleted: true });
if (existingDeleted) {
  return res.status(400).json({ message: "This email was previously removed. Contact support." });
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
      password,
      status: 'pending',
      isApproved: true,
      approvalStatus: 'approved',
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
    if (university.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your request has been rejected, Please contact us using our mail",
      });
    }

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

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const university = await University.findOne({ officialEmail: email.toLowerCase().trim() });
    if (!university) {
      return res.status(404).json({ message: "Email not found in university records" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    
    university.otp = otp;
    university.otpExpires = Date.now() + 10 * 60 * 1000;
    await university.save();

    const emailSent = await sendOtpEmail(university.officialEmail, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("University Forget Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find University with matching OTP and check expiry
    const university = await University.findOne({
      officialEmail: email.toLowerCase().trim(),
      otp: otp,
      otpExpires: { $gt: Date.now() } 
    }).select("+otp +otpExpires");

    if (!university) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    university.password = newPassword;
    
    // Clear OTP fields
    university.otp = undefined;
    university.otpExpires = undefined;
    await university.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("University Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const university = await University.findById(req.user._id).select('-password');
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }
    res.status(200).json({ success: true, university });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'institutionName', 'city', 'address', 'description',
      'website', 'admissionWebsite'
    ];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await University.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, university: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addProgram = async (req, res) => {
  try {
    const universityId = req.user._id;
    const programData = req.body;

    // Ensure isActive is true by default if not provided
    if (programData.isActive === undefined) {
      programData.isActive = true;
    }

    // Ensure percentages are stored as numbers
    const extractNumber = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const match = val.toString().match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    };

    if (programData.minPercentage !== undefined) {
      programData.minPercentage = extractNumber(programData.minPercentage);
    } else if (programData.eligibilityCriteria) {
      programData.minPercentage = extractNumber(programData.eligibilityCriteria);
    }
    
    if (programData.maxPercentage) programData.maxPercentage = extractNumber(programData.maxPercentage);

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

export const addEvent = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { title, date, location, description } = req.body;
    
    const newEvent = { title, date, location, description };

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

export const deleteProgram = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { programId } = req.params;

    const updatedUni = await University.findByIdAndUpdate(
      universityId,
      { $pull: { programs: { _id: programId } } },
      { new: true }
    );

    if (!updatedUni) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    res.status(200).json({ success: true, message: "Program deleted", programs: updatedUni.programs });
  } catch (error) {
    console.error("Delete Program Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete program" });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { programId } = req.params;
    const updates = req.body;

    const extractNumber = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const match = val.toString().match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    };

    const setFields = {};
    if (updates.programName) setFields["programs.$.programName"] = updates.programName;
    if (updates.duration) setFields["programs.$.duration"] = updates.duration;
    if (updates.eligibilityCriteria) {
        setFields["programs.$.eligibilityCriteria"] = updates.eligibilityCriteria;
        if (updates.minPercentage === undefined) {
             setFields["programs.$.minPercentage"] = extractNumber(updates.eligibilityCriteria);
        }
    }
    if (updates.fee) setFields["programs.$.fee"] = updates.fee;
    if (updates.seats) setFields["programs.$.seats"] = updates.seats;
    if (updates.minPercentage !== undefined) setFields["programs.$.minPercentage"] = extractNumber(updates.minPercentage);
    if (updates.maxPercentage !== undefined) setFields["programs.$.maxPercentage"] = extractNumber(updates.maxPercentage);

    const updateQuery = { $set: setFields };

    if (updates.programName) {
        const faculty = getProgramFaculty(updates.programName);
        updateQuery.$addToSet = { faculties: faculty };
    }

    const updatedUni = await University.findOneAndUpdate(
      { _id: universityId, "programs._id": programId },
      updateQuery,
      { new: true }
    );

    if (!updatedUni) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    res.status(200).json({ success: true, message: "Program updated", programs: updatedUni.programs });
  } catch (error) {
    console.error("Update Program Error:", error);
    res.status(500).json({ success: false, message: "Failed to update program" });
  }
};

export const deleteScholarship = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { scholarshipId } = req.params;

    const updatedUni = await University.findByIdAndUpdate(
      universityId,
      { $pull: { scholarships: { _id: scholarshipId } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Scholarship deleted", scholarships: updatedUni.scholarships });
  } catch (error) {
    console.error("Delete Scholarship Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete scholarship" });
  }
};

export const updateScholarship = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { scholarshipId } = req.params;
    const updates = req.body;

    const updatedUni = await University.findOneAndUpdate(
      { _id: universityId, "scholarships._id": scholarshipId },
      {
        $set: {
          "scholarships.$.name": updates.name,
          "scholarships.$.percentage": updates.percentage,
          "scholarships.$.deadline": updates.deadline,
          "scholarships.$.description": updates.description,
          "scholarships.$.eligibility": updates.eligibility
        }
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Scholarship updated", scholarships: updatedUni.scholarships });
  } catch (error) {
    console.error("Update Scholarship Error:", error);
    res.status(500).json({ success: false, message: "Failed to update scholarship" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { eventId } = req.params;

    const updatedUni = await University.findByIdAndUpdate(
      universityId,
      { $pull: { events: { _id: eventId } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Event deleted", events: updatedUni.events });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const universityId = req.user._id;
    const { eventId } = req.params;
    const { title, date, location, description } = req.body;
    
    const updateFields = {
      "events.$.title": title,
      "events.$.date": date,
      "events.$.location": location,
      "events.$.description": description
    };

    const updatedUni = await University.findOneAndUpdate(
      { _id: universityId, "events._id": eventId },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Event updated", events: updatedUni.events });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};
