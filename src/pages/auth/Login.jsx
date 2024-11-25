import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, setLoggedIn } from "../../features/authSlice"; // Assuming you have a loginUser slice for authentication
import { toast } from "react-toastify";
import "./auth.css";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Login = () => {
  const [form, setForm] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Both fields are required!");
      return;
    }

    try {
      const user = await dispatch(loginUser(form)).unwrap();
      toast.success("Login Successful!");
      navigate("/");
      setLoggedIn(user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
      console.error("Login Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="auth__section">
        <div className="auth__container">
          <h2>Login</h2>
          <form className="auth__form flex" onSubmit={handleLogin}>
            <div className="auth__item">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, username: e.target.value }))
                }
                value={form.username || ""}
              />
            </div>
            <div className="auth__item">
              <label className="show__password" htmlFor="password">
                <span>Password</span>
                <div>
                  <label htmlFor="show-password">Show password</label>
                  <input
                    type="checkbox"
                    onChange={togglePasswordVisibility}
                    id="show-password"
                  />
                </div>
              </label>
              <input
                type={passwordType}
                id="password"
                placeholder="Enter your password"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                value={form.password || ""}
              />
            </div>
            <div className="auth__item py-3">
              <button className="submit__btn" type="submit">
                Login
              </button>
            </div>
          </form>

          <p className="auth__alt-link">
            New user ?{" "}
            <Link className="font__accent-color" to="/signup">
              {" "}
              Signup
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
