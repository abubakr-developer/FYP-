import express from 'express';
import { register, login, logout, forgetPassword, resetPassword, verifyOtp, updateProfile, getCurrentUser } from '../controller/authController.js';
import { getRecommendations, getMyRecommendations, getScholarships, getEvents, compareUniversities, updateStudentProfile, getProfile} from '../controller/studentController.js';
import userAuth from '../middleware/userAuth.js';
const authRouter = express.Router();
 
// Registration with file uploads
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgetPassword', forgetPassword);
authRouter.post('/resetPassword', resetPassword);
authRouter.post('/verifyOtp', verifyOtp);
authRouter.post('/getRecommendations', userAuth, getRecommendations);
authRouter.post('/updateProfile',  userAuth, updateStudentProfile);
authRouter.get('/profile', userAuth, getProfile);
authRouter.get('/myRecommendations', userAuth, getMyRecommendations);
authRouter.get('/scholarships', userAuth, getScholarships);
authRouter.get('/events', userAuth, getEvents);
authRouter.post('/compare', userAuth, compareUniversities);
authRouter.put('/updateProfile/:id',userAuth, updateProfile);
authRouter.get('/getCurrentUser',userAuth, getCurrentUser)

export default authRouter; 