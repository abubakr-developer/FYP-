import express from 'express';
import { isUniversityAdmin } from '../middleware/isUniversityAdmin.js';
import { uploadsImg } from '../middleware/multer.js';
import userAuth from '../middleware/userAuth.js';
import {
  loginUniversity,
  registerUniversity,
  getProfile,
  updateProfile,
  addProgram,
  getPrograms,
  deleteProgram,
  updateProgram,
  addScholarship,
  getScholarships,
  deleteScholarship,
  updateScholarship,
  addEvent,
  getEvents,
  deleteEvent,
  updateEvent,
  forgetPassword,
  resetPassword 
} from '../controller/universityController.js';

const universityRouter = express.Router();

universityRouter.post('/register', registerUniversity);
universityRouter.post('/login', loginUniversity)

universityRouter.post('/forgetPassword', forgetPassword);
universityRouter.post('/resetPassword', resetPassword);

universityRouter.get('/profile', userAuth, getProfile);
universityRouter.put('/profile', userAuth, updateProfile);

universityRouter.post('/programs', userAuth, isUniversityAdmin, addProgram);
universityRouter.get('/programs', userAuth, isUniversityAdmin, getPrograms);
universityRouter.put('/programs/:programId', userAuth, isUniversityAdmin, updateProgram);
universityRouter.delete('/programs/:programId', userAuth, isUniversityAdmin, deleteProgram);

universityRouter.post('/scholarships', userAuth, isUniversityAdmin, addScholarship);
universityRouter.get('/scholarships', userAuth, isUniversityAdmin, getScholarships);
universityRouter.put('/scholarships/:scholarshipId', userAuth, isUniversityAdmin, updateScholarship);
universityRouter.delete('/scholarships/:scholarshipId', userAuth, isUniversityAdmin, deleteScholarship);

universityRouter.post('/events', userAuth, isUniversityAdmin, addEvent);
universityRouter.get('/events', userAuth, isUniversityAdmin, getEvents);
universityRouter.put('/events/:eventId', userAuth, isUniversityAdmin, updateEvent);
universityRouter.delete('/events/:eventId', userAuth, isUniversityAdmin, deleteEvent);

export default universityRouter;