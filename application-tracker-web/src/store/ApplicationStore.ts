import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./ApplicationSlice";
import authReducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    applicationReducer,
    authReducer,
  },
});
