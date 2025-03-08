import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUserProfile } from "../../features/authSlice";
import Loading from "../Loading/Loading";

const Protected = ({ children }) => {
  const { isloggedIn, status } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && !isloggedIn) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isloggedIn, token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (status === "loading") {
    return <Loading />;
  }

  return children;
};

export default Protected;
