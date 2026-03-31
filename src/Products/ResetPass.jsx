import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(`/api/auth/reset-password/${token}`, { password });

      toast.success("Password reset successful!");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong";
      toast.error(errMsg);
      console.error("Error:", err.response?.data || err.message);
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
          Reset Password
        </h2>
      </div>

      {/* FORM */}
      <div className="flex flex-1 justify-center items-center p-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* TOP */}
          <div className="bg-gradient-to-r from-[#030f03] via-[#155715] to-[#204620] py-3">
            <h3 className="text-center text-lg font-semibold text-[#f3c894]">
              Create New Password
            </h3>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;