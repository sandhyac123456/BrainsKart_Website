import React, { use, useEffect, useState } from "react";
import axios from "axios";
import "./Register.css";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const API = import.meta.env.VITE_API_URL ;


const AllCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const { setCartCount } = useCart();
const user = useSelector((state) => state.auth.user);
const userId = user?._id;

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/cart/${userId}`);
      setCartItems(res.data.items);
      setCartCount(res.data.items.length);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${API}/api/cart/${userId}/${productId}`
      );
      fetchCart();
      alert("Item deleted from cart!");
    } catch (error) {
      console.log("Delete failed : ", error);
    }
  };
  const updateQtyOnly = async (productId, quantity) => {
    console.log("update",quantity)
    try {
      await axios.put(`${API}/api/cart/${userId}/${productId}`, {
        productId,
        quantity,
    
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const incQty = async (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item) {
      const newQty = item.quantity + 1;
      await updateQtyOnly(productId, newQty) ;
    }
  };

  const decQty = async (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item && item.quantity > 1) {
      const newQty = item.quantity - 1;
      await updateQtyOnly(productId, newQty);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const tax = total * 0.05;
    const grandTotal = total + tax;
    setTotal(total);
    setTax(tax);
    setGrandTotal(grandTotal);
  }, [cartItems]);

  return (
    <>
      <div className="head">
        <div className="text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="25"
            fill="currentColor"
            className="bi bi-cart-fill m-1"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            Your Cart
          </span>
        </div>
      </div>

      <div
        className="cart-container"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "20px",
          marginTop: "10px",
          padding: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "800px",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              padding: "10px",
              background:
                "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
            }}
          >
            <h3 style={{ color: "rgb(243, 200, 148)" }}>Your Cart Items</h3>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              boxShadow: " rgba(0, 0, 0, 0.1) 0px 4px 12px",
            }}
          >
            {loading ? (
              <p style={{ color: "red", fontSize: "40px" }}>Loading...</p>
            ) : cartItems.length === 0 ? (
              <p style={{ color: "red", fontSize: "40px" }}>
                Your cart is empty.
              </p>
            ) : (
              <>
                {/* Heading Row  */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    background: "rgb(243, 200, 148)",
                    padding: "10px",
                    borderBottom: "1px solid rgb(240, 237, 233)",
                  }}
                >
                  <div style={{ width: "120px" }}>Image</div>
                  <div style={{ width: "90px" }}>Name</div>
                  <div style={{ width: "80px" }}>Qty</div>
                  <div style={{ width: "140px" }}>Price</div>
                  <div style={{ width: "100px" }}>Action</div>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="cart-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgb(243, 200, 148)",
                      padding: "15px",
                      borderBottom: "1px solid rgb(240, 237, 233)",
                    }}
                  >
                    <div style={{ width: "90px" }}>
                      <img src={item.image} alt={item.name} width="80" />
                    </div>
                    <div style={{ width: "90px" }}>{item.name}</div>

                    <div style={{ width: "60px" }}>
                      <i
                        className="fa-solid fa-circle-minus"
                        onClick={() => decQty(item.productId)}
                      />
                      {item.quantity}
                      <i
                        className="fa-solid fa-circle-plus"
                        onClick={() => incQty(item.productId)}
                      />
                    </div>
                    <div style={{ width: "80px" }}>₹{item.price}</div>
                    <div style={{ width: "150px" ,display:"flex", gap:"10px"}}>
                       <button className="delete-btn" type="button" onClick={()=>{navigate(`/update/${item.productId}`)}}>
                         UPDATE
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.productId)}
                      >
                        DELETE
                      </button>
                     
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "400px",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              padding: "10px",
              background:
                "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
            }}
          >
            <h3 style={{ color: "rgb(243, 200, 148)" }}>Your Total</h3>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              boxShadow: " rgba(0, 0, 0, 0.1) 0px 4px 12px",
            }}
          >
            <div
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "rgb(243, 200, 148)",
                padding: "5px",
                height: "40px",
                borderBottom: "1px solid rgb(240, 237, 233)",
              }}
            >
              <p>
                Total : <strong>₹{total.toFixed(2)}</strong>
              </p>
            </div>
            <div
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "rgb(243, 200, 148)",
                padding: "5px",
                height: "40px",

                borderBottom: "1px solid rgb(240, 237, 233)",
              }}
            >
              <p>
                Tax : <strong>₹{tax.toFixed(2)}</strong>
              </p>
            </div>
            <div
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "rgb(243, 200, 148)",
                padding: "5px",
                height: "40px",
                borderBottom: "1px solid rgb(240, 237, 233)",
              }}
            >
              <p>
                Grand Total : <strong>₹{grandTotal.toFixed(2)}</strong>{" "}
              </p>
            </div>
            <div
              className="cart-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "White",
                padding: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="create-btn14">
                  <Link className="nav-link text-white" to="/checkout">
                    CHECKOUT
                  </Link>
                </button>
                <div>
                  <button className="create-btn15">SHOP NOW</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCart;
