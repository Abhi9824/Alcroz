import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../features/productSlice";
import cartSlice from "../features/cartSlice";
import addressSlice from "../features/addressSlice";
import authSlice from "../features/authSlice";
import wishlistSlice from "../features/wishlistSlice";
import orderSlice from "../features/orderSlice";

export default configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    address: addressSlice,
    authSlice: authSlice,
    wishlist: wishlistSlice,
    order: orderSlice,
  },
});
