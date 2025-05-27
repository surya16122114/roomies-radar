import React from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, TextField } from '@mui/material';

const amenityOptions = [
  'In-unit laundry',
  'Unfurnished',
  'Furnished',
  'Furnish Optional',
  'Private bath',
  'Free Wifi',
  'Large closet',
  'Balcony',
  'Doorman',
  'Free parking',
  'Paid parking',
  'Outdoor space',
  'Handicap accessible',
  'Security system',
];

interface PostPreferencesFormProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const PostPreferencesForm: React.FC<PostPreferencesFormProps> = ({ formData, handleInputChange }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 3, color: '#6c757d' }}>
        Amenities & Preferences
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
        {amenityOptions.map((amenity) => (
          <Button
            key={amenity}
            variant={formData.amenities.includes(amenity) ? 'contained' : 'outlined'}
            onClick={() =>
              handleInputChange(
                'amenities',
                formData.amenities.includes(amenity)
                  ? formData.amenities.filter((a: string) => a !== amenity)
                  : [...formData.amenities, amenity]
              )
            }
            sx={{
              textTransform: 'none',
              color: formData.amenities.includes(amenity) ? '#fff' : '#495057',
              backgroundColor: formData.amenities.includes(amenity) ? '#5C5470' : '#f8f9fa',
              borderRadius: '5rem',
              borderColor: '#686D76'
            }}
          >
            {amenity}
          </Button>
        ))}
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Food Preferences</InputLabel>
        <Select
          value={formData.preferences.foodPreferences}
          onChange={(e) => handleInputChange('preferences.foodPreferences', e.target.value)}
        >
          <MenuItem value="Veg">Veg</MenuItem>
          <MenuItem value="Non-Veg">Non-Veg</MenuItem>
          <MenuItem value="Any">Any</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Gender Preference</InputLabel>
        <Select
          value={formData.preferences.gender}
          onChange={(e) => handleInputChange('preferences.gender', e.target.value)}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Any">Any</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.preferences.drinking}
            onChange={(e) => handleInputChange('preferences.drinking', e.target.checked)}
          />
        }
        label="Drinking Allowed"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.preferences.smoking}
            onChange={(e) => handleInputChange('preferences.smoking', e.target.checked)}
          />
        }
        label="Smoking Allowed"
      />
      <TextField
        label="Special Requirements"
        value={formData.preferences.specialRequirements}
        onChange={(e) =>
          handleInputChange('preferences.specialRequirements', e.target.value)
        }
        fullWidth
        multiline
        rows={2}
        margin="normal"
      />
    </Box>
  );
};

export default PostPreferencesForm;
