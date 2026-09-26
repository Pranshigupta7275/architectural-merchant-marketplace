// SERVER/src/utils/upload.util.js
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // <-- 1. Import the File System module
import { ApiError } from './ApiError.js';

// 2. Define the absolute path to the uploads folder
const __dirname = path.resolve();
const uploadPath = path.join(__dirname, 'uploads');

// 3. Auto-Create the folder if it does not exist!
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('📁 Created uploads directory automatically');
}

// 4. Configure where and how the file is saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Use the absolute path we guaranteed exists
    cb(null, uploadPath); 
  },
  filename(req, file, cb) {
    // Creates a unique filename: e.g., image-1684321098.jpg
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 5. Security Check: Only allow specific image formats
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/; // WEBP is great for fast loading
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.'));
  }
}

// 6. Initialize Multer
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limits file size to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});