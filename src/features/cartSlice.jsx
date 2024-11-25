import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/baseUrl.js";

const backend_api = `${BASE_URL}/user`;

// Fetch cart products
export const fetchCartProducts = createAsyncThunk(
  "cart/fetchCartProducts",
  async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backend_api}/${userId}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      console.log("fetch cart userId", userId);
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 404) {
        throw new Error("No products found in the cart.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity = 1, selectedSize }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      console.log("userId in Cart adding:", userId);
      console.log("token in Cart adding:", token);

      const response = await axios.post(
        `${backend_api}/${userId}/cart`,
        {
          productId,
          quantity,
          selectedSize,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error("Error adding product to cart.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, product }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }

      console.log("delete uesrID", userId);
      console.log("delete productId", product);

      const response = await axios.delete(
        `${backend_api}/${userId}/cart/${product}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Error removing product from cart.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ userId, _id, quantity, selectedSize }) => {
    console.log("Payload: ", { _id, quantity });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.put(
        `${backend_api}/${userId}/cart/${_id}`,
        {
          quantity,
          selectedSize,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      } else {
        throw new Error("Error updating cart item.");
      }
    } catch (error) {
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartProducts: [],
    cartStatus: "idle",
    cartError: null,
    selectedSize: "",
  },
  reducers: {
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Products
      .addCase(fetchCartProducts.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.cartStatus = "success";
        state.cartProducts = action.payload;
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartStatus = "success";
        const existingProduct = state.cartProducts.find(
          (prod) => prod.productId._id === action.payload.productId._id
        );
        if (existingProduct) {
          existingProduct.quantity += action.payload.quantity;
          existingProduct.selectedSize = action.payload.selectedSize;
        } else {
          state.cartProducts.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartStatus = "success";
        // Remove product from cart by filtering it out
        state.cartProducts = state.cartProducts.filter(
          (prod) => prod._id !== action.payload._id
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      })

      // Update Cart Item Quantity
      .addCase(updateCartItem.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cartStatus = "success";

        const updatedProduct = state.cartProducts.find(
          (item) => item._id === action.payload._id
        );
        if (updatedProduct) {
          updatedProduct.quantity = action.payload.quantity;
          updatedProduct.selectedSize = action.payload.selectedSize;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.cartError = action.error.message;
      });
  },
});

export const { setSelectedSize } = cartSlice.actions;

export default cartSlice.reducer;
