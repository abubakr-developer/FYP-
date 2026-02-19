import express from 'express';
import auth from '../middleware/userAuth.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';
import User from '../models/user.js';
import University from '../models/university.js';
import {login} from '../controller/superAdminController.js'
import {
  getAnalytics,
  getAllUsers, 
  updateUser,
  deleteUser,
  getAllUniversities,
  updateUniversity,
  deleteUniversity,
  getPendingUniversities,
  approveUniversity,
  rejectUniversity,
} from '../controller/superAdminController.js';

const routes = express.Router();

routes.post('/login', login);

routes.get('/students', auth, isSuperAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password -resetOTP -resetOTPExpiry');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
routes.delete('/students/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
routes.get('/universities/all', auth, isSuperAdmin, async (req, res) => {
  try {
    const universities = await University.find({ status: 'approved' }).select('-password');
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
routes.put('/universities/:id/rating', auth, isSuperAdmin, async (req, res) => {
  const { rating } = req.body; // expect number 0–5
  if (rating < 0 || rating > 5) return res.status(400).json({ message: 'Rating must be 0–5' });

  try {
    const uni = await University.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    ).select('-password');
    
    if (!uni) return res.status(404).json({ message: 'University not found' });

    res.json({ success: true, university: uni });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
routes.put('/users/:userId', auth, isSuperAdmin, updateUser);
routes.delete('/users/:userId', auth, isSuperAdmin, deleteUser);
routes.get('/universities', async (req, res) => {
  try {
    const universities = await University.find({ 
      status: 'approved'   // only approved ones visible to students
    }).select('institutionName city address institutionType description rating programs admissionWebsite website');

    res.json({ success: true, universities });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});routes.put('/universities/:universityId', auth, isSuperAdmin, updateUniversity);
routes.delete('/universities/:universityId', auth, isSuperAdmin, deleteUniversity);
routes.get('/universities/pending',   auth, isSuperAdmin, getPendingUniversities);
routes.post('/universities/approve/:universityId', auth, isSuperAdmin, approveUniversity);
routes.post('/universities/reject/:universityId', auth, isSuperAdmin, rejectUniversity);
routes.get('/universities/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id).select('-password');
    if (!university || university.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    res.json({ success: true, data: university });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
routes.get('/public/stats', async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const universityCount = await University.countDocuments({ status: 'approved' });
    res.json({ success: true, stats: { students: studentCount, universities: universityCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default routes; 
