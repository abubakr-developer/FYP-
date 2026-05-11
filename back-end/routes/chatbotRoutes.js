import express from 'express';
import { chatbotMessage } from '../controller/studentController.js';


const router = express.Router();

router.post('/chatbot/message', chatbotMessage);

export default router;