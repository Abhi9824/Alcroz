import React from "react";
import "./navbar.css";
import { Link, useParams } from "react-router-dom";
import { MdAllInclusive } from "react-icons/md";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { IoPersonCircleSharp } from "react-icons/io5";
// import { brandProduct } from '../../features/productSlice';
import { fetchProducts, filterByBrand } from "../../features/productSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosLogIn } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { toast } from "react-toastify";
import { logout } from "../../features/authSlice";
// import { useParams } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isloggedIn } = useSelector((state) => state.authSlice);
  // const { userId } = useParams();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate(`/`);
    toast.success("Logout Successfull");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.length > 0) {
      dispatch(filterByBrand(searchTerm));
      navigate(`/productList/brand/${searchTerm}`);
    } else {
      dispatch(fetchProducts());
      navigate(`/productList`);
    }
  };
  return (
    <header>
      <nav className="navbar navbar-expand-lg navigation  ">
        <div className="container-fluid d-flex justify-content-between align-items-center py-0">
          {/* Brand Section */}
          <div className="brand-icon">
            <Link to="/" className="nav-brand fs-4">
              Alcroz
            </Link>
            <MdAllInclusive
              style={{ width: "25px", height: "30px", padding: "0px" }}
            />
          </div>

          {/* Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: "white" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex flex-wrap justify-content-between w-100">
              {/* Navigation Links */}
              <ul className="nav-pills mb-0 d-flex flex-wrap gap-3 mx-4">
                <li className="nav-item">
                  <Link to="/productList" className="link">
                    All Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/productList/category/Mens" className="link">
                    Mens
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/productList/category/Womens" className="link">
                    Womens
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/productList/category/Unisex" className="link">
                    Unisex
                  </Link>
                </li>
              </ul>

              {/* Search Bar */}
              <div className="search-bar d-flex flex-wrap align-items-center mt-2 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <form
                    onSubmit={handleSearch}
                    className="d-flex align-items-center  gap-2"
                  >
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search by Brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn searchBtn">
                      Search
                    </button>
                  </form>
                </div>

                {/* Wishlist and Cart Icons */}
                <div className="d-flex align-items-center gap-3">
                  <Link
                    to={`/wishlist`}
                    className="btn icon-button"
                    aria-label="Wishlist"
                  >
                    <AiOutlineHeart />
                  </Link>

                  <Link to={`/cart`}>
                    <button className="btn icon-button" aria-label="Cart">
                      <AiOutlineShoppingCart />
                    </button>
                  </Link>

                  {isloggedIn ? (
                    <>
                      <Link to={`/profile`}>
                        <button
                          className="btn icon-button"
                          aria-label="Profile"
                        >
                          <IoPersonCircleSharp />
                        </button>
                      </Link>

                      <button
                        className="btn icon-button d-flex align-items-center"
                        aria-label="Logout"
                        onClick={logoutHandler}
                      >
                        <span className="d-flex align-items-center login_style">
                          Logout
                          <CiLogout className="ms-2" />
                        </span>
                      </button>
                    </>
                  ) : (
                    <Link to={`/login`} className="login_btn">
                      <button
                        className="btn icon-button d-flex align-items-center"
                        aria-label="Login"
                      >
                        <span className="d-flex align-items-center login_style">
                          Login
                          <IoIosLogIn className="ms-2" />
                        </span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
