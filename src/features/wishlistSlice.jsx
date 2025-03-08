import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../utils/baseUrl.js";

const backend_api = `${BASE_URL}/user`;

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }

      const response = await axios.post(
        `${backend_api}/${userId}/wishlist`,
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status.ok) {
        return response.data;
      } else {
        throw new Error("Error adding product to wishlist.");
      }
    } catch (error) {
      throw new Error("Failed to add to wishlist");
    }
  }
);

// Fetch wishlist products
export const fetchWishlistProducts = createAsyncThunk(
  "wishlist/fetchWishlistProducts",
  async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backend_api}/${userId}/wishlist`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 404) {
        throw new Error("No products found in the wishlist.");
      }
    } catch (error) {
      throw new Error("Failed to fetch the wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }

      const response = await axios.delete(
        `${backend_api}/${userId}/wishlist/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        return productId;
      } else {
        throw new Error("Error removing product from wishlist.");
      }
    } catch (error) {
      throw new Error("Failed to add to wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    name: "wishlist",
    wishlistProducts: [],
    wishlistStatus: "idle",
    wishlistError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.wishlistStatus = "loading";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = "success";
        const existingProduct = state.wishlistProducts.find(
          (product) => product._id === action.payload._id
        );

        if (!existingProduct) {
          state.wishlistProducts.push(action.payload);
        } else {
          console.warn("Already in the wishlist");
        }
      })

      //fetch all wishlist
      .addCase(fetchWishlistProducts.pending, (state) => {
        state.wishlistStatus = "loading";
      })
      .addCase(fetchWishlistProducts.fulfilled, (state, action) => {
        state.wishlistStatus = "success";
        state.wishlistProducts = action.payload;
      })
      .addCase(fetchWishlistProducts.rejected, (state, action) => {
        state.wishlistStatus = "failed";
        state.wishlistError = action.payload;
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.wishlistStatus = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = "success";
        state.wishlistProducts = state.wishlistProducts.filter(
          (prod) => prod._id !== action.payload
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.wishlistStatus = "failed";
        state.wishlistError = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
