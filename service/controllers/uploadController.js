import { uploadToS3 } from '../services/uploadService.js';

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload files to S3 and get URLs
    const fileUrls = await Promise.all(
      req.files.map((file) => uploadToS3(file))
    );

    res.status(200).json({ urls: fileUrls });
  } catch (error) {
    console.error('[Error] uploadFiles:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};
