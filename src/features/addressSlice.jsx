import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/baseUrl.js";

const backend_api = `${BASE_URL}/user`;
export const addAddress = createAsyncThunk(
  "addAddress/addresses",
  async ({ userId, addressData }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.post(
        `${backend_api}/${userId}/addresses`,
        addressData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  }
);

export const updateAddress = createAsyncThunk(
  "updateAddress/addresses",
  async ({ userId, _id, dataToUpdate }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.put(
        `${backend_api}/${userId}/addresses/${_id}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }
);
export const deleteAddress = createAsyncThunk(
  "deleteAddress/addresses",
  async ({ userId, addressId }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.delete(
        `${backend_api}/${userId}/addresses/${addressId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
);
export const fetchAllAddress = createAsyncThunk(
  "addresses/fetchAllAddress",
  async (userId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.get(`${backend_api}/${userId}/addresses`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    addressAdded: false,
    error: null,
    status: "idle",
  },
  reducer: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.status = "success";
        state.addresses = action.payload;
      })
      .addCase(fetchAllAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.status = "success";
        const existingAddress = state.addresses.find(
          (address) => address._id === action.payload._id
        );
        if (!existingAddress) {
          state.addresses.push(action.payload.address);
        } else {
          console.error("Already address added.");
        }
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.status = "falied";
        state.error = action.error.message;
      })
      .addCase(updateAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.status = "success";
        const index = state.addresses.findIndex(
          (address) => address._id === action.payload._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.status = "falied";
        state.error = action.error.message;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.status = "success";
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.payload._id
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.status = "falied";
        state.error = action.error.message;
      });
  },
});

export default addressSlice.reducer;
