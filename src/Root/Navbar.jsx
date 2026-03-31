import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice.js";

const API = import.meta.env.VITE_API_URL;

function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { cartCount, setCartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`${API}/api/cart/${user._id}`)
        .then((res) => {
          setCartCount(res.data.items.length);
        })
        .catch((err) => {
          console.log("failed to fetch cartCount", err);
        });
    } else {
      setCartCount(0);
    }
  }, [user, setCartCount]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/register");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-[#030F03] via-[#155715] to-[#204620] text-white px-6 h-[60px] flex items-center justify-between sticky top-0 z-50">

        {/* LEFT */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <NavLink
            to="/"
            className="text-xl font-bold tracking-wider border border-white px-3 py-1 shadow-md hover:scale-105 transition duration-300"
          >
            BRAINSKART
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">

            {[
              { path: "/mens", name: "Men's Wear" },
              { path: "/kids", name: "Kid's Wear" },
              { path: "/womens", name: "Women's Wear" },
              { path: "/upload", name: "Upload" },
              { path: "/history", name: "Order History" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#f3c894]"
                    : "hover:text-[#f3c894] transition"
                }
              >
                {item.name}
              </NavLink>
            ))}

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-[#f3c894]"
                  : "hover:text-[#f3c894]"
              }
            >
              🛒 Cart ({cartCount})
            </NavLink>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            {user && user.isLoggedIn ? (
              <>
                <NavLink to="/profile" className="flex items-center gap-2 hover:text-[#f3c894]">
                  <img
                    src={user.image}
                    alt="User"
                    className="w-8 h-8 rounded-full border border-white"
                  />
                  <span>{user.username}</span>
                </NavLink>

                <button onClick={handleLogout} className="hover:text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-[#f3c894]">
                  Login
                </NavLink>
                <NavLink to="/register" className="hover:text-[#f3c894]">
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* SLIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-[#0f2e0f] text-white z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* CLOSE BUTTON */}
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)} className="text-2xl">
            ✕
          </button>
        </div>

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-6 px-6 text-lg font-medium">

          <NavLink to="/mens" onClick={()=>setMenuOpen(false)}>Men's Wear</NavLink>
          <NavLink to="/kids" onClick={()=>setMenuOpen(false)}>Kid's Wear</NavLink>
          <NavLink to="/womens" onClick={()=>setMenuOpen(false)}>Women's Wear</NavLink>
          <NavLink to="/upload" onClick={()=>setMenuOpen(false)}>Upload</NavLink>
          <NavLink to="/cart" onClick={()=>setMenuOpen(false)}>🛒 Cart ({cartCount})</NavLink>
          <NavLink to="/history" onClick={()=>setMenuOpen(false)}>Order History</NavLink>

          {user && user.isLoggedIn ? (
            <>
              <NavLink to="/profile" onClick={()=>setMenuOpen(false)}>Profile</NavLink>
              <button onClick={() => {handleLogout(); setMenuOpen(false);}} className="text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={()=>setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={()=>setMenuOpen(false)}>Register</NavLink>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default Navbar;