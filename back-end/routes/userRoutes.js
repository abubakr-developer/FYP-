import express from 'express';
import { getAllUsers } from '../controller/userController.js'
import userAuth from '../middleware/userAuth.js';

const userRoutes = express.Router();
userRoutes.get('/',userAuth, getAllUsers);

export default userRoutes;