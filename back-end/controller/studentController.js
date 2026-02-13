// controllers/studentController.js

import User from '../models/user.js';
import University from '../models/university.js';

// Helper function - unchanged (good as is)
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

// ────────────────────────────────────────────────
// UPDATE PROFILE
// ────────────────────────────────────────────────
export const updateStudentProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      intermediatePercentage,
      intermediateBoard,
      intermediateYear,
      fieldOfInterest
    } = req.body;

    // Validate percentage (core requirement)
    const percentage = parseFloat(intermediatePercentage);
    if (isNaN(percentage) || percentage < 33 || percentage > 100) {
      return res.status(400).json({ 
        success: false, 
        message: "Intermediate percentage must be between 33 and 100" 
      });
    }

    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      intermediatePercentage: percentage,
      intermediateBoard,
      intermediateYear,
      fieldOfInterest,
    };

    // Clean undefined / empty values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined || updateData[key] === '' ? delete updateData[key] : {}
    );

    if (req.file) {
      updateData.resultCardUrl = req.file.path || req.file.location || req.file.filename || "";
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can update this profile" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    console.error("updateStudentProfile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────
// GET PROFILE
// ────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied - student only" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Existing compareUniversities
export const compareUniversities = async (req, res) => {
  try {
    const { universityIds } = req.body;

    if (!universityIds || universityIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 university IDs to compare'
      });
    }

    const universities = await University.find({
      _id: { $in: universityIds },
      isApproved: true,
      approvalStatus: 'approved'
    }).select('-password -registeredStudents');

    const comparison = universities.map(uni => ({
      _id: uni._id,
      universityName: uni.universityName,
      shortName: uni.shortName,
      logo: uni.logo,
      type: uni.type,
      hecRecognized: uni.hecRecognized,
      establishedYear: uni.establishedYear,
      address: uni.address,
      website: uni.website,
      rating: uni.rating,
      stats: uni.stats,
      programs: uni.programs.filter(p => p.isActive),
      faculties: uni.faculties
    }));

    res.status(200).json({
      success: true,
      data: { comparison }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ────────────────────────────────────────────────
// GET RECOMMENDATIONS (ad-hoc - body based)
// ────────────────────────────────────────────────
export const getRecommendations = async (req, res) => {
  try {
    const { intermediatePercentage, fieldOfInterest } = req.body;

    if (!intermediatePercentage || !fieldOfInterest) {
      return res.status(400).json({
        success: false,
        message: 'Intermediate percentage and field of interest are required'
      });
    }

    const perc = parseFloat(intermediatePercentage);
    if (isNaN(perc) || perc < 0 || perc > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid percentage value'
      });
    }

    const universities = await University.find({
      isApproved: true,
      approvalStatus: 'approved',
    }).select('-password -registeredStudents');

    const recommendations = {
      eligible: [],
      notEligible: [],
      fieldOfInterest,
      studentPercentage: perc
    };

    universities.forEach(university => {
      const uniData = {
        _id: university._id,
        universityName: university.universityName,
        shortName: university.shortName || '',
        logo: university.logo || '',
        address: university.address || '',
        type: university.type || '',
        hecRecognized: university.hecRecognized,
        rating: university.rating || 0,
        stats: university.stats || {}
      };

      const eligiblePrograms = [];
      const notEligiblePrograms = [];

      university.programs.forEach(program => {
        const programFaculty = getProgramFaculty(program.name);
        
        if (programFaculty === fieldOfInterest && program.isActive) {
          const progData = {
            _id: program._id,
            name: program.name,
            level: program.level,
            duration: program.duration,
            minPercentage: program.minPercentage,
            maxPercentage: program.maxPercentage,
            totalSeats: program.totalSeats,
            availableSeats: program.availableSeats,
            feePerSemester: program.feePerSemester,
            description: program.description
          };

          if (perc >= program.minPercentage && perc <= (program.maxPercentage || 100)) {
            eligiblePrograms.push(progData);
          } else {
            notEligiblePrograms.push({
              ...progData,
              reason: perc < program.minPercentage 
                ? `Minimum ${program.minPercentage}% required`
                : `Exceeds maximum ${program.maxPercentage}%`
            });
          }
        }
      });

      if (eligiblePrograms.length > 0) {
        recommendations.eligible.push({ ...uniData, programs: eligiblePrograms });
      }
      if (notEligiblePrograms.length > 0) {
        recommendations.notEligible.push({ ...uniData, programs: notEligiblePrograms });
      }
    });

    recommendations.eligible.sort((a, b) => b.programs.length - a.programs.length);

    // FIX: Add logging for debugging (remove in production)
    console.log('Recommendations generated:', recommendations);

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────
// GET MY RECOMMENDATIONS (uses saved profile)
// ────────────────────────────────────────────────
export const getMyRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "student") {
      return res.status(403).json({ success: false, message: "Student access only" });
    }

    if (!user.intermediatePercentage || !user.fieldOfInterest) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your academic profile (percentage + field of interest)'
      });
    }

    const universities = await University.find({
      isApproved: true,
      approvalStatus: 'approved',
    }).select('-password -registeredStudents');

    const recommendations = {
      eligible: [],
      notEligible: [],
      fieldOfInterest: user.fieldOfInterest,
      studentPercentage: user.intermediatePercentage
    };

    universities.forEach(university => {
      const uniData = {
        _id: university._id,
        universityName: university.universityName,
        shortName: university.shortName || '',
        logo: university.logo || '',
        address: university.address || '',
        type: university.type || '',
        hecRecognized: university.hecRecognized,
        rating: university.rating || 0,
        stats: university.stats || {}
      };

      const eligiblePrograms = [];
      const notEligiblePrograms = [];

      university.programs.forEach(program => {
        const programFaculty = getProgramFaculty(program.name);
        
        if (programFaculty === user.fieldOfInterest && program.isActive) {
          const progData = {
            _id: program._id,
            name: program.name,
            level: program.level,
            duration: program.duration,
            minPercentage: program.minPercentage,
            maxPercentage: program.maxPercentage,
            totalSeats: program.totalSeats,
            availableSeats: program.availableSeats,
            feePerSemester: program.feePerSemester,
            description: program.description
          };

          if (user.intermediatePercentage >= program.minPercentage &&
              user.intermediatePercentage <= (program.maxPercentage || 100)) {
            eligiblePrograms.push(progData);
          } else {
            notEligiblePrograms.push({
              ...progData,
              reason: user.intermediatePercentage < program.minPercentage 
                ? `Minimum ${program.minPercentage}% required`
                : `Exceeds maximum ${program.maxPercentage}%`
            });
          }
        }
      });

      if (eligiblePrograms.length > 0) recommendations.eligible.push({ ...uniData, programs: eligiblePrograms });
      if (notEligiblePrograms.length > 0) recommendations.notEligible.push({ ...uniData, programs: notEligiblePrograms });
    });

    recommendations.eligible.sort((a, b) => b.programs.length - a.programs.length);

    // FIX: Add logging for debugging (remove in production)
    console.log('My Recommendations generated for user', user._id, ':', recommendations);

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// The other functions (compareUniversities, getScholarships, getEvents) remain the same
// but replace Student → User in them too:

