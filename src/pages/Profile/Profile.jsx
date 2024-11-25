import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress } from "../../features/addressSlice";
import { fetchAllAddress } from "../../features/addressSlice";
import AddressForm from "../AddressForm/AddressForm";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { filterByBrand } from "../../features/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../features/authSlice";

const Profile = () => {
  const [showForm, setShowForm] = useState(false);
  const { brand } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.authSlice);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const userId = user?._id;
    if (userToken && userId) {
      dispatch(fetchAllAddress(userId));
    } else if (brand) {
      dispatch(filterByBrand(brand));
    }
  }, [dispatch, brand, user]);

  const addHandler = (addressData) => {
    if (user?._id) {
      setShowForm(true);
      dispatch(addAddress({ userId: user._id, addressData }))
        .unwrap()
        .then(() => dispatch(fetchAllAddress(user._id)))
        .catch((error) => console.error("Failed to add address:", error));
    }
  };

  const deleteAddressHandler = (addressId) => {
    if (user?._id) {
      dispatch(deleteAddress({ userId: user._id, addressId }))
        .then(() => dispatch(fetchAllAddress(user._id)))
        .catch((error) => console.error("Failed to delete address:", error));
    } else {
      console.error("userId is not available");
    }
  };

  const handleLogout = () => {
    logout(user);
    navigate(`/login`);
  };

  return (
    <div className="container">
      <div>
        <Navbar />
      </div>

      <div className="profile__container">
        <h1 className="text__center">Profile</h1>
        <div className="profile__body">
          <p>
            <b>Name:</b> <br /> {user?.name}
          </p>
          <p>
            <b>Username:</b> <br /> {user?.username}
          </p>
          <p>
            {" "}
            <b>Email:</b> <br /> {user?.email}
          </p>
          <p className="address_container">
            <b>Address: </b>
            <button className="add_icon" onClick={() => setShowForm(true)}>
              <FaPlus />
            </button>
          </p>

          {/* Address List */}
          {addresses.length > 0 ? (
            <ul>
              {addresses?.map((address, index) => (
                <li
                  className="address_list d-flex justify-content-between"
                  key={index}
                >
                  <div>
                    {address.address.street}, {address.address.city}, <br />
                    PIN:{address.address.pinCode}, {address.address.state},
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        dispatch(() => deleteAddressHandler(address._id))
                      }
                    >
                      <MdDelete />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No addresses found.</p>
          )}

          {/* Logout Button */}
          <button className="logout-button mt-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowForm(false)}>
              &times;
            </span>
            <AddressForm
              setShowForm={setShowForm}
              onSubmit={addHandler}
              userId={user?._id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
