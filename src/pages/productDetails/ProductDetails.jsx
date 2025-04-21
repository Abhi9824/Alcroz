import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CarouselProducts from "../../components/productCarousels/CarouselProducts";
import Navbar from "../../components/Navbar/Navbar";
import {
  fetchProducts,
  filterByBrand,
  toggleWishlist,
} from "../../features/productSlice";
import { addToCart, setSelectedSize } from "../../features/cartSlice";
import "./productDetails.css";
import { fetchCartProducts } from "../../features/cartSlice";
import RelatedProducts from "./RelatedProducts";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { addToWishlist } from "../../features/wishlistSlice";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const productId = useParams();
  const { brand } = useParams();
  const [showSize, setShowSize] = useState(false);
  const { user } = useSelector((state) => state.authSlice);
  const userId = user?._id;
  const {
    products,
    status,
    error,
    wishlistProducts,
    filterCategory,
    filteredProducts,
  } = useSelector((state) => state.products);
  const { cartProducts, cartStatus, cartError, selectedSize } = useSelector(
    (state) => state.cart
  );
  const productData = filteredProducts?.find(
    (prod) => prod._id === productId.productId
  );

  useEffect(() => {
    if (brand) {
      dispatch(filterByBrand(brand));
    } else {
      dispatch(fetchProducts());
    }
  }, [brand, dispatch]);

  const handleWishlistClick = ({ userId, productId }) => {
    if (!userId) {
      toast.error("User not logged in");
      return;
    } else {
      dispatch(addToWishlist({ userId, productId }));
      toast.success("Added to wishlist", {
        style: {
          backgroundColor: "green",
          autoClose: 2000,
        },
      });
    }
  };

  const handleSizeChange = (event) => {
    dispatch(setSelectedSize(event.target.value));
  };

  const addToCartHandler = ({ userId, productId, selectedSize }) => {
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    if (!selectedSize) {
      toast.warning("Please select a Size", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Check if the product is already in the cart
    const existingItem = cartProducts.find(
      (prod) => prod.productId._id.toString() === productId.toString()
    );
    if (existingItem) {
      toast.info("Product already in Cart");
      return;
    }

    const quantity = 1;
    dispatch(addToCart({ userId, productId, quantity, selectedSize }))
      .unwrap()
      .then(() => dispatch(fetchCartProducts(userId)));
    toast.success("Added to Cart", {
      autoClose: 2000,
      theme: "dark",
    });
  };

  const relatedProducts = productData
    ? products.filter(
        (prod) =>
          prod._id !== productData._id &&
          productData.category.every((cat) => prod.category.includes(cat)) &&
          prod.category.every((cat) => productData.category.includes(cat))
      )
    : [];

  return (
    <>
      <div className="main pb-4">
        <Navbar />
        <div className="row py-2 ">
          {status === "loading" && <Loading />}
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="col-12 col-md-6">
            <CarouselProducts productData={productData} />
          </div>
          {productData && (
            <div className="col-12 col-md-5 mt-2 detailsDiv">
              <div className="d-flex justify-content-between align-items-center">
                <h5>{productData.brand.toUpperCase()}</h5>
                <button
                  className="btn btn-link text-decoration-none"
                  onClick={() => setShowSize(true)}
                >
                  Size Guide
                </button>
              </div>
              <h4 className="fw-bolder">{productData.title}</h4>
              <p>₹ {productData.price.toFixed(2)}</p>
              <p>MRP Inclusive of all taxes</p>
              <p className="description">{productData.description}</p>
              <ul>
                {productData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center wishlistDiv py-2">
                <div className="sizeSelect flex-grow-1 me-2">
                  <select
                    name="size"
                    className="form-select w-100"
                    // defaultValue=""
                    value={selectedSize || ""}
                    onChange={handleSizeChange}
                  >
                    <option value="" disabled>
                      Select Size
                    </option>
                    {productData.size.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="wishlistBtn flex-grow-1 ms-2">
                  <button
                    className={`btn w-100 ${
                      productData.isWishlist ? "btn-danger" : "secondary"
                    }`}
                    onClick={() =>
                      handleWishlistClick({
                        userId,
                        productId: productData._id,
                      })
                    }
                  >
                    {productData.isWishlist
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </button>
                </div>
              </div>

              <div className="py-3 addTobagBtnDiv">
                <button
                  className="addTobagBtn"
                  onClick={() =>
                    addToCartHandler({
                      userId,
                      productId: productData._id,
                      selectedSize,
                    })
                  }
                >
                  Add to Bag
                </button>
              </div>
            </div>
          )}
          {cartStatus === "failed" && cartError && (
            <p className="text-danger text-center">{cartError}</p>
          )}
        </div>
        {/* Related Products Section */}
        <div className="col-md-12 relatedProducts">
          <RelatedProducts relatedProducts={relatedProducts} />
        </div>
      </div>

      {/* modal for size */}
      {showSize && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setShowSize(false)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              &times;
            </span>
            <img
              src="https://png.pngtree.com/png-clipart/20230925/original/pngtree-mens-fashion-shoe-size-chart-in-cm-for-online-clothes-vector-png-image_12772114.png"
              alt="Size Chart"
              className="img-fluid"
            />
          </div>
        </div>
      )}

      <div className="mt-5 pt-5">
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;
