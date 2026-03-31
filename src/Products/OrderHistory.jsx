import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("today");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      let res;

      console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
      if (showDatePicker && startDate && endDate) {
        res = await axios.post("/api/orders/range", { startDate, endDate });
      } else if (view === "today") {
        res = await axios.get("/api/orders/today");
      } else {
        res = await axios.get("/api/orders");
      }
console.log("API Response:", res.data); // 🔥 important
      let fetched = Array.isArray(res?.data) ? res.data : [];

      if (paymentFilter !== "all") {
        fetched = fetched.filter((order) =>
          order.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase()
        );
      }

      setOrders(fetched);
    } catch {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDatePicker && (!startDate || !endDate)) return;
    fetchOrders();
  }, [view, startDate, endDate, paymentFilter, showDatePicker]);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Ar you sure you wat to Delete this order?")) return;
    await axios.delete(`/api/orders/${id}`);
    setOrders((prev) => prev.filter((o) => o._id !== id));
    toast.success("Order Deleted Successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3ec] to-[#f1e4d5]">
 <ToastContainer position="top-right" theme="colored" autoClose={2000}/>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
        <h2 className="text-2xl font-semibold text-white text-center tracking-wide">
          Order History
        </h2>
      </div>

      {/* CONTROLS */}
      <div className="p-4 flex flex-col items-center gap-4">

        <div className="flex flex-wrap justify-center gap-3">

          {/* TODAY */}
          <button
            onClick={() => { setView("today"); setShowDatePicker(false); }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-300
              ${view === "today"
                ? "bg-gradient-to-r from-[#2f6fed] to-[#4f8dfd] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border hover:bg-gray-100 hover:scale-105"
              }`}
          >
            Today
          </button>

          {/* ALL */}
          <button
            onClick={() => { setView("all"); setShowDatePicker(false); }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-300
              ${view === "all"
                ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border hover:bg-gray-100 hover:scale-105"
              }`}
          >
            All
          </button>

          {/* FILTER */}
          <button
            onClick={() => { setShowDatePicker(!showDatePicker); setView("range"); }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-300
              ${view === "filter"
                ? "bg-gradient-to-r from-[#2f6fed] to-[#4f8dfd] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border hover:bg-gray-100 hover:scale-105"
              }`}
          >
            Filter
          </button>

          {/* DROPDOWN */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 rounded-full border bg-white text-sm shadow-md 
            focus:outline-none focus:ring-2 focus:ring-[#c99b64]"
          >
            <option value="all">All</option>
            <option value="Cash on Delivery">COD</option>
            <option value="Online">Online</option>
          </select>

        </div>

        {/* DATE FILTER */}
        {showDatePicker && (
          <div className="flex flex-wrap gap-4 items-center justify-center">

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded-md"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded-md"
            />

            <button
              onClick={fetchOrders}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Apply
            </button>

            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setShowDatePicker(false);
                setView("today");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Reset
            </button>

          </div>
        )}

        {/* TOTAL */}
        <p className="text-lg font-semibold text-gray-700">
          Total Orders: {orders.length}
        </p>

      </div>

      {/* ORDERS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6 pb-10">

        {loading && <p className="text-center text-2xl font-semibold text-red-500">Loading...</p>}
        {error && <p className="text-center text-2xl font-semibold text-red-500">{error}</p>}

        {!loading && orders.length === 0 && (
          <p className="text-center text-2xl font-semibold text-gray-500">
            No orders found
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gradient-to-br from-[#ad6f31] to-[#c99b64] 
            text-white rounded-2xl shadow-md hover:shadow-xl 
            hover:scale-[1.02] transition duration-300 p-5 flex flex-col justify-between"
          >

            {/* DETAILS */}
<div className="space-y-1">

  {/* ORDER ID */}
  <h4 className="font-semibold text-white text-sm">
    Order ID : {order._id.slice(0, 12)}...
  </h4>

  {/* NAME */}
  <p className="text-sm text-white">
    <span className="font-semibold">Name :</span> {order.address?.username}
  </p>

  {/* TOTAL */}
  <p className="text-sm text-white">
    <span className="font-semibold">Total :</span> ₹{order.grandTotal?.toFixed(2)}
  </p>

  {/* ADDRESS */}
  <p className="text-sm text-white leading-tight">
    <span className="font-semibold">Address :</span>{" "}
    {order.address?.street}, {order.address?.city}, {order.address?.state}
  </p>

  {/* MOBILE */}
  <p className="text-sm text-white">
    <span className="font-semibold">Mobile :</span> {order.address?.mobile}
  </p>

  {/* PAYMENT METHOD */}
  <p className="text-sm text-white mt-1">
    <span className="font-semibold">Payment :</span> {order.paymentMethod}
  </p>

  {/* STATUS */}
<div className="mt-2 flex items-center gap-3">

  {/* LEFT TEXT */}
  <p className="text-sm font-semibold text-white">
    Payment Status :
  </p>

  {/* RIGHT BADGE */}
  {order.paymentStatus === "Success" ? (
    <span className="ml-2 px-3 py-[2px] text-xs rounded-full font-semibold bg-green-200 text-green-800 cursor-default">
      Success
    </span>
  ) : (
    <span
      onClick={() => {
        if (order.paymentStatus !== "Success") {
          navigate(`/payment`);
        }
      }}
      className={`ml-2 px-3 py-[2px] text-xs rounded-full font-semibold transition

        ${
          order.paymentStatus === "Success"
            ? "bg-green-200 text-green-800 cursor-not-allowed opacity-80"
            : order.paymentStatus === "Failed"
            ? "bg-red-200 text-red-800 cursor-pointer hover:bg-red-300"
            : "bg-blue-200 text-blue-800 cursor-pointer hover:bg-blue-300"
        }
      `}
    >
      {order.paymentStatus || "Pending"}
    </span>
  )}

</div>

  {/* ITEMS */}
  <div className="mt-3 space-y-2">
    {order.cartItems?.map((item, i) => (
      <div
        key={i}
        className="flex gap-3 items-center bg-white p-2 rounded-lg shadow-sm"
      >
        <img
          src={item.image}
          className="w-12 h-12 object-cover rounded-md border"
        />
        <div className="text-xs text-gray-800">
          <p className="font-medium">{item.name}</p>
          <p>
            Qty: {item.quantity} | ₹{item.price}
          </p>
        </div>
      </div>
    ))}
  </div>

</div>

            {/* DELETE */}
            <button
              onClick={() => handleDeleteOrder(order._id)}
              className="mt-5 w-full bg-red-600 hover:bg-red-500/90 
              text-white py-2 rounded-lg text-sm font-semibold 
              shadow-md hover:shadow-lg transition duration-300"
            >
              Delete Order
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default OrderHistory;