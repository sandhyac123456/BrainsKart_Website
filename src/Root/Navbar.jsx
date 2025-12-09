import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Root.css";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice.js";
const API = import.meta.env.VITE_API_URL;

function Navbar() {
  let navigate = useNavigate();
  // let [user, setUser] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { cartCount, setCartCount } = useCart();

  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`${API}/api/cart/${user._id}`)
        .then((res) => {
          const count = res.data.items.length;
          setCartCount(count);
          localStorage.setItem("cartCount", count);
        })
        .catch((err) => {
          console.log("failed to fetch cartCount", err);
        });
    } else {
      setCartCount(0);
    }
  }, [user, setCartCount]);

  const handleLogout = () => {
    // localStorage.removeItem("user");
    // localStorage.removeItem("cartCount")
    dispatch(logout());
    // setUser(null);
    // setCartCount(0);
    navigate("/register");
  };
  return (
    <>
      <nav
        className="navbar nav navbar-expand-lg text-light"
        style={{
          background:
            "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
          color: "white",
          padding: "6px 30px",
        }}
      >
        <Link className="navbar-brand heading text-white" to="/">
          <span className="logo">BRAINSKART</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarcontent"
          aria-controls="navbarcontent"
          aria-expanded="false"
          aria-label="toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarcontent">
          <ul className="nav navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/mens">
                Men's Wear
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/kids">
                kid's Wear
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/womens">
                Women's Wear
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/upload">
                Upload
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-cart-fill m-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                </svg>
                Cart
                {cartCount >= 0 && (
                  <span className="cart-count">({cartCount})</span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/history">
                Order_History
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {user && user.isLoggedIn ? (
              <>
                <li className="nav-item d-flex align-items-center me-3">
                  <Link
                    className="d-flex align-items-center text-decoration-none"
                    to="/profile"
                  >
                    <img
                      src={user.image}
                      alt="User"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "8px",
                      }}
                    />
                    <span className="text-white">{user.username}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link text-white"
                    to="/logout"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={handleLogout}
                  >
                    <i className="fa-duotone fa-solid fa-right-from-bracket"></i>
                    LogOut
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    <i className="fas fa-user-plus"></i> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
