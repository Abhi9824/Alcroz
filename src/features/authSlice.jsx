import axios from "axios";
import { toast } from "react-toastify";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/baseUrl.js";

const backend_api = `${BASE_URL}/user`;

export const loginUser = createAsyncThunk("user/login", async (credentials) => {
  try {
    const response = await axios.post(`${backend_api}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const { data } = response.data;
      localStorage.setItem("token", data.token);
      return data.user;
    }
  } catch (error) {
    toast.error("Login Failed! Wrong Credentials");
    throw error;
  }
});

export const signupUser = createAsyncThunk("user/signup", async (userData) => {
  try {
    const response = await axios.post(`${backend_api}/signUp`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      const { data } = response.data;
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      return data.user;
    }
  } catch (error) {
    toast.error("SignUp Failed");
    throw new Error("Failed to Signup", error);
  }
});

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backend_api}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error("Failed to fetch the Profile Details");
    }
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isloggedIn: !!localStorage.getItem("token") || false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isloggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoggedIn: (state, action) => {
      state.user = action.payload;
      state.isloggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.isloggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(state.error);
      })
      // SignUp User
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.isloggedIn = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export default authSlice.reducer;

export const { logout, setLoggedIn } = authSlice.actions;
