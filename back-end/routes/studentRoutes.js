import express from "express";
import { 
    updateStudentProfile, 
    getProfile, 
    getMyRecommendations, 
    getScholarships, 
    getEvents,
    compareUniversities
} from "../controller/studentController.js";
import userAuth from "../middleware/userAuth.js"; 

const router = express.Router();

// Protected routes (require login)
router.get("/profile", userAuth, getProfile);
router.post("/update-profile", userAuth, updateStudentProfile);
router.get("/recommendations", userAuth, getMyRecommendations);
router.get("/scholarships", userAuth, getScholarships);
router.get("/events", userAuth, getEvents);

// Public or semi-public routes
router.post("/compare", compareUniversities);

export default router;