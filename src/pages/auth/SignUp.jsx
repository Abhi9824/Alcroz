import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupUser } from "../../features/authSlice";
import { toast } from "react-toastify";
import "./auth.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const SignUp = () => {
  const [form, setForm] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.username || !form.password) {
      toast.error("All fields are required!");
      return;
    }

    console.log("name", form.name);
    console.log("email", form.email);
    console.log("username", form.username);
    console.log("password", form.password);

    const resultAction = await dispatch(signupUser(form));
    if (resultAction.type === signupUser.fulfilled.type) {
      toast.success("Signup Successful!");
      navigate("/login");
    } else {
      toast.error("Signup Failed!");
    }
  };

  return (
    <>
      <Navbar />

      <section className="auth__section">
        <div className="auth__container">
          <h2>Signup</h2>
          <form className="auth__form flex" onSubmit={handleSignup}>
            <div className="auth__item">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                value={form.name || ""}
              />
            </div>
            <div className="auth__item">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                value={form.email || ""}
              />
            </div>
            <div className="auth__item">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter a unique username"
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
                placeholder="Enter a strong password"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                value={form.password || ""}
              />
            </div>
            <div className="auth__item py-3">
              <button className="submit__btn" type="submit">
                Signup
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SignUp;
