import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./ApplicationSlice";
import authReducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    applicationReducer,
    authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
