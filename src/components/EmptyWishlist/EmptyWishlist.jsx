import React from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./emptyWishlist.css";

const EmptyWishlist = () => {
  return (
    <div className="empty-cart-container">
      <div className="text-container">
        <h5 className="title">YOUR WISHLIST IS EMPTY</h5>
        <p className="subtitle">
          Add items that you like to your wishlist. Review them anytime and
          easily move them to the bag.
        </p>
      </div>
      <div className="icon-container">
        <BsCartPlusFill className="cart-icon" />
      </div>
      <Link to="/productList">
        <button className="btn add-items">CONTINUE SHOPPING</button>
      </Link>
    </div>
  );
};

export default EmptyWishlist;
