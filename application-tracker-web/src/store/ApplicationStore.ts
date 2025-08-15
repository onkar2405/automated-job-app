import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./ApplicationSlice";

export const store = configureStore({
  reducer: {
    applicationReducer,
  },
});
