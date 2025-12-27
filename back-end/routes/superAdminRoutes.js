import express from 'express';
import auth from '../middlewaee/userAuth.js';
import { isSuperAdmin } from '../middlewaee/isSuperAdmin.js';
import {
  getAnalytics,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllUniversities,
  updateUniversity,
  deleteUniversity,
} from '../controller/superAdminController.js';

const routes = express.Router();

routes.get('/analytics', auth, isSuperAdmin, getAnalytics);
routes.get('/users', auth, isSuperAdmin, getAllUsers);
routes.put('/users/:userId', auth, isSuperAdmin, updateUser);
routes.delete('/users/:userId', auth, isSuperAdmin, deleteUser);
routes.get('/universities', auth, isSuperAdmin, getAllUniversities);
routes.put('/universities/:universityId', auth, isSuperAdmin, updateUniversity);
routes.delete('/universities/:universityId', auth, isSuperAdmin, deleteUniversity);

export default routes;
