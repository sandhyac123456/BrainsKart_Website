import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { loginSuccess } from "../Redux/authSlice.js";
const API = import.meta.env.VITE_API_URL ;

import axios from "axios";

function Register() {
  let navigate = useNavigate();
    const dispatch = useDispatch();

     

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "",
    password: "",
    c_password: "",
  });

    let updateImage = async (event) => {
    let imageFile = event.target.files[0];
    let base64Image = await convertBase64String(imageFile);
    setFormData({
      ...formData,
      image: base64Image,
    });
  };

  let convertBase64String = (imageFile) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);
      fileReader.addEventListener("load", () => {
        if (fileReader.result) {
          resolve(fileReader.result);
        } else {
          reject("Error Occurred");
        }
      });
    });
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.id]: e.target.value 
    });
  };

  const validate = () => {
    const newErrors = {};

    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Please enter a valid username.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8-16 characters, include upper/lowercase, number, and symbol.";
    }

    if (formData.password !== formData.c_password) {
      newErrors.c_password = "Passwords do not match.";
    }

    return newErrors;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        image: formData.image || "https://via.placeholder.com/150",
      };

      const response = await axios.post(`${API}/api/auth/register`, payload);

      const user = {
        _id: Date.now().toString(), 
        name: formData.username,
        email: formData.email,
        image: payload.image,
        isLoggedIn: true, 
      };

      localStorage.setItem(`user_${user.email}_data`, JSON.stringify(user));
      localStorage.setItem("lastLoggedInUserEmail", user.email);

      alert("You're registered successfully! Please login.");

      setFormData({
        username: "",
        email: "",
        image: "",
        password: "",
        c_password: "",
      });

      navigate("/login");

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Registration failed. Try again.");
      } else {
        alert("Network error: " + error.message);
      }
    }
  }
};





  return (
    <>
      <div className="head">
        <div className="text">
          <i className="fas fa-user-plus"></i>
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            Register Here
          </span>
        </div>
      </div>

      <div className="container mt-3 form-wrapper">
        <div className="row" style={{ width: "330px" }}>
          <h3 className="heading">Register</h3>
          <form className="form-box" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="username"
                placeholder="Username"
                className={`form-control ${
                  errors.username
                    ? "is-invalid"
                    : formData.username && "is-valid"
                }`}
                value={formData.username}
                onChange={handleChange}
              />
              <div className={errors.username ? "text-danger" : "text-success"}>
                {errors.username
                  ? errors.username
                  : formData.username && "Looks good"}
              </div>
            </div>

            <div className="form-group mt-1">
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

            <div className="form-group mt-1">
                <div className="custom-file">
                  <input
                    type="file"
                    name="image"
                    onChange={updateImage}
                    className="custom-file-input form-control"
                    id="inputGroupFile01"
                    
                  />
                </div>
            </div>

            <div className="form-group mt-1">
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
            </div>

            <div className="form-group mt-1">
              <input
                type="password"
                id="c_password"
                placeholder="Confirm Password"
                className={`form-control ${
                  errors.c_password
                    ? "is-invalid"
                    : formData.c_password && "is-valid"
                }`}
                value={formData.c_password}
                onChange={handleChange}
              />
              <div
                className={errors.c_password ? "text-danger" : "text-success"}
              >
                {errors.c_password
                  ? errors.c_password
                  : formData.c_password && "Looks good"}
              </div>
            </div>

            <div className="form-group mt-2">
              <input type="submit" value="Register" className="create-btn1" />
            </div>
            <p
              style={{ marginTop: "0", marginBottom: "0", fontWeight: "bold" }}
            >
              Have an account?{" "}
              <Link
                className="nav-link d-inline text-primary"
                style={{ fontWeight: "bold" }}
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>
          <h4 className="heading" style={{ textAlign: "center" }}>
            {" "}
            <span className="logo1">BRAINSKART</span>
          </h4>
        </div>
      </div>
    </>
  );
}

export default Register;
