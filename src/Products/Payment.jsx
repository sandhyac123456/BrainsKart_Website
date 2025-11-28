import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
const API = import.meta.env.VITE_API_URL ;

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
  const [orderId, setOrderId] = useState(null);
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
        userId: res.data.userId,
        _id: res.data._id,
      });
    } catch (err) {
      console.error("Error fetching user details:", err);
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

    if (!grandTotal || isNaN(grandTotal) || grandTotal <= 0) {
      toast.error("Invalid amount to pay");
      return;
    }

    try {
      const result = await axios.post(
        `${API}/api/razorpay/create-order`,
        {
          amount: grandTotal,
        }
      );

      const { id: razorpayOrderId, currency, amount } = result.data;
      setOrderId(userDetails._id);

      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: "BrainKart",
        description: "Payment for your order",
        order_id: razorpayOrderId,
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
            toast.success("Payment Successful!");
            setTimeout(() => {
              navigate("/success");
            }, 2000);
          } catch (error) {
            toast.error("Failed to update payment status.");
            console.error(error);
          }
        },
        prefill: {
          name: userDetails.username,
          email: userDetails.email,
        },
        theme: {
          color: "#2ecc71", 
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Could not initiate payment, try again.");
    }
  };

  if (grandTotal === null) return <div>Loading payment info...</div>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "rgb(243, 200, 148)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgb(133, 84, 24)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Amount to Pay :{" "}
          <span style={{ color: " rgb(133, 84, 24)" }}>
            ₹{grandTotal.toFixed(2)}
          </span>
        </h2>
        <button
          onClick={handleRazorpay}
          style={{
            padding: "12px 30px",
            fontWeight: "bold",
            fontSize: "18px",
            background:
              "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Pay with Razorpay
        </button>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}

export default Payment;
