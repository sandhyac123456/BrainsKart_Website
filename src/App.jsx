import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./Redux/authSlice.js";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Root/Home";
import Navbar from "./Root/Navbar";
import MensCollection from "./Products/MensCollection";
import KidsCollection from "./Products/KidsCollection";
import WomensCollection from "./Products/WomensCollection";
import Login from "./Products/Login";
import Register from "./Products/Register";
import AllCart from "./Products/AllCart";
import Logout from "./Products/LogOut";
import Profile from "./Products/Profile";
import CreateProduct from "./Products/CreateProduct";
import Item from "./Products/Item";
import { CartProvider } from "./context/CartContext.jsx";
import CheckOut from "./Products/CheckOut.jsx";
import Payment from "./Products/Payment.jsx";
import Success from "./Products/Success.jsx";
import UpdateProduct from "./Products/UpdateProduct.jsx";
import OrderHistory from "./Products/OrderHistory.jsx";
import ForgotPassword from "./Products/ForgotPass.jsx";
import ResetPassword from "./Products/ResetPass.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const lastUserEmail = localStorage.getItem("lastLoggedInUserEmail");
    if (lastUserEmail) {
      const storedUser = localStorage.getItem(`user_${lastUserEmail}_data`);
      if (storedUser) {
        dispatch(loginSuccess(JSON.parse(storedUser)));
      }
    }
  }, [dispatch]);

  const ProtectedRoute = ({ children }) => {
    const lastUserEmail = localStorage.getItem("lastLoggedInUserEmail");
    const user = lastUserEmail
      ? localStorage.getItem(`user_${lastUserEmail}_data`)
      : null;
    return user ? children : <Navigate to="/register" />;
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/mens"
            element={
              <ProtectedRoute>
                <MensCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kids"
            element={
              <ProtectedRoute>
                <KidsCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/womens"
            element={
              <ProtectedRoute>
                <WomensCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route path="/upload/:category" element={<CreateProduct />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <AllCart />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <Item />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckOut />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update/:id"
            element={
              <ProtectedRoute>
                <UpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />{" "}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
