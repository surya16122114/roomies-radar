import s3 from '../utils/s3.js';

export const uploadToS3 = async (file) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${file.originalname}`, // Generate unique filename
      Body: file.buffer, // File content
      ContentType: file.mimetype, // MIME type
    };

    const data = await s3.upload(params).promise();
    return data.Location; // Return the S3 file URL
  } catch (error) {
    console.error('[Error] uploadToS3:', error);
    throw new Error('Failed to upload file to S3');
  }
};
