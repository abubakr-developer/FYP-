import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

// Helper: get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAX_FILE_SIZE = 10 * 1024 * 1024;      // 10 MB
const MAX_FIELD_SIZE = 2 * 1024 * 1024;      // 2 MB for text fields

// Use memory storage for temporary buffering before Cloudinary upload
const storage = multer.memoryStorage();

// Create folders if needed (though not required for Cloudinary, good for fallback)
const folders = [
  join(__dirname, '../uploads'),
  join(__dirname, '../uploads/images'),
  join(__dirname, '../uploads/files')
];
folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

export const uploadsImg = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  }
}).single('image');


// Upload to Cloudinary helper function
export const uploadToCloudinary = async (fileBuffer, folder = 'unisphere') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: `unisphere/${folder}`, resource_type: 'auto' }, // 'auto' detects image/raw
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name in form data.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }

  if (err) {
    console.error('Multer / upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }

  next();
}