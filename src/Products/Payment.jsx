import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

const API = import.meta.env.VITE_API_URL;

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Payment() {
  const [grandTotal, setGrandTotal] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    if (!user?._id) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `${API}/api/orders/latest-order/${user._id}`
        );
        setUserDetails({
          username: res.data.address.username,
          email: res.data.address.email,
          _id: res.data._id,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    const total = sessionStorage.getItem("grandTotal");
    if (total && !isNaN(Number(total))) {
      setGrandTotal(Number(total));
    } else {
      navigate("/cart");
    }
  }, []);

  const handleRazorpay = async () => {
    const res = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const result = await axios.post(
        `${API}/api/razorpay/create-order`,
        { amount: grandTotal }
      );

      const { id, currency, amount } = result.data;

      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: "BrainKart",
        description: "Payment for your order",
        order_id: id,

        handler: async (response) => {
          try {
            await axios.put(
              `${API}/api/orders/update-payment-status/${userDetails._id}`,
              {
                paymentStatus: "Success",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            toast.success("Payment Successful 🎉");

            setTimeout(() => {
              navigate("/success");
            }, 2000);
          } catch (err) {
            toast.error("Payment update failed");
          }
        },

        prefill: {
          name: userDetails.username,
          email: userDetails.email,
        },

        theme: {
          color: "#a86a2b",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  if (grandTotal === null) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading payment info...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc] p-4">
      
      <ToastContainer position="top-right" theme="colored" autoClose={2000} />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Complete Your Payment
        </h2>

        {/* AMOUNT */}
        <div className="bg-[#f3c894] rounded-lg py-4 mb-5">
          <p className="text-gray-700 text-sm">Amount to Pay</p>
          <h3 className="text-2xl font-bold text-[#7a4c1e]">
            ₹{grandTotal.toFixed(2)}
          </h3>
        </div>

        {/* USER */}
        <div className="text-sm text-gray-600 mb-5">
          <p><span className="font-semibold">Name:</span> {userDetails.username}</p>
          <p><span className="font-semibold">Email:</span> {userDetails.email}</p>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleRazorpay}
          className="w-full bg-gradient-to-r from-[#a86a2b] to-[#c99b64] text-white py-3 rounded-lg font-semibold hover:scale-105 transition duration-300"
        >
          Pay Now
        </button>

        {/* CANCEL */}
        <button
          onClick={() => navigate("/cart")}
          className="w-full mt-3 bg-gray-400 text-white py-2 rounded-lg hover:scale-105 transition"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default Payment;