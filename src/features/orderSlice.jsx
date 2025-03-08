import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/baseUrl.js";
import { toast } from "react-toastify";

const backend_api = `${BASE_URL}/user`;

// Fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backend_api}/getOrders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 200) {
        return response.data.orders;
      } else if (response.status === 404) {
        throw new Error("No orders found.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Place order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ deliveryAddress }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.post(
        `${backend_api}/placeOrder`,
        { deliveryAddress },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 201) {
        return response.data.newOrder;
      } else {
        throw new Error("Error placing order.");
      }
    } catch (error) {
      throw error;
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }
      const response = await axios.delete(
        `${backend_api}/deleteOrder/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        return orderId;
      } else {
        throw new Error("Error deleting order.");
      }
    } catch (error) {
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    orderStatus: "idle",
    orderError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orderStatus = "success";
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.error.message;
      })

      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderStatus = "success";
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.error.message;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orderStatus = "success";
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        toast.success("Order Removed");
      })

      .addCase(deleteOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.error.message;
      });
  },
});

export default orderSlice.reducer;
