// src/redux/Slice/UserSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  DOB: string;
  email: string;
  PhoneNumber: string;
  Gender: string;
  age: string;
  hometown: string;
  course: string;
  college: string;
  primaryLanguage: string;
  otherLanguage: string;
  foodType: string;
  workExperience: string;
  otherHabits: string;
  hobbies: string[];
}

const initialState: UserState = {
  id: '',
  firstName: '',
  lastName: '',
  DOB: '',
  email: '',
  PhoneNumber: '',
  Gender: '',
  age: '',
  hometown: '',
  course: '',
  college: '',
  primaryLanguage: '',
  otherLanguage: '',
  foodType: '',
  workExperience: '',
  otherHabits: '',
  hobbies: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    clearUserDetails(state) {
      return { ...initialState };
    }
  }
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;

export default userSlice.reducer;
