import React, { useState } from 'react';
import { TextField, Box, Typography, Button } from '@mui/material';
import axios from 'axios';

interface PostRentFormProps {
  formData: {
    rent: string;
    deposit: string;
    availableFrom: string;
    leaseDuration: string;
    description: string;
    photos: string[];
  };
  handleInputChange: (field: string, value: any) => void;
}

const PostRentForm: React.FC<PostRentFormProps> = ({ formData, handleInputChange }) => {
  const [uploading, setUploading] = useState(false); // Track upload state
  const [photos, setPhotos] = useState<string[]>(formData.photos || []); // URLs of uploaded photos
  const [previewFiles, setPreviewFiles] = useState<string[]>([]); // Local preview URLs

  const handleOpenFilePicker = async () => {
    if (!('showOpenFilePicker' in window)) {
      alert('Your browser does not support the File System Access API.');
      return;
    }

    try {
      // Prevent uploading more than 5 photos
      if (photos.length >= 5) {
        alert('You can upload a maximum of 5 photos.');
        return;
      }

      // Use the File System Access API to open the file picker
      const fileHandles = await (window as any).showOpenFilePicker({
        multiple: true,
        types: [
          {
            description: 'Images',
            accept: {
              'image/*': ['.png', '.jpg', '.jpeg'],
            },
          },
        ],
      });

      // Convert file handles to File objects
      const files = await Promise.all(
        fileHandles.map(async (handle: FileSystemFileHandle) => await handle.getFile())
      );

      // Check if adding these files exceeds the 5-photo limit
      if (photos.length + files.length > 5) {
        alert('Adding these photos exceeds the maximum limit of 5 photos.');
        return;
      }

      // Generate local preview URLs
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewFiles((prev) => [...prev, ...previewUrls]);

      // Upload the files
      await uploadFiles(files);
    } catch (error) {
      console.error('File picker error:', error);
      alert('Failed to open file picker. Please try again.');
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    const formData = new FormData();

    for (const file of files) {
      formData.append('photos', file);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedPhotos = response.data.urls;
      const updatedPhotos = [...photos, ...uploadedPhotos];

      setPhotos(updatedPhotos);
      handleInputChange('photos', updatedPhotos); // Update form data with new URLs
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    handleInputChange('photos', updatedPhotos); // Update form data

    // Optionally remove the corresponding preview if applicable
    const updatedPreviews = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(updatedPreviews);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 3, color: '#6c757d' }}>
        Rent, Description & Photos
      </Typography>
      <TextField
        label="Rent ($)"
        type="number"
        value={formData.rent || ''}
        onChange={(e) => handleInputChange('rent', e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Deposit ($)"
        type="number"
        value={formData.deposit || ''}
        onChange={(e) => handleInputChange('deposit', e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Available From"
        type="date"
        value={formData.availableFrom || ''}
        onChange={(e) => handleInputChange('availableFrom', e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Lease Duration (months)"
        type="number"
        value={formData.leaseDuration || ''}
        onChange={(e) => handleInputChange('leaseDuration', e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={formData.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Upload Photos (Maximum: 5)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenFilePicker}
          disabled={uploading}
          sx={{backgroundColor: "#5C5470"}}
        >
          Open File Picker
        </Button>

        {uploading && <Typography sx={{ marginTop: 2 }}>Uploading photos...</Typography>}

        {/* Display uploaded photos as previews if there are photos */}
        {photos.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">Uploaded Photos:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {photos.map((photo, index) => (
                <Box key={index} sx={{ position: 'relative', width: '120px', height: '120px' }}>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      minWidth: '30px',
                      height: '30px',
                      fontSize: '12px',
                    }}
                    onClick={() => handleRemovePhoto(index)}
                  >
                    ✕
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PostRentForm;
