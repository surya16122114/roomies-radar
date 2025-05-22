import React from 'react';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface ProfileFormStep1Props {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileFormStep1: React.FC<ProfileFormStep1Props> = ({ profile, setProfile }) => {
  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Share a glimpse of your personality and lifestyle."
          value={profile.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={profile.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={profile.age}
          onChange={(e) => handleChange('age', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="City"
          value={profile.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Course"
          value={profile.course}
          onChange={(e) => handleChange('course', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="College"
          value={profile.college}
          onChange={(e) => handleChange('college', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Primary Language"
          value={profile.primaryLanguage}
          onChange={(e) => handleChange('primaryLanguage', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Other Languages"
          value={profile.otherLanguage}
          onChange={(e) => handleChange('otherLanguage', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Food Type</InputLabel>
          <Select
            value={profile.foodType}
            onChange={(e) => handleChange('foodType', e.target.value)}
          >
            <MenuItem value="Veg">Veg</MenuItem>
            <MenuItem value="Non-Veg">Non-Veg</MenuItem>
            <MenuItem value="Any">Any</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ProfileFormStep1;
