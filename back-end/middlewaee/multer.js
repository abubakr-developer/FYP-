import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.fieldname === 'image') folder = 'uploads/images/';
    if (file.fieldname === 'file') folder = 'uploads/files/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'image' ? 'img-' : 'file-';
    cb(null, `${prefix}${Date.now()}${path.extname(file.originalname)}`);
  }
});


export const registerUploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') { 
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only images are allowed'), false);
      }
    } else if (file.fieldname === 'file') { 
      const ext = path.extname(file.originalname).toLowerCase(); // changing yahan say hoi 
      if (file.mimetype === 'application/pdf' || ext === '.pdf') {
        cb(null, true);
        return;
      }
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);