import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          boxShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',

        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5C5470', // Default border color
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5C5470', // Same border color when focused
          },
        },
        input: {
          '&::placeholder': {
            color: '#5C5470', // Default placeholder color
            opacity: 1,
          },
          '&:focus::placeholder': {
            color: '#5C5470', // Transparent when focused
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#5C5470', // Default label color
        },
        focused: {
          color: '#5C5470', // Label color on focus
        },
        outlined: {
          color: 'grey', // Shrunk label color
        }
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5C5470',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'grey', // Default background color for circles
          '&.Mui-active': {
            color: 'grey', // Background color for active step
          },
          '&.Mui-completed': {
            color: 'grey', // Background color for completed steps
          },
        },
        text: {
          fill: 'white', // Text color inside the circle
        },
      },
    },
  },
});

export default theme;