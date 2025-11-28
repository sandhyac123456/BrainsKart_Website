import React, { useEffect, useState } from "react";
import "./Register.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("today");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      let res;
      if (showDatePicker && startDate && endDate) {
        res = await axios.post("/api/orders/range", { startDate, endDate });
      } else if (view === "today") {
        res = await axios.get("/api/orders/today");
      } else {
        res = await axios.get("/api/orders");
      }

      let fetchedOrders = Array.isArray(res?.data) ? res.data : [];

      if (paymentFilter !== "all") {
        if (paymentFilter === "Cash on Delivery") {
          fetchedOrders = fetchedOrders.filter(
            (order) => order.paymentMethod.toLowerCase() === "cash on delivery"
          );
        } else if (paymentFilter === "Online") {
          fetchedOrders = fetchedOrders.filter(
            (order) => order.paymentMethod.toLowerCase() === "online"
          );
        }
      }

      setOrders(fetchedOrders);
    } catch (err) {
      setError("Failed to fetch orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDatePicker && (!startDate || !endDate)) return;
    fetchOrders();
  }, [view, startDate, endDate, paymentFilter, showDatePicker]);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order Deleted Successfully!");
    } catch (err) {
      console.log("Error Deleting Order:", err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="head">
        <div className="text">
          <span
            style={{
              marginLeft: "540px",
              fontWeight: "bold",
              fontSize: "35px",
            }}
          >
            Order History
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <button
          className={`btn-1 ${view === "today" ? "active" : ""}`}
          onClick={() => {
            setView("today");
            setShowDatePicker(false);
          }}
        >
          Today's Orders
        </button>
        <button
          className={`btn-2 ${view === "all" ? "active" : ""}`}
          onClick={() => {
            setView("all");
            setShowDatePicker(false);
          }}
        >
          All Orders
        </button>
        <button
          className={`btn-3 ${showDatePicker ? "active" : ""}`}
          onClick={() => {
            setShowDatePicker(!showDatePicker);
            setView("range");
          }}
        >
          {showDatePicker ? "Hide Date Picker" : "Show Date Picker"}
        </button>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            background: "gray",
            fontWeight: "bold",
          }}
        >
          <option value="all">All Payments</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Online">Online</option>
        </select>
      </div>

     
      {showDatePicker && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
  <label style={{ marginRight: "10px", fontWeight: "bold" }}>
    Start Date: 
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      style={{ marginLeft: "5px", marginRight: "20px" }}
    />
  </label>

  <label style={{ marginRight: "10px", fontWeight: "bold" }}>
    End Date: 
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      style={{ marginLeft: "5px", marginRight: "20px" }}
    />
  </label>

</div>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <button
              style={{ background: "green", color: "white",width:"120px" }}
              className="btn-4"
              onClick={fetchOrders}
            >
               Apply
            </button>
            <button
              style={{ background: "red", color: "white" ,width:"120px"}}
              className="btn-5"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setShowDatePicker(false);
                setView("today");
              }}
            >
               Cancel
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          textAlign: "center",
          fontSize: "25px",
          fontWeight: "bold",
          marginTop: "15px",
        }}
      >
        Total Orders: {orders.length}
      </div>


      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {loading && (
          <p style={{ fontWeight: "bold", color: "gray" }}>
            Loading Orders....
          </p>
        )}
        {error && <p style={{ fontWeight: "bold", color: "red" }}>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p style={{ marginTop: "40px", fontWeight: "bold", color: "gray" }}>
            No orders found for this selection.
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              width: "380px",
              background: "wheat",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5>Order #:{order._id}</h5>
            <p>
              <strong>Name:</strong> {order.address?.username}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.total?.toFixed(2)}
            </p>
            <p>
              <strong>Address:</strong> {order.address?.street},{" "}
              {order.address?.city}, {order.address?.state}
            </p>
            <p>
              <strong>Mobile:</strong> {order.address?.mobile}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.paymentStatus === "Success"
                      ? "green"
                      : order.paymentStatus === "Failed"
                      ? "red"
                      : "blue",
                  fontWeight: "bold",
                }}
              >
                {order.paymentStatus === "Pending" || !order.paymentStatus ? (
                  <>
                    Your payment is pending. Please continue to{" "}
                    <Link to="/payment">
                      <span
                        style={{ color: "red", textDecoration: "underline" }}
                      >
                        Payment
                      </span>
                    </Link>
                  </>
                ) : (
                  order.paymentStatus
                )}
              </span>
            </p>

            {order.cartItems?.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px" }}>
                <img src={item.image} alt="" width="50" height="50" />
                <div>
                  <p style={{ marginBottom: "2px" }}>{item.name}</p>
                  <p>
                    Qty: {item.quantity} | ₹{item.price}
                  </p>
                </div>
              </div>
            ))}

            <button
              className="btn-5"
              onClick={() => handleDeleteOrder(order._id)}
            >
              Delete Order
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default OrderHistory;
