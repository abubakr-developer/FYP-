import User from "../models/user";
import University from "../models/university";

export const fscResult = async (req, res) => {
  try {
    const { interPercentage } = req.body;

    if (interPercentage === undefined || interPercentage === null || interPercentage < 33 || interPercentage > 100) {
      return res.status(400).json({ message: "Please provide a valid intermediate percentage between 33 and 100.", success: false });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Please upload your result card.", success: false });
    }

    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access denied. Only students can submit results.", success: false });
    }

    // store submitted values on the student and save
    student.intermediatePercentage = interPercentage;
    student.resultCardUrl = req.file.path || req.file.location || req.file.filename || "";

    await student.save();
    return res.status(200).json({
      message: "FSC result uploaded successfully",
      success: true,
      data: {
        intermediatePercentage: student.intermediatePercentage,
        resultCardUrl: student.resultCardUrl, // now Cloudinary URL
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};