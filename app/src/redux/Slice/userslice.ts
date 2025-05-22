// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  DOB: Date | null;
}

const initialState: UserState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  DOB: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUserDetails: (state) => {
      return initialState;
    }
  }
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;

