import University from "../models/university.js";

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

    const documentUrl = await uploadToCloudinary(req.file, 'scholarships');

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

    const posterUrl = await uploadToCloudinary(req.file, 'events');

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