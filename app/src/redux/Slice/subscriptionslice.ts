import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "inactive",
  activatedAt: null,
  payments: [],
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      const { status, activatedAt, payments } = action.payload;
      state.status = status;
      state.activatedAt = activatedAt;
      state.payments = payments;
    },
    resetSubscription: () => initialState,
  },
});

export const { setSubscription, resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
