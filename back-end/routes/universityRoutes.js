import express from 'express';
import { isUniversityAdmin } from '../middlewaee/isUniversityAdmin.js';
import { registerUploads } from '../middlewaee/multer.js';
import userAuth from '../middlewaee/userAuth.js';
import { addProgram, getPrograms, addScholarship, getScholarships, addEvent, getEvents } from '../controller/universityController.js';

const universityRouter = express.Router();

universityRouter.post('/programs', userAuth, isUniversityAdmin, addProgram);
universityRouter.get('/programs', userAuth, isUniversityAdmin, getPrograms);

universityRouter.post('/scholarships', userAuth, isUniversityAdmin, registerUploads, addScholarship);
universityRouter.get('/scholarships', userAuth, isUniversityAdmin, getScholarships);

universityRouter.post('/events', userAuth, isUniversityAdmin, registerUploads, addEvent);
universityRouter.get('/events', userAuth, isUniversityAdmin, getEvents);

export default universityRouter;