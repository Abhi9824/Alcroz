import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To handle redirection if unauthorized

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // If token is not present, redirect to login page
      if (!token) {
        navigate("/login"); // or any other route for login
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await fetch(url, {
          headers: headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, redirect to login
            navigate("/login");
          }
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [url, navigate]);

  return { data, error };
};
