import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/authSlice";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👁️
  const [loading, setLoading] = useState(false); // 🔄
  const [rememberMe, setRememberMe] = useState(false); // 🔐

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
        setLoading(true); // 🔄 start loading

        const res = await axios.post(`${API}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const user = res.data.user;

        // 🔐 remember me logic
        if (rememberMe) {
          localStorage.setItem(`user_${user.email}_data`, JSON.stringify(user));
          localStorage.setItem("lastLoggedInUserEmail", user.email);
        }

        dispatch(loginSuccess(user));

        toast.success("You're logged in successfully!");
          setTimeout(()=>{
        navigate("/");
        },1500)
      } catch (error) {
        console.error("Login Error:", error);
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setLoading(false); // 🔄 stop loading
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc] flex flex-col">
      
      <ToastContainer position="top-right" theme="colored" autoClose={2000} />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
        <h2 className="text-center text-2xl font-bold text-white tracking-wide">
          Login Here
        </h2>
      </div>

      {/* FORM */}
      <div className="flex flex-1 justify-center items-center p-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* TOP */}
          <div className="bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] py-3">
            <h3 className="text-center text-lg font-semibold text-[#f3c894]">
              Welcome Back
            </h3>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

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

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // 👁️ toggle
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#a86a2b]
                  ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />

              {/* 👁️ ICON */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>

              <p className={`text-sm mt-1 ${errors.password ? "text-red-500" : "text-green-600"}`}>
                {errors.password ? errors.password : formData.password && "Looks good"}
              </p>

              <div className="text-right mt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/*  REMEMBER ME */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            </div>

            {/* 🔄 BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] text-[#f3c894] py-2 rounded-lg font-semibold hover:scale-105 transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* REGISTER LINK */}
            <p className="text-center text-sm font-medium">
              New to BrainSkart?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;