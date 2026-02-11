import express from 'express';
import { isUniversityAdmin } from '../middleware/isUniversityAdmin.js';
import { uploadsImg } from '../middleware/multer.js';
import userAuth from '../middleware/userAuth.js';
import {loginUniversity ,registerUniversity,  addProgram, getPrograms, addScholarship, getScholarships, addEvent, getEvents } from '../controller/universityController.js';

const universityRouter = express.Router();

universityRouter.post('/register', registerUniversity);
universityRouter.post('/login', loginUniversity)

universityRouter.post('/programs', userAuth, isUniversityAdmin, addProgram);
universityRouter.get('/programs', userAuth, isUniversityAdmin, getPrograms);

universityRouter.post('/scholarships', userAuth, isUniversityAdmin, uploadsImg, addScholarship);
universityRouter.get('/scholarships', userAuth, isUniversityAdmin, getScholarships);

universityRouter.post(
  '/events',
  userAuth,
  isUniversityAdmin,
  uploadsImg,         
  addEvent
);universityRouter.get('/events', userAuth, isUniversityAdmin, getEvents);

export default universityRouter;