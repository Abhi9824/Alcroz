import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/productSlice";
import Navbar from "../../components/Navbar/Navbar";
import Filter from "../../components/SidebarFilter/Filter";
import "./product.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  genderCategoryProducts,
  brandProduct,
  filterByBrand,
} from "../../features/productSlice";
import { FaStar } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
import { useState } from "react";

const ProductList = () => {
  const dispatch = useDispatch();
  const { categoryGender, brand } = useParams();
  const { products, status, error, filteredProducts, filterByBrand } =
    useSelector((state) => state.products);

  const [productCount, setProductCount] = useState(0);

  // ProductList.js
  useEffect(() => {
    if (categoryGender) {
      dispatch(genderCategoryProducts(categoryGender));
    } else if (brand) {
      dispatch(filterByBrand(brand));
    } else if (products.length === 0 && !categoryGender && !brand) {
      dispatch(fetchProducts());
    }
  }, [categoryGender, dispatch, brand]);

  useEffect(() => {
    // Update product count based on filtered products or all products
    if (filteredProducts && filteredProducts.length > 0) {
      setProductCount(filteredProducts.length);
    } else if (products && products.length > 0) {
      setProductCount(products.length);
    }
  }, [filteredProducts, products]);

  return (
    <>
      <div className="topDiv">
        <Navbar />
        <div className="row py-2">
          <div className="col-md-3">
            <Filter />
          </div>
          <div className="col-md-9 px-2">
            {status === "loading" && <Loading />}
            {error && <p>{error.message}</p>}

            {/* Display the product count */}
            <p className="fs-5">
              <b>Showing All Products</b>{" "}
              <span className="fs-6"> (Showing {productCount} products)</span>
            </p>

            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="row mb-5 p-0">
                {filteredProducts.map((prod) => (
                  <div className="col-md-4" key={prod._id}>
                    <div className="product-card">
                      <Link
                        to={`/productDetails/${prod._id}`}
                        className="linkDecoration"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="product-image"
                          onMouseOver={(e) =>
                            (e.currentTarget.src = prod.images[1])
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.src = prod.images[0])
                          }
                        />
                      </Link>
                      <div className="card-body cardBody d-flex align-items-center">
                        <h5 className="card-title">{prod.brand}</h5>
                        <p className="card-text fw-bold productTitle">
                          {prod.title}
                        </p>
                        <p className="card-text fs-5 fw-bold">₹ {prod.price}</p>
                        <p
                          className="card-text"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {prod.rating}
                          <FaStar
                            style={{ marginLeft: "4px", color: "#FFD700" }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 pt-5">
        <Footer />
      </div>
    </>
  );
};

export default ProductList;
