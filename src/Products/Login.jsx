import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/authSlice";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_]).{8,16}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8-16 characters, include upper/lowercase, number, and symbol.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.post(`${API}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const user = res.data.user;
        localStorage.setItem(`user_${user.email}_data`, JSON.stringify(user));

        localStorage.setItem("lastLoggedInUserEmail", user.email);

        dispatch(loginSuccess(user));

        console.log("User logged in:", user);

        alert("You're logged in successfully!");
        navigate("/");
      } catch (error) {
        console.error("Login Error:", error);
        alert(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    }
  };

  return (
    <>
      <div className="head">
        <div className="text">
          <i className="fas fa-sign-in-alt"></i>
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            Login Here
          </span>
        </div>
      </div>

      <div className="container mt-3 form-wrapper">
        <div className="row" style={{ width: "330px" }}>
          <h3 className="heading">Login</h3>
          <form className="form-box" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Email"
                className={`form-control ${
                  errors.email ? "is-invalid" : formData.email && "is-valid"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              <div className={errors.email ? "text-danger" : "text-success"}>
                {errors.email ? errors.email : formData.email && "Looks good"}
              </div>
            </div>

            <div className="form-group mt-3">
              <input
                type="password"
                id="password"
                placeholder="Password"
                className={`form-control ${
                  errors.password
                    ? "is-invalid"
                    : formData.password && "is-valid"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              <div className={errors.password ? "text-danger" : "text-success"}>
                {errors.password
                  ? errors.password
                  : formData.password && "Looks good"}
              </div>
              <div style={{ marginTop: "8px", textAlign: "right" }}>
                <Link
                  to="/forgot-password"
                  className="text-primary"
                  style={{ fontSize: "14px" }}
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="form-group mt-3">
              <input type="submit" value="LOGIN" className="create-btn1" />
            </div>

            <p
              style={{
                marginTop: "15px",
                marginBottom: "0",
                fontWeight: "bold",
              }}
            >
              New To Brains Kart?{" "}
              <Link
                className="nav-link d-inline text-primary"
                style={{ fontWeight: "bold" }}
                to="/register"
              >
                Register
              </Link>
            </p>
          </form>

          <h4 className="heading" style={{ textAlign: "center" }}>
            <span className="logo1">BRAINSKART</span>
          </h4>
        </div>
      </div>
    </>
  );
}

export default Login;
