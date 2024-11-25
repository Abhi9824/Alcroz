import React, { useEffect, useState } from "react";
import "./checkout.css";
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import AddressForm from "../AddressForm/AddressForm";
import { deleteAddress, fetchAllAddress } from "../../features/addressSlice";
import { fetchCartProducts } from "../../features/cartSlice";
import { addAddress } from "../../features/addressSlice";
import { toast } from "react-toastify";

const Checkout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartProducts, cartError, cartStatus } = useSelector(
    (state) => state.cart
  );
  const { addresses, error, status, addressAdded } = useSelector(
    (state) => state.address
  );
  const { user } = useSelector((state) => state.authSlice);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAddress(userId));
      dispatch(fetchCartProducts(userId));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (addressAdded) {
      dispatch(fetchAllAddress(userId));
    }
  }, [addressAdded, dispatch, userId]);

  const removeHandler = (addressId) => {
    if (userId) {
      console.log("userId Dele:", userId);
      console.log("addresssId Dele:", addressId);

      dispatch(deleteAddress({ userId, addressId }))
        .then(() => dispatch(fetchAllAddress(userId)))
        .catch((error) => console.error("Failed to delete address:", error));
    } else {
      console.error("userId is not available");
    }
  };
  const addHandler = (addressData) => {
    if (userId) {
      setShowForm(true);
      dispatch(addAddress({ userId, addressData }))
        .unwrap()
        .then(() => {
          dispatch(fetchAllAddress(userId));
          toast.success("Address added successfully");
        })
        .catch((error) => console.error("Failed to add address:", error));
    }
  };

  const editHandler = (userId, address) => {
    setEditAddress(address); 
    setShowForm(true); 
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
    <div className="container">
      <div>
        <Navbar />
      </div>
      <div className="row py-4">
        <div className="col-md-6">
          <div className="d-flex justify-content-between">
            <h5>Select Delivery Address</h5>
            <button
              className="addAdrres"
              onClick={() => {
                setEditAddress(null);
                setShowForm(true);
              }}
            >
              ADD NEW ADDRESS
            </button>
          </div>
          <p className="fontSize">DEFAULT ADDRESS</p>
          <div className="address-container">
            {addresses?.map((address) => (
              <div
                key={address._id}
                className="address-card card mb-2 py-4 mt-4"
              >
                <div className="card-body d-flex align-items-start">
                  {/* Added radio button for selecting address */}
                  <div>
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address._id}
                      checked={selectedAddress === address._id}
                      onChange={() => setSelectedAddress(address._id)}
                      className="me-2"
                    />
                  </div>
                  <div className="px-2">
                    <h6>{address.address?.locality}</h6>
                    <p>
                      {address.address?.street}
                      <br />
                      {address.address?.city}, {address.address?.state} -{" "}
                      {address.address?.pinCode}
                    </p>
                    <p>
                      Mobile: <b>{address.contact?.phoneNumber}</b>
                    </p>
                    <div className="d-flex">
                      <button
                        className="btn edit rounded"
                        onClick={() => editHandler(userId, address)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn remove rounded"
                        onClick={() => removeHandler(address._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4 ms-4 ">
          <div className="card priceCard px-3 d-flex">
            <h5 className="fw-bold">ORDER SUMMARY</h5>
            <hr className="mt-0" />
            <p>
              Price({cartProducts.length} Item):{" "}
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
              <button className="btn placeOrder mt-2 w-100 py-2">
                Place Order{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowForm(false)}>
              &times;
            </span>
            <AddressForm
              setShowForm={setShowForm}
              existingAddress={editAddress}
              onSubmit={addHandler}
              userId={user?._id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
