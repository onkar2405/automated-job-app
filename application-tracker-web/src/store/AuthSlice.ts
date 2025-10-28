import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

export const fetchAuthState = createAsyncThunk("auth/fetchStatus", async () => {
  const response = await fetch("http://localhost:5000/auth/status", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch login state");
  }

  const data = await response.json();
  if (!data.loggedIn || !data.user) {
    return null;
  }
  return data.user as User;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuthState.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchAuthState.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchAuthState.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
