import User from '../models/user.js';
import University from '../models/university.js';

// Get Platform Analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const universityAdmins = await User.countDocuments({ role: 'universityAdmin' });
    const universities = await University.countDocuments();

    // Add more: e.g., applications count if you have Application model

    return res.status(200).json({
      message: "Analytics fetched successfully",
      success: true,
      data: {
        totalUsers,
        students,
        universityAdmins,
        universities,
        // Add compliance metrics, e.g., active/inactive users
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Manage Users: Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'superAdmin' } }).select('-password'); // Exclude superAdmins & passwords

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phoneNo, country, role, isActive } = req.body; // e.g., for compliance/ban

    const user = await User.findById(userId);
    if (!user || user.role === 'superAdmin') {
      return res.status(404).json({ message: "User not found or cannot update super admin.", success: false });
    }

    if (name) user.name = name;
    if (phoneNo) user.phoneNo = phoneNo;
    if (country) user.country = country;
    if (role && ['student', 'universityAdmin'].includes(role)) user.role = role;
    if (isActive !== undefined) user.isActive = isActive; // For ban/compliance (add isActive field to model)

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || user.role === 'superAdmin') {
      return res.status(404).json({ message: "User not found or cannot delete super admin.", success: false });
    }

    // If universityAdmin, optionally delete linked university
    if (user.role === 'universityAdmin') {
      await University.deleteOne({ adminId: userId });
    }

    await User.deleteOne({ _id: userId });

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Manage Universities: Get All
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find({});

    return res.status(200).json({
      message: "Universities fetched successfully",
      success: true,
      data: universities,
    });
  } catch (error) {
    console.error("Error fetching universities:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update University
export const updateUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;
    const { name, location, description } = req.body; // Add more fields as needed

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    if (name) university.name = name;
    if (location) university.location = location;
    if (description) university.description = description;

    await university.save();

    return res.status(200).json({
      message: "University updated successfully",
      success: true,
      data: university,
    });
  } catch (error) {
    console.error("Error updating university:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete University
export const deleteUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: "University not found.", success: false });
    }

    // Optionally delete linked admin user
    if (university.adminId) {
      await User.deleteOne({ _id: university.adminId });
    }

    await University.deleteOne({ _id: universityId });

    return res.status(200).json({
      message: "University deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting university:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};