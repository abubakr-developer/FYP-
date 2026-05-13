import express from 'express';
import { chatbotMessage } from '../controller/studentController.js';


const router = express.Router();

router.post('/message', chatbotMessage);

export default router;