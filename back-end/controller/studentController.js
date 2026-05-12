import mongoose from 'mongoose';
import User from '../models/user.js';
import University from '../models/university.js';
import { parseEligibilityRange } from '../utils/criteriaParser.js';
import Groq from "groq-sdk";

let client = null;
try {
  if (process.env.GROQ_API_KEY) {
    client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
} catch (error) {
  console.error("Failed to initialize Groq client:", error.message);
}

const SYSTEM_PROMPT = `
You are UniBot, an intelligent assistant for Unisphere — a centralized SaaS platform
that connects students with universities in Punjab, Pakistan.

Your job is to help students with:
1. Information about universities in Punjab (public and private)
2. How to use Unisphere (registration, login, recommendations, scholarships, events)
3. Admission criteria and merit-based recommendations
4. Scholarship opportunities available through Unisphere
5. Events and news posted by universities

Universities you know about in Punjab, Pakistan include:
- University of the Punjab (PU), Lahore
- Lahore University of Management Sciences (LUMS), Lahore
- National University of Sciences and Technology (NUST), Islamabad
- University of Engineering and Technology (UET), Lahore
- Government College University (GCU), Lahore
- University of Central Punjab (UCP), Lahore
- Lahore College for Women University (LCWU), Lahore
- University of Lahore (UOL), Lahore
- Forman Christian College (FCC), Lahore
- Kinnaird College for Women, Lahore
- And many more...

Key features of Unisphere:
- Personalized university recommendations based on intermediate percentage and field of interest
- Scholarship listings from all universities
- Event notifications and updates
- Merit lists and admission status tracking
- Direct communication with university admission offices

Guidelines for responses:
- If someone asks something unrelated, politely say: "I can only help with Punjab universities and Unisphere-related questions."
- Keep answers short, clear, and helpful
- Always be friendly and professional
`;

export const chatbotMessage = async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        success: false,
        message: "Chatbot service is currently unavailable. Please try again later."
      });
    }

    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      messages: messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const botReply = response.choices[0].message.content;

    res.status(200).json({
      success: true,
      reply: botReply,
    });

  } catch (error) {
    console.error("Chatbot Full Error:", error);
    res.status(500).json({
      success: false,
      message: "Chatbot failed to respond. Please try again.",
      error: error.message
    });
  }
};

