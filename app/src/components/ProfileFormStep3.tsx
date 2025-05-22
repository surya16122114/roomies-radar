import React from 'react';
import { Grid, FormControlLabel, Checkbox, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const HOBBIES_ENUM = [
  "Reading",
  "Writing",
  "Cooking",
  "Traveling",
  "Gardening",
  "Gaming",
  "Photography",
  "Drawing",
  "Playing Musical Instruments",
  "Sports",
  "Others",
];

const FOOD_PREFERENCES = ["Veg", "Non-Veg", "Any"];
const GENDER_PREFERENCES = ["Male", "Female", "Any"];

interface ProfileFormStep3Props {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  error: string;
}

const ProfileFormStep3: React.FC<ProfileFormStep3Props> = ({ profile, setProfile, error }) => {
  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleHobbiesChange = (hobby: string) => {
    const updatedHobbies = profile.hobbies.includes(hobby)
      ? profile.hobbies.filter((h: string) => h !== hobby)
      : [...profile.hobbies, hobby];
    handleChange("hobbies", updatedHobbies);
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
        Set your preferences upfront.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Food Preferences</InputLabel>
          <Select
            value={profile.preferences.foodPreferences}
            onChange={(e) =>
              handleChange('preferences', {
                ...profile.preferences,
                foodPreferences: e.target.value,
              })
            }
          >
            {FOOD_PREFERENCES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Gender Preference</InputLabel>
          <Select
            value={profile.preferences.gender}
            onChange={(e) =>
              handleChange('preferences', {
                ...profile.preferences,
                gender: e.target.value,
              })
            }
          >
            {GENDER_PREFERENCES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.preferences.drinking}
              onChange={(e) =>
                handleChange('preferences', {
                  ...profile.preferences,
                  drinking: e.target.checked,
                })
              }
            />
          }
          label="Comfortable with Drinking "
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.preferences.smoking}
              onChange={(e) =>
                handleChange('preferences', {
                  ...profile.preferences,
                  smoking: e.target.checked,
                })
              }
            />
          }
          label="Smoking-friendly "
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Special Requirements"
          value={profile.preferences.anySpecialRequirements}
          onChange={(e) =>
            handleChange('preferences', {
              ...profile.preferences,
              anySpecialRequirements: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Hobbies
        </Typography>
        {HOBBIES_ENUM.map((hobby) => (
          <FormControlLabel
            key={hobby}
            control={
              <Checkbox
                checked={profile.hobbies.includes(hobby)}
                onChange={() => handleHobbiesChange(hobby)}
              />
            }
            label={hobby}
          />
        ))}
        {profile.hobbies.includes("Others") && (
          <TextField
            fullWidth
            label="Specify Other Hobbies"
            value={profile.otherHobbies || ""}
            onChange={(e) => handleChange("otherHobbies", e.target.value)}
          />
        )}
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ProfileFormStep3;
