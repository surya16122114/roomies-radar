import React, { useState } from 'react';
import { Box, Typography, Slider, Chip, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/Slice/postslice';
import { AppDispatch } from '../redux/store';
import '../styles/FilterSection.css';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const roomTypeOptions = ['Private Room', 'Shared Room', 'Private Hall', 'Shared Hall'];
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
const genderOptions = ['Male', 'Female', 'Any'];
const foodPreferencesOptions = ['Veg', 'Non-Veg', 'Any'];

const FilterSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    minPrice: 0,
    maxPrice: 5000,
    roomType: '',
    amenities: [] as string[],
    gender: '',
    foodPreferences: '',
    availableFrom: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const toggleChip = (field: keyof typeof filters, value: string) => {
    if (field === 'amenities') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        amenities: prevFilters.amenities.includes(value)
          ? prevFilters.amenities.filter((a) => a !== value)
          : [...prevFilters.amenities, value],
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [field]: prevFilters[field] === value ? '' : value,
      }));
    }
  };

  const applyFilters = () => {
    dispatch(
      fetchPosts({
        ...filters,
        page: 1,
        limit: 10,
      })
    );
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      area: '',
      minPrice: 0,
      maxPrice: 5000,
      roomType: '',
      amenities: [],
      gender: '',
      foodPreferences: '',
      availableFrom: '',
    });
  };

  return (
  <div className='FilterSection'>
    <Box sx={{ padding: 3 ,}}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {t('filters')}
      </Typography>
      <Box sx={{ marginBottom: 3 }}>
        <TextField
          label="City"
          value={filters.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Area"
          value={filters.area}
          onChange={(e) => handleInputChange('area', e.target.value)}
          fullWidth
          margin="normal"
        />
      </Box>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Price Range
      </Typography>
      <Slider
        value={[filters.minPrice, filters.maxPrice]}
        onChange={(_, newValue) => {
          const [min, max] = newValue as number[];
          handleInputChange('minPrice', min);
          handleInputChange('maxPrice', max);
        }}
        valueLabelDisplay="auto"
        min={0}
        max={5000}
        step={100}
        sx={{ marginBottom: 3, color: "#5C5470"}}
      />
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
       {t('roomType')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
        {roomTypeOptions.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={filters.roomType === type ? 'primary' : 'default'}
            onClick={() => toggleChip('roomType', type)}
          />
        ))}
      </Box>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        {t('amenities')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
        {amenityOptions.map((amenity) => (
          <Chip
            key={amenity}
            label={amenity}
            clickable
            color={filters.amenities.includes(amenity) ? 'primary' : 'default'}
            onClick={() => toggleChip('amenities', amenity)}
          />
        ))}
      </Box>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        {t('genderPreferences')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
        {genderOptions.map((gender) => (
          <Chip
            key={gender}
            label={gender}
            clickable
            color={filters.gender === gender ? 'primary' : 'default'}
            onClick={() => toggleChip('gender', gender)}
          />
        ))}
      </Box>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
       {t('foodPreferences')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
        {foodPreferencesOptions.map((foodPref) => (
          <Chip
            key={foodPref}
            label={foodPref}
            clickable
            color={filters.foodPreferences === foodPref ? 'primary' : 'default'}
            onClick={() => toggleChip('foodPreferences', foodPref)}
          />
        ))}
      </Box>
      <TextField
        label="Available From"
        type="date"
        value={filters.availableFrom}
        onChange={(e) => handleInputChange('availableFrom', e.target.value)}
        fullWidth
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={applyFilters}
        sx={{ marginTop: 2, backgroundColor: "#5C5470" }}
      >
       {t('applyFilters')}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={resetFilters}
        sx={{ marginTop: 2, color: "#686D76" }}
      >
        {t('resetFilters')}
      </Button>
    </Box>
  </div>
  );
};

export default FilterSection;
