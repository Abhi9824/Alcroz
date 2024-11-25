import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  fetchAllAddress,
  updateAddress,
} from "../../features/addressSlice";

const AddressForm = ({ setShowForm, existingAddress, userId }) => {
  const dispatch = useDispatch();

  const initialFormData = {
    contact: { name: "", phoneNumber: "" },
    address: { pinCode: "", street: "", locality: "", city: "", state: "" },
  };

  const [formData, setFormData] = useState(existingAddress || initialFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [err, setError] = useState("");

  useEffect(() => {
    // Set formData only if existingAddress is defined and has the expected structure
    if (existingAddress && existingAddress.contact && existingAddress.address) {
      console.log(existingAddress);
      setFormData({
        contact: {
          name: existingAddress.contact?.name || "",
          phoneNumber: existingAddress.contact?.phoneNumber || "",
        },
        address: {
          pinCode: existingAddress.address?.pinCode || "",
          street: existingAddress.address?.street || "",
          locality: existingAddress.address?.locality || "",
          city: existingAddress.address?.city || "",
          state: existingAddress.address?.state || "",
        },
      });
    }
  }, [existingAddress, fetchAllAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  console.log("existing address", existingAddress);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.contact.name ||
      !formData.contact.phoneNumber ||
      !formData.address.pinCode ||
      !formData.address.locality ||
      !formData.address.street ||
      !formData.address.state ||
      !formData.address.city
    ) {
      setError("All field are required.");
      return;
    }
    setError("");

    const addressData = {
      contact: {
        name: formData.contact.name,
        phoneNumber: formData.contact.phoneNumber,
      },
      address: {
        pinCode: formData.address.pinCode,
        locality: formData.address.locality,
        street: formData.address.street,
        state: formData.address.state,
        city: formData.address.city,
      },
    };

    if (existingAddress) {
      dispatch(
        updateAddress({
          userId,
          _id: existingAddress._id,
          dataToUpdate: addressData,
        })
      ).then(() => {
        setSuccessMessage("Address Updated Successfully");
        dispatch(fetchAllAddress(userId));
      });
    } else {
      dispatch(addAddress({ userId, addressData })).then(() => {
        dispatch(fetchAllAddress(userId));
      });

      setSuccessMessage("Address Added Successfully");
    }

    setFormData({
      contact: { name: "", phoneNumber: "" },
      address: { pinCode: "", street: "", locality: "", city: "", state: "" },
    });
    setTimeout(() => {
      setSuccessMessage("");
      setShowForm(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Name</label>
        <input
          type="text"
          name="contact.name"
          value={formData?.contact?.name || ""}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Phone Number</label>
        <input
          type="text"
          name="contact.phoneNumber"
          value={formData?.contact?.phoneNumber || ""}
          onChange={handleChange}
          required
          pattern="^(?:7|8|9)\d{9}$"
          title="Please provide a valid 10-digit Indian phone number"
          className="form-control"
        />
      </div>
      {/* Address Fields */}
      <div className="mb-3">
        <label>Pin Code</label>
        <input
          type="text"
          name="address.pinCode"
          value={formData?.address?.pinCode || ""}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Street</label>
        <input
          type="text"
          name="address.street"
          value={formData?.address?.street || ""}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Locality</label>
        <input
          type="text"
          name="address.locality"
          value={formData?.address?.locality || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>City</label>
        <input
          type="text"
          name="address.city"
          value={formData?.address?.city || ""}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>State</label>
        <input
          type="text"
          name="address.state"
          value={formData?.address?.state || ""}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        {existingAddress ? "Update Address" : "Add Address"}
      </button>
      {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
    </form>
  );
};

export default AddressForm;
