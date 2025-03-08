import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterByBrand } from "../../features/productSlice";
import { addToCart } from "../../features/cartSlice";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./Wishlist.css";
import { toast } from "react-toastify";
import {
  fetchWishlistProducts,
  removeFromWishlist,
} from "../../features/wishlistSlice";
import Loading from "../../components/Loading/Loading";
import EmptyWishlist from "../../components/EmptyWishlist/EmptyWishlist";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brand } = useParams();
  const { user } = useSelector((state) => state.authSlice);
  const { status } = useSelector((state) => state.products);
  const { cartProducts } = useSelector((state) => state.cart);

  const { wishlistProducts } = useSelector((state) => state.wishlist);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = user?._id;

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userId && userToken) {
      dispatch(fetchWishlistProducts(userId));
    } else if (brand) {
      dispatch(filterByBrand(brand));
    } else {
      toast.error("Login to add to cart");
      navigate(`/login`);
    }
  }, [dispatch, brand, user]);

  const removeFromWishlistHandler = (userId, productId) => {
    dispatch(removeFromWishlist({ userId, productId })).then(() => {
      toast.success("Removed from Wishlist", {
        autoClose: 1000,
      });
      dispatch(fetchWishlistProducts(userId));
    });
  };

  // Function to handle Add to Cart click and open modal
  const addToCartHandler = (userId, product) => {
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    setSelectedProduct(product);
    setShowModal(true);
    setSelectedSize(null);
  };

  // Function to handle size selection and dispatch addToCart
  const handleSizeSubmit = (selectedProduct) => {
    if (!selectedSize) {
      toast.warning("Please select a size before adding to the cart.");
      return;
    }
    const existingItem = cartProducts.find(
      (prod) => prod.productId._id.toString() === selectedProduct._id.toString()
    );
    if (existingItem) {
      toast.warning("This item is already in your cart.");
      setShowModal(false);
      return;
    }
    if (selectedProduct) {
      dispatch(
        addToCart({
          userId,
          productId: selectedProduct._id,
          quantity: 1,
          selectedSize,
        })
      );
      dispatch(removeFromWishlist({ userId, productId: selectedProduct._id }));
      setShowModal(false);
      toast.success("Moved to Cart", {
        theme: "dark",
        autoClose: 1000,
      });
    }
  };
  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistProducts(userId));
    }
  }, [dispatch, userId]);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="wishlist-body mb-4 py-2">
        <p className="fs-4 fw-bold">MY WISHLIST ({wishlistProducts.length})</p>
        {status === "loading" && <Loading />}
        {status === "success" && wishlistProducts.length === 0 && (
          <div className="empty-wishlist">
            <EmptyWishlist />
          </div>
        )}
        {status === "success" &&
          wishlistProducts &&
          wishlistProducts?.length > 0 && (
            <div className="wishlist-products">
              <div className="row py-4">
                {wishlistProducts.map((product) => (
                  <div key={product._id} className="col-md-3 mb-4">
                    <div className="wishlist-item card">
                      <Link to={`/productDetails/${product._id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-image card-img-top"
                          onMouseOver={(e) =>
                            (e.currentTarget.src = product.images[1])
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.src = product.images[0])
                          }
                        />
                      </Link>
                      <div className="card-body">
                        <p className="card-text">{product.brand}</p>
                        <h5 className="card-title fw-bold">{product.title}</h5>
                        <p className="card-text">${product.price.toFixed(2)}</p>
                        <button
                          className={`btn btn-danger`}
                          onClick={() =>
                            removeFromWishlistHandler(userId, product._id)
                          }
                        >
                          {"Remove from Wishlist"}
                        </button>
                        <button
                          className="btn btn-dark px-5 py-2 mt-2"
                          onClick={() => addToCartHandler(userId, product)}
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
      <div className="py-2 mt-2">
        <Footer className="py-0" />
      </div>

      {/* Modal for size selection */}
      {showModal && (
        <div id="customModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Select Size</h2>
              <span class="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>
            <div class="modal-body">
              <form>
                <label for="sizeSelect">Choose a Size</label>
                <select
                  id="sizeSelect"
                  class="size-select"
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Select a size</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                </select>
              </form>
            </div>
            <div class="modal-footer">
              <button class="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                class="submit-btn"
                onClick={() => handleSizeSubmit(selectedProduct)}
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
