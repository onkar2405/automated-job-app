import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "../types/application";

// TODO: change date from string to Date type
const initialState = {
  applications: [
    {
      id: 1,
      company: "Google",
      role: "Frontend Engineer",
      status: "Applied",
      date: "2025-08-15",
    },
    {
      id: 2,
      company: "Amazon",
      role: "Backend Developer",
      status: "Interview",
      date: "2025-08-15",
    },
  ],
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    addApplication: (state: any, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
    },
  },
});

export const { addApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
