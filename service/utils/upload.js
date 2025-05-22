import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory before uploading to S3
});

export const uploadPhotos = upload.array('photos', 5); // Limit to 5 files
