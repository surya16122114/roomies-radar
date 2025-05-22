import React from 'react';
import { Grid, TextField } from '@mui/material';

interface ProfileFormStep2Props {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileFormStep2: React.FC<ProfileFormStep2Props> = ({ profile, setProfile }) => {
  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Company Name"
          value={profile.workExperience.companyName}
          onChange={(e) =>
            handleChange('workExperience', {
              ...profile.workExperience,
              companyName: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Role"
          value={profile.workExperience.role}
          onChange={(e) =>
            handleChange('workExperience', {
              ...profile.workExperience,
              role: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Tenure"
          value={profile.workExperience.tenure}
          onChange={(e) =>
            handleChange('workExperience', {
              ...profile.workExperience,
              tenure: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="School"
          value={profile.education.school}
          onChange={(e) =>
            handleChange('education', {
              ...profile.education,
              school: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Degree"
          value={profile.education.degree}
          onChange={(e) =>
            handleChange('education', {
              ...profile.education,
              degree: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Field of Study"
          value={profile.education.fieldOfStudy}
          onChange={(e) =>
            handleChange('education', {
              ...profile.education,
              fieldOfStudy: e.target.value,
            })
          }
        />
      </Grid>
    </Grid>
  );
};

export default ProfileFormStep2;
