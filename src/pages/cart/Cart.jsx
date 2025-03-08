import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartProducts,
  removeFromCart,
  setSelectedSize,
  updateCartItem,
} from "../../features/cartSlice";
import { filterByBrand, toggleWishlist } from "../../features/productSlice";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./cart.css";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import EmptyCart from "../../components/EmptyCart/EmptyCart";
import { addToWishlist } from "../../features/wishlistSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { brand } = useParams();
  const navigate = useNavigate();

  const { cartProducts, cartError, cartStatus, selectedSize } = useSelector(
    (state) => state.cart
  );

  const { user } = useSelector((state) => state.authSlice);
  const { products, error, status } = useSelector((state) => state.products);

  const [size, setSize] = useState(selectedSize);

  const userId = user?._id;
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userId && userToken) {
      dispatch(fetchCartProducts(userId));
    } else if (brand) {
      dispatch(filterByBrand(brand));
    } else {
      toast.error("Login to add to cart");
      navigate(`/login`);
    }
  }, [brand, user]);

  const handleIncreaseQuantity = (product) => {
    const newQuantity = product.quantity + 1;
    const currentSize = product.selectedSize || size;
    dispatch(
      updateCartItem({
        userId,
        _id: product._id,
        quantity: newQuantity,
        selectedSize: currentSize,
      })
    );
  };

  const handleDecreaseQuantity = (product) => {
    if (product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      const currentSize = product.selectedSize || size;
      dispatch(
        updateCartItem({
          userId,
          _id: product._id,
          quantity: newQuantity,
          selectedSize: currentSize,
        })
      );
    }
  };

  const handleSizeChange = (productId, newSize) => {
    const product = cartProducts.find(
      (cart) => cart.productId._id === productId
    );
    if (product) {
      setSize(newSize);
      dispatch(
        updateCartItem({
          userId,
          _id: product._id,
          quantity: product.quantity,
          selectedSize: newSize,
        })
      );
    }
  };

  const handleRemoveItem = (userId, product) => {
    dispatch(removeFromCart({ userId, product })).then(() => {
      dispatch(fetchCartProducts(userId));
      toast.error("Remove from Cart");
    });
  };

  const handleWishlistClick = (userId, product) => {
    try {
      const productId = product.productId._id;
      // Add to wishlist
      dispatch(addToWishlist({ userId, productId }))
        .then(() => {
          return dispatch(removeFromCart({ userId, product: productId }));
        })
        .then(() => {
          // Fetch updated cart products
          dispatch(fetchCartProducts(userId));
          // Show success message
          toast.success("Added to Wishlist", {
            style: { backgroundColor: "green" },
            autoClose: 2000,
          });
        })
        .catch((error) => {
          console.error("Failed to move to wishlist:", error);
          toast.error("Error moving item to Wishlist");
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error moving item to Wishlist");
    }
  };

  // Calculate subtotal, discount, tax, and grand total
  const subtotal = cartProducts?.length
    ? cartProducts?.reduce(
        (acc, product) => acc + product.productId.price * product.quantity,
        0
      )
    : 0;
  const discount = subtotal > 30000 ? 0.1 * subtotal : 0;
  const tax = 0.05 * (subtotal - discount);
  const shipping = subtotal > 50000 ? 0 : 100;
  const grandTotal = subtotal - discount + tax + shipping;

  return (
    <>
      <div>
        <Navbar />
        <div className="container mt-5 mb-5 py-3 ">
          <div className="d-flex justify-content-between align-items-center py-2">
            <h3 className="fw-bolder heading">
              SHOPPING CART ({cartProducts.length})
            </h3>
            <Link to="/order-details">
              <button className="btn order-details mt-3">
                View Order Details
              </button>
            </Link>
          </div>

          {cartStatus === "loading" && (
            <div className="py-4">
              <Loading />
            </div>
          )}

          {cartProducts?.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="row  mb-4">
              {/* Left Column - Cart Products */}
              <div className="col-md-7">
                {cartProducts.map((product) => (
                  <div className="card cart-card mb-4 p-3" key={product._id}>
                    <div className="row-card g-0">
                      <div className="col-md-4">
                        <Link to={`/productDetails/${product.productId._id}`}>
                          <img
                            src={
                              product.productId.images?.[0] ||
                              product.productId.title
                            }
                            alt={product.productId.title || "loading title"}
                            className="img-fluid"
                            style={{ objectFit: "cover", height: "100%" }}
                          />
                        </Link>
                      </div>

                      <div className="col-md-4 mx-3">
                        <div className="card-body d-flex flex-column align-items-start">
                          <h5 className="card-title fw-bold">
                            {product.productId.title}
                          </h5>
                          <p className="card-text">
                            Price: ${product.productId.price.toFixed(2)}
                          </p>
                          <p className="mb-1">
                            Size:
                            <select
                              className="form-select form-select-sm d-inline w-auto ms-2"
                              onChange={(e) =>
                                handleSizeChange(
                                  product.productId._id,
                                  e.target.value
                                )
                              }
                              value={product.selectedSize}
                            >
                              {product.productId.size.map((size, index) => (
                                <option key={index} value={size}>
                                  {size} UK
                                </option>
                              ))}
                            </select>
                          </p>

                          <p className="mb-2 py-2">
                            Quantity:
                            <button
                              className="btn btn-light btn-sm mx-2"
                              disabled={product.quantity < 1}
                              onClick={() => handleDecreaseQuantity(product)}
                            >
                              -
                            </button>
                            <span>{product.quantity}</span>
                            <button
                              className="btn btn-light btn-sm mx-2"
                              onClick={() => handleIncreaseQuantity(product)}
                            >
                              +
                            </button>
                          </p>
                          <button
                            className="btn btn-danger btn-sm mt-2"
                            onClick={() =>
                              handleRemoveItem(userId, product.productId._id)
                            }
                          >
                            Remove From Cart
                          </button>

                          <button
                            className="btn danger btn-sm mt-2"
                            onClick={() => handleWishlistClick(userId, product)}
                          >
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Price Details */}
              <div className="col-md-4">
                <div className="card priceCard px-3 d-flex">
                  <h5 className="fw-bold">PRICE DETAILS</h5>
                  <hr className="mt-0" />
                  <p>
                    Price ({cartProducts.length} Item):{" "}
                    <span className="float-end">${subtotal.toFixed(2)}</span>
                  </p>
                  <p>
                    Discount:{" "}
                    <span className="float-end">${discount.toFixed(2)}</span>
                  </p>
                  <p>
                    Tax: <span className="float-end">${tax.toFixed(2)}</span>
                  </p>
                  <p>
                    Shipping Charges:{" "}
                    <span className="float-end">${shipping.toFixed(2)}</span>
                  </p>
                  <hr />
                  <h5 className="fw-bold">
                    Grand Total:{" "}
                    <span className="float-end">${grandTotal.toFixed(2)}</span>
                  </h5>
                  <hr />
                  <p>You will save ${discount.toFixed(0)} on this order.</p>
                  <Link to={`/checkout`}>
                    <button className="btn checkoutBtn mt-3 w-100">
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4">
        <Footer />
      </div>
    </>
  );
};

export default Cart;