// Example for getScholarships:
export const getScholarships = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "student") {
      return res.status(403).json({ success: false, message: "Student access only" });
    }

    if (!user.fieldOfInterest) {
      return res.status(400).json({
        success: false,
        message: 'Please set your field of interest in your profile first'
      });
    }

    // Find universities that have the student's field of interest in their faculties.
    const universities = await University.find({
      isApproved: true,
      approvalStatus: 'approved',
    }).select('universityName scholarships programs');

    const allScholarships = [];
    universities.forEach(uni => {
      // Check if university has any program in the student's field of interest
      const hasRelevantProgram = uni.programs.some(p => getProgramFaculty(p.name) === user.fieldOfInterest);

      if (hasRelevantProgram) {
        uni.scholarships.forEach(scholarship => {
          allScholarships.push({
            ...scholarship.toObject(),
            universityName: uni.universityName,
            universityId: uni._id,
          });
        });
      }
    });

    // FIX: Add logging for debugging
    console.log('Scholarships for user', user._id, ':', allScholarships);

    res.status(200).json({ success: true, data: allScholarships });
  } catch (error) {
    console.error("getScholarships error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve scholarships." });
  }
};

// Do the same replacement in getEvents and compareUniversities

// @desc    Get all events from approved universities (sorted by date)
// @route   GET /api/auth/events
// @access  Private (Student)
export const getEvents = async (req, res) => {
  try {
    const universities = await University.find({
      isApproved: true,
      approvalStatus: 'approved'
    }).select('universityName _id events');

    const events = [];
    universities.forEach(uni => {
      uni.events.forEach(ev => {
        events.push({
          ...ev.toObject(),
          universityName: uni.universityName,
          universityId: uni._id
        });
      });
    });

    // Sort by date ascending
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // FIX: Add logging for debugging
    console.log('Events fetched:', events);

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};