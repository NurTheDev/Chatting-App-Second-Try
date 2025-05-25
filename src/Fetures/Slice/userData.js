import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "userData",
  initialState: {
    value: {},
  },
  reducers: {},
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
