import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

// 2. Configure Cloudinary with your real keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Store incoming files in memory as a Buffer (prevents hanging requests)
const storage = multer.memoryStorage();

// 4. Export the Multer middleware
export const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only standard image formats
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// 5. Helper function to stream Buffer directly to Cloudinary with error handling
export const uploadBufferToCloudinary = (fileBuffer, folder = 'architectural_merchant/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    // End the stream by writing the buffer to it
    uploadStream.end(fileBuffer);
  });
};