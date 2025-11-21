import express from 'express';
import { register, login, forgetPassword, resetPassword, verifyOtp, updateProfile, getCurrentUser } from '../controller/authController.js';
import { registerUploads } from '../middlewaee/multer.js';
import userAuth from '../middlewaee/userAuth.js';
const authRouter = express.Router();

// Registration with file uploads
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/forgetPassword', forgetPassword);
authRouter.post('/resetPassword', resetPassword);
authRouter.post('/verifyOtp', verifyOtp);
authRouter.put('/updateProfile/:id',userAuth, updateProfile);
authRouter.get('/getCurrentUser',userAuth, getCurrentUser)

export default authRouter;