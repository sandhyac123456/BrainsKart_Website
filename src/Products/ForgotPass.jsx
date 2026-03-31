import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // 🔄 loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/auth/forgot-password`, { email });

      toast.success(res.data.message); // ✅ success toast
    } catch (err) {
      const errMsg = err.response?.data?.error || "Something went wrong";
      toast.error(errMsg); // ❌ error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc] flex flex-col">

      <ToastContainer position="top-right" theme="colored" autoClose={2000} />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
        <h2 className="text-center text-2xl font-bold text-white tracking-wide">
          Forgot Password
        </h2>
      </div>

      {/* FORM */}
      <div className="flex flex-1 justify-center items-center p-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* TOP */}
          <div className="bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] py-3">
            <h3 className="text-center text-lg font-semibold text-[#f3c894]">
              Reset Your Password
            </h3>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Enter your email address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#a86a2b]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] text-[#f3c894] py-2 rounded-lg font-semibold hover:scale-105 transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* BACK */}
            <p className="text-center text-sm font-medium">
              Back to{" "}
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

export default ForgotPassword;