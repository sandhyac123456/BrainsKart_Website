import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL ;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage(res.data.message); 
      console.log(res.data.message);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Something went wrong";
      setError(errMsg);
      console.log("error",err)
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="row" style={{ width: "500px" }}>
        <h4 className="heading1">Forgot Password</h4>
        <form className="dot1" onSubmit={handleSubmit}>
          <div className="form-group mt-3">
            <label style={{ fontWeight: "bold" }} htmlFor="email">
              Enter your email address:
            </label>
            <input
              type="email"
              className="form-control mt-3"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary mt-3">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <p className="mt-3" style={{ fontWeight: "bold" }}>
        Back to <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
