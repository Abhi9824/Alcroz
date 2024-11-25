import React from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./EmptyCart.css";

const EmptyCart = () => {
  return (
    <div className="empty-cart-container">
      <div className="icon-container">
        <BsCartPlusFill className="cart-icon" />
      </div>
      <div className="text-container">
        <h5 className="title">Hey, it feels so light!</h5>
        <p className="subtitle">
          There is nothing in your bag. Let's add some items.
        </p>
        <Link to="/wishlist">
          <button className="btn add-items">ADD ITEMS FROM WISHLIST</button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
