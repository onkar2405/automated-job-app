import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "../types/application";

// TODO: change date from string to Date type
const initialState = {
  applications: [],
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    addApplication: (state: any, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
    },
    setInitialApplications: (state: any, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.applications = action.payload;
    },
  },
});

export const { addApplication, setInitialApplications } =
  applicationSlice.actions;
export default applicationSlice.reducer;
