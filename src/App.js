import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import ProductsView from "./pages/products/ProductsView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/products/ProductList";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import AddressForm from "./pages/AddressForm/AddressForm";
import Profile from "./pages/Profile/Profile";
import Protected from "./components/Protected/Protected";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import isloggedIn from "./components/Protected/Protected";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<ProductsView />} />
          <Route path="/productList" element={<ProductList />} />
          <Route
            path="/productList/category/:categoryGender"
            element={<ProductList />}
          />
          <Route
            path="/productDetails/:productId"
            element={<ProductDetails />}
          />
          <Route
            path="/productList/brand/:searchBrand"
            element={<ProductList />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* protected Routes */}
          <Route
            path="/wishlist"
            element={
              <Protected isloggedIn={isloggedIn}>
                <Wishlist />
              </Protected>
            }
          />
          <Route
            path="/cart"
            element={
              <Protected isloggedIn={isloggedIn}>
                <Cart />
              </Protected>
            }
          />
          <Route
            path="/checkout"
            element={
              <Protected isloggedIn={isloggedIn}>
                <Checkout />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected isloggedIn={isloggedIn}>
                <Profile />
              </Protected>
            }
          >
            <Route
              path="address"
              element={
                <Protected isloggedIn={isloggedIn}>
                  <AddressForm />
                </Protected>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