function getProgramFaculty(programName) {
  if (!programName || typeof programName !== 'string') {
    console.log('Warning: Invalid program name detected → returning "Other"');
    console.log('Offending value:', programName);
    return 'Other';
  }

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

// UPDATE PROFILE
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

    // Validate percentage
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

// GET PROFILE
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
      status: 'approved'
    }).select('-password -registeredStudents');

    const comparison = universities.map(uni => ({
      _id: uni._id,
      universityName: uni.institutionName,
      shortName: uni.shortName,
      logo: uni.logo,
      type: uni.type,
      hecRecognized: uni.hecRecognized,
      establishedYear: uni.establishedYear,
      address: uni.address,
      phone: uni.phone,
      website: uni.website,
      rating: uni.rating,
      stats: uni.stats,
      programs: uni.programs.filter(p => p.isActive !== false),
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

// GET RECOMMENDATIONS
export const getRecommendations = async (req, res) => {
  try {
    console.log('Time:', new Date().toISOString());
    console.log('Request body:', req.body);

    const { intermediatePercentage, fieldOfInterest } = req.body;

    if (!intermediatePercentage || !fieldOfInterest) {
      console.log('→ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Intermediate percentage and field of interest are required'
      });
    }

    const perc = parseFloat(intermediatePercentage);
    if (isNaN(perc) || perc < 0 || perc > 100) {
      console.log('→ Invalid percentage:', intermediatePercentage);
      return res.status(400).json({
        success: false,
        message: 'Invalid percentage value'
      });
    }

    console.log(`Processing request → %: ${perc} | Interest: ${fieldOfInterest}`);

    const universities = await University.find({
      status: 'approved'
    }).select('-password -registeredStudents');

    console.log(`Found ${universities.length} approved universities`);

    if (universities.length === 0) {
      console.log('!!! NO APPROVED UNIVERSITIES EXIST !!!');
    }

    const recommendations = {
      eligible: [],
      notEligible: [],
      fieldOfInterest,
      studentPercentage: perc
    };

    universities.forEach((university, idx) => {
      console.log(`\nUniversity #${idx + 1}: ${university.institutionName || '(unnamed)'} (${university._id})`);
      console.log(`Programs: ${university.programs?.length || 0}`);

      if (!university.programs || !Array.isArray(university.programs)) {
        console.log('  → Invalid or missing programs array');
        return;
      }

      const uniData = {
        _id: university._id,
        universityName: university.institutionName,
        shortName: university.shortName || '',
        logo: university.logo || '',
        address: university.address || '',
        phone: university.phone || '',
        type: university.type || '',
        hecRecognized: university.hecRecognized,
        rating: university.rating || 0,
        stats: university.stats || {}
      };

      const eligiblePrograms = [];
      const notEligiblePrograms = [];

      university.programs.forEach(program => {
        const pName = program.programName || program.name;
        const programFaculty = getProgramFaculty(pName);
        
        const range = parseEligibilityRange(program.eligibilityCriteria);
        const explicitMin = Number(program.minPercentage);
        const explicitMax = Number(program.maxPercentage);
        const minPerc = Number.isFinite(explicitMin) && explicitMin > 0 ? explicitMin : range.min;
        const maxPerc = Number.isFinite(explicitMax) ? explicitMax : range.max;
        console.log(`  • "${pName || '(no name)'}" → ${programFaculty} (active: ${program.isActive ?? 'unset'}) Min: ${minPerc}% Max: ${maxPerc}%`);

        if (programFaculty === fieldOfInterest && (program.isActive !== false)) {
          console.log('     → Faculty matched');

          const progData = {
            _id: program._id,
            name: pName || '(unnamed program)',
            level: program.level || 'N/A',
            duration: program.duration || 'N/A',
            minPercentage: minPerc,
            maxPercentage: maxPerc,
            totalSeats: program.totalSeats || 'N/A',
            availableSeats: program.availableSeats || 'N/A',
            feePerSemester: program.fee || program.feePerSemester || 'N/A',
            description: program.description || ''
          };

          if (perc >= progData.minPercentage && perc <= progData.maxPercentage) {
            console.log('       → Eligible');
            eligiblePrograms.push(progData);
          } else {
            console.log('       → Not eligible');
            notEligiblePrograms.push({
              ...progData,
              reason: perc < progData.minPercentage
                ? `Minimum ${progData.minPercentage}% required`
                : `Exceeds maximum ${progData.maxPercentage}%`
            });
          }
        } else {
          console.log('     → No match: Faculty ' + programFaculty + ' vs ' + fieldOfInterest);
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

    console.log('Final recommendations summary:');
    console.log(`  Eligible universities: ${recommendations.eligible.length}`);
    console.log(`  Not eligible universities: ${recommendations.notEligible.length}`);
    console.log('================================================================');

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('ERROR in getRecommendations:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// GET MY RECOMMENDATIONS (uses saved profile)
export const getMyRecommendations = async (req, res) => {
  console.log('Time:', new Date().toISOString());
  console.log('User from token:', req.user?._id || 'NO USER');

  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "student") {
      console.log('→ Not a student or user not found');
      return res.status(403).json({ success: false, message: "Student access only" });
    }

    console.log('Student profile loaded:', {
      id: user._id,
      percentage: user.intermediatePercentage,
      field: user.fieldOfInterest
    });

    if (!user.intermediatePercentage || !user.fieldOfInterest) {
      console.log('→ Profile incomplete');
      return res.status(400).json({
        success: false,
        message: 'Please complete your academic profile (percentage + field of interest)'
      });
    }

    const universities = await University.find({
      status: 'approved'
    }).select('-password -registeredStudents');

    console.log(`Found ${universities.length} approved universities`);

    if (universities.length === 0) {
      console.log('!!! NO APPROVED UNIVERSITIES IN DATABASE !!!');
    }

    const recommendations = {
      eligible: [],
      notEligible: [],
      fieldOfInterest: user.fieldOfInterest,
      studentPercentage: user.intermediatePercentage
    };

    universities.forEach((university, idx) => {
      console.log(`\nUniversity #${idx + 1}: ${university.institutionName || '(unnamed)'} (${university._id})`);
      console.log(`Programs: ${university.programs?.length || 0}`);

      if (!university.programs || !Array.isArray(university.programs)) {
        console.log('  → Invalid or missing programs array');
        return;
      }

      const uniData = {
        _id: university._id,
        universityName: university.institutionName,
        shortName: university.shortName || '',
        logo: university.logo || '',
        address: university.address || '',
        phone: university.phone || '',
        type: university.type || '',
        hecRecognized: university.hecRecognized,
        rating: university.rating || 0,
        stats: university.stats || {}
      };

      const eligiblePrograms = [];
      const notEligiblePrograms = [];

      university.programs.forEach(program => {
        const pName = program.programName || program.name;
        const programFaculty = getProgramFaculty(pName);
        
        const range = parseEligibilityRange(program.eligibilityCriteria);
        const explicitMin = Number(program.minPercentage);
        const explicitMax = Number(program.maxPercentage);
        const minPerc = Number.isFinite(explicitMin) && explicitMin > 0 ? explicitMin : range.min;
        const maxPerc = Number.isFinite(explicitMax) ? explicitMax : range.max;
        console.log(`  • "${pName || '(no name)'}" → ${programFaculty} (active: ${program.isActive ?? 'unset'}) Min: ${minPerc}% Max: ${maxPerc}%`);

        if (programFaculty === user.fieldOfInterest && (program.isActive !== false)) {
          console.log('     → Faculty matched');

          const progData = {
            _id: program._id,
            name: pName,
            level: program.level,
            duration: program.duration,
            minPercentage: minPerc,
            maxPercentage: maxPerc,
            totalSeats: program.totalSeats,
            availableSeats: program.availableSeats,
            feePerSemester: program.fee || program.feePerSemester || 'N/A',
            description: program.description
          };

          if (user.intermediatePercentage >= progData.minPercentage && user.intermediatePercentage <= progData.maxPercentage) {
            console.log('       → Eligible');
            eligiblePrograms.push(progData);
          } else {
            console.log('       → Not eligible');
            notEligiblePrograms.push({
              ...progData,
              reason: user.intermediatePercentage < progData.minPercentage
                ? `Minimum ${progData.minPercentage}% required`
                : `Exceeds maximum ${progData.maxPercentage}%`
            });
          }
        } else {
          console.log('     → No match: Faculty ' + programFaculty + ' vs ' + user.fieldOfInterest);
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

    console.log('Final summary:');
    console.log(`  Eligible universities: ${recommendations.eligible.length}`);
    console.log(`  Not eligible universities: ${recommendations.notEligible.length}`);
    
    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('ERROR in getMyRecommendations:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

//  getScholarships:
export const getScholarships = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "student") {
      return res.status(403).json({ success: false, message: "Student access only" });
    }

    // Find all approved universities and their scholarships
    const universities = await University.find({
      status: 'approved'
    }).select('institutionName scholarships');

    const allScholarships = [];
    universities.forEach(uni => {
      if (uni.scholarships && uni.scholarships.length > 0) {
        uni.scholarships.forEach(scholarship => {
          allScholarships.push({
            ...scholarship.toObject(),
            universityName: uni.institutionName,
            universityId: uni._id,
          });
        });
      }
    });

    console.log('Scholarships for user', user._id, ':', allScholarships);

    res.status(200).json({ success: true, data: allScholarships });
  } catch (error) {
    console.error("getScholarships error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve scholarships." });
  }
};

export const getAllScholarshipsPublic = async (req, res) => {
  try {
    const universities = await University.find({ status: "approved" })
      .select("institutionName scholarships admissionWebsite website");

    const scholarships = universities.flatMap((uni) =>
      (uni.scholarships || []).map((sch) => ({
        ...sch.toObject(),
        universityName: uni.institutionName,
        universityId: uni._id.toString(),
        admissionWebsite: uni.admissionWebsite || uni.website || "",
      }))
    );

    res.status(200).json({
      success: true,
      scholarships,
      count: scholarships.length,
    });
  } catch (error) {
    console.error("Public scholarships error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllEventsPublic = async (req, res) => {
  try {
    const universities = await University.find({ status: "approved" })
      .select("institutionName events");

    const events = universities.flatMap((uni) =>
      (uni.events || []).map((ev) => ({
        ...ev.toObject(),
        universityName: uni.institutionName,
        universityId: uni._id.toString(),
      }))
    );

    res.status(200).json({
      success: true,
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Public events error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const universities = await University.find({
      status: 'approved'
    }).select('institutionName _id events');

    const events = [];
    universities.forEach(uni => {
      uni.events.forEach(ev => {
        events.push({
          ...ev.toObject(),
          universityName: uni.institutionName,
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


// GET UNIVERSITY DETAILS 

export const getUniversityDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid University ID" });
    }

    const university = await University.findById(id).select('-password -registeredStudents');

    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    // Fetch student profile for eligibility check
    const student = await User.findById(req.user._id);
    const studentPerc = student?.intermediatePercentage || 0;
    const studentField = student?.fieldOfInterest || "";

    // Filter active programs and map fields for frontend consistency
    const activePrograms = university.programs
      .filter(p => p.isActive !== false)
      .map(p => {
        const pName = p.programName || p.name;
        const programFaculty = getProgramFaculty(pName);
        
        const range = parseEligibilityRange(p.eligibilityCriteria);
        const explicitMin = Number(p.minPercentage);
        const explicitMax = Number(p.maxPercentage);
        const minPerc = Number.isFinite(explicitMin) && explicitMin > 0 ? explicitMin : range.min;
        const maxPerc = Number.isFinite(explicitMax) ? explicitMax : range.max;

        let isEligible = false;
        let ineligibilityReason = null;

        if (programFaculty === studentField) {
            if (studentPerc >= minPerc && studentPerc <= maxPerc) {
                isEligible = true;
            } else {
                ineligibilityReason = studentPerc < minPerc 
                    ? `Min ${minPerc}% required` 
                    : `Exceeds max ${maxPerc}%`;
            }
        } else {
            ineligibilityReason = "Field mismatch";
        }

        return {
          ...p.toObject(),
          name: pName,
          faculty: programFaculty,
          minPercentage: minPerc,
          maxPercentage: maxPerc,
          feePerSemester: p.fee || p.feePerSemester || 'N/A',
          isEligible,
          ineligibilityReason
        };
      });

    const data = {
      ...university.toObject(),
      universityName: university.institutionName,
      programs: activePrograms,
      rating: university.rating || 0
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getUniversityDetails error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMeritLists = async (req, res) => {
  try {
    const { universityId } = req.query;
    if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({ success: false, message: "University ID is required" });
    }

    const university = await University.findById(universityId).select('-password -registeredStudents');
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    const student = await User.findById(req.user._id);
    const studentPerc = student?.intermediatePercentage || 0;
    const studentField = student?.fieldOfInterest || "";

    const programs = (university.programs || [])
      .filter(p => p.isActive !== false && p.meritsListUrl)
      .map(p => {
        const pName = p.programName || p.name;
        const programFaculty = getProgramFaculty(pName);
        const range = parseEligibilityRange(p.eligibilityCriteria);
        const explicitMin = Number(p.minPercentage);
        const explicitMax = Number(p.maxPercentage);
        const minPerc = Number.isFinite(explicitMin) && explicitMin > 0 ? explicitMin : range.min;
        const maxPerc = Number.isFinite(explicitMax) ? explicitMax : range.max;

        let isEligible = false;
        let ineligibilityReason = null;
        if (programFaculty === studentField) {
          if (studentPerc >= minPerc && studentPerc <= maxPerc) {
            isEligible = true;
          } else {
            ineligibilityReason = studentPerc < minPerc
              ? `Min ${minPerc}% required`
              : `Exceeds max ${maxPerc}%`;
          }
        } else {
          ineligibilityReason = "Field mismatch";
        }

        return {
          _id: p._id,
          programName: pName,
          universityName: university.institutionName,
          description: p.description,
          level: p.level,
          duration: p.duration,
          feePerSemester: p.fee || p.feePerSemester || 'N/A',
          meritsListUrl: p.meritsListUrl,
          isEligible,
          ineligibilityReason,
          faculty: programFaculty,
          minPercentage: minPerc,
          maxPercentage: maxPerc,
        };
      });

    res.status(200).json({ success: true, data: { universityName: university.institutionName, universityId: university._id, programs } });
  } catch (error) {
    console.error("getMeritLists error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// GET ALL UNIVERSITIES (Public/Student)

export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find({ status: 'approved' }).select('-password -registeredStudents');
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};