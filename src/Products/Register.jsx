import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    const usernameRegex = /^[a-zA-Z0-9_. ]+$/;
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
        image: formData.image || null,
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

      toast.success("You're registered successfully! Please login.");

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
        toast.error(error.response.data.message || "Registration failed. Try again.");
      } else {
        toast.error("Network error: " + error.message);
      }
    }
  }
};
  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc] flex flex-col">
<ToastContainer position="top-right" theme="colored" autoClose={2000} />
    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
      <h2 className="text-center text-2xl font-bold text-white tracking-wide">
        Register Here
      </h2>
    </div>

    {/* FORM */}
    <div className="flex flex-1 justify-center items-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* TOP */}
        <div className="bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] py-3">
          <h3 className="text-center text-lg font-semibold text-[#f3c894]">
            Create Account
          </h3>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* USERNAME */}
          <div>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#a86a2b]
                ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            <p className={`text-sm mt-1 ${errors.username ? "text-red-500" : "text-green-600"}`}>
              {errors.username ? errors.username : formData.username && "Looks good"}
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#a86a2b]
                ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            <p className={`text-sm mt-1 ${errors.email ? "text-red-500" : "text-green-600"}`}>
              {errors.email ? errors.email : formData.email && "Looks good"}
            </p>
          </div>

          {/* IMAGE */}
          <div>
            <input
              type="file"
              onChange={updateImage}
              className="w-full border rounded-md px-3 py-2 bg-white"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#a86a2b]
                ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <p className={`text-sm mt-1 ${errors.password ? "text-red-500" : "text-green-600"}`}>
              {errors.password ? errors.password : formData.password && "Looks good"}
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <input
              type="password"
              id="c_password"
              placeholder="Confirm Password"
              value={formData.c_password}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#a86a2b]
                ${errors.c_password ? "border-red-500" : "border-gray-300"}`}
            />
            <p className={`text-sm mt-1 ${errors.c_password ? "text-red-500" : "text-green-600"}`}>
              {errors.c_password ? errors.c_password : formData.c_password && "Looks good"}
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] text-[#f3c894] py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Register
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>

        </form>

      </div>

    </div>

  </div>
);
}

export default Register;
