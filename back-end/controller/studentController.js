import User from "../models/user.js";
import University from "../models/university.js";

export const fscResult = async (req, res) => {
  try {
    const {intermediatePercentage } = req.body;
    const percentage = intermediatePercentage;

    if (percentage === undefined || percentage === null || percentage < 33 || percentage > 100) {
      return res.status(400).json({ message: "Please provide a valid intermediate percentage between 33 and 100.", success: false });
    }
    // if (!req.file) {
    //   return res.status(400).json({ message: "Please upload your result card.", success: false });
    // }

    const student = await User.findById(req.user._id);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access denied. Only students can submit results.", success: false });
    }

    // store submitted values on the student and save
    student.intermediatePercentage = percentage;
    // student.resultCardUrl = req.file.path || req.file.location || req.file.filename || "";

    await student.save();
    return res.status(200).json({ message: "FSC result Percentage uploaded successfully", success: true});
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};




export const getRecommendations = async (req, res) => {
  try {
    const { programName } = req.body; // e.g. "BS Computer Science" or "BS-CS"

    if (!programName) {
      return res.status(400).json({ message: "Program name is required", success: false });
    }

    const student = await User.findById(req.user._id);
    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    if (student.intermediatePercentage == null) {
      return res.status(400).json({ message: "Please upload your FSC result first", success: false });
    }

    const universities = await University.find({});

    const recommendations = [];

    universities.forEach(uni => {
      uni.programs.forEach(prog => {
        if (prog.programName.toLowerCase().includes(programName.toLowerCase())) {
          const isEligible = prog.eligibilityCriteria <= student.intermediatePercentage;

          recommendations.push({
            universityName: uni.name,
            universityId: uni._id,
            location: uni.location || "Punjab",
            logoUrl: uni.logoUrl,
            programName: prog.programName,
            requiredPercentage: prog.eligibilityCriteria,
            yourPercentage: student.intermediatePercentage,
            isEligible,
            alert: !isEligible ? `Required: ${prog.eligibilityCriteria}% (you have only ${student.intermediatePercentage}%)` : null,
            margin: isEligible ? student.intermediatePercentage - prog.eligibilityCriteria : null
          });
        }
      });
    });

    // Eligible on top, sorted by highest merit first
    recommendations.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.requiredPercentage - a.requiredPercentage; // higher merit = top
    });

    return res.status(200).json({
      message: recommendations.length ? "Recommendations ready" : "No matching programs found",
      success: true,
      count: recommendations.length,
      data: recommendations
    });

  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};