import React, { useEffect } from "react";
import "./Register.css";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
const API = import.meta.env.VITE_API_URL ;

function CheckOut() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const [username , setUsername] = useState("");
  const [hno, setHno] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();


  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/api/cart/${userId}`);
      setCartItems(res.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  useEffect(() => {
  if (user && user._id) {
    fetchCart();
  }
}, [user]);


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

  const placeOrder = async () => {
    if (
      !username||
      !hno ||
      !street ||
      !landmark ||
      !city ||
      !state ||
      !country ||
      !pincode ||
      !phone ||
      !selectedPaymentMethod ||
      cartItems.length === 0
    ) {
      alert("Please fill all the fields ");
      return;
    }
    const orderData = {
        userId: user._id,

      address: {
        email: user.email,
        username:username,
        hno: hno,
        street: street,
        landmark: landmark,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
        mobile: phone,
      },
      paymentMethod: selectedPaymentMethod,
      cartItems: cartItems,
      total: total,
      tax: tax,
      grandTotal: grandTotal,
    };
    console.log(JSON.stringify(orderData).length);
    try {
      const res = await axios.post(
        `${API}/api/orders`,
        orderData
      );
      sessionStorage.setItem("grandTotal", grandTotal);

      alert("Order placed successfully!");
      navigate("/payment");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order failed. Please try again.");
    }
  };

  useEffect(()=>{
    sessionStorage.removeItem("grandTotal");
  },[])
  return (
    <>
      <div className="head">
        <div className="text">
          <i className="fa-solid fa-cash-register"></i>{" "}
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            CheckOut Items
          </span>
        </div>
      </div>

      <div
        className="cart-container"
        style={{
          display: "flex",
          alignItems: "flex-start",
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
            maxWidth: "750px",
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
            <div
              style={{
                fontWeight: "bold",
                background: "rgb(243, 200, 148)",
                padding: "10px",
              }}
            >
              <form>
                <div
                  className="form-group"
                  style={{ outline: "none", boxShadow: "none" }}
                >
                 <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="text"
                    value={hno}
                    onChange={(e) => setHno(e.target.value)}
                    placeholder="House Number"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Landmark"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="number"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-1">
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="form-control"
                  />
                </div>
              </form>
            </div>
          </div>
          <div
            style={{
              padding: "10px",
              background:
                "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
            }}
          >
            <h3 style={{ color: "rgb(243, 200, 148)" }}>Payment Details</h3>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              boxShadow: " rgba(0, 0, 0, 0.1) 0px 12px 12px",
            }}
          >
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value="Cash on Delivery"
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label class="form-check-label" htmlFor="flexRadioDefault1">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                value="Online"
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />
              <label class="form-check-label" htmlFor="flexRadioDefault2">
                Credit Card Payment
              </label>
            </div>
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
            <h3 style={{ color: "rgb(243, 200, 148)" }}>Your Cart</h3>
          </div>
          <div
            style={{
              background: "white",
              padding: "15px",
              boxShadow: " rgba(0, 0, 0, 0.1) 0px 4px 12px",
            }}
          >
            {cartItems.length === 0 ? (
              <p style={{ color: "red", fontSize: "40px" }}>
                Your cart is empty.
              </p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="cart-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "white",
                      padding: "5px",
                      border: "1px solid gray",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "30px",
                      }}
                    >
                      <div style={{ width: "100px" }}>
                        <img src={item.image} alt={item.name} width="80" />
                      </div>
                      <div>
                        <p style={{ fontWeight: "bold" }}>{item.name}</p>
                        <p style={{ fontWeight: "bold" }}>₹{item.price}</p>
                        <p style={{ fontWeight: "bold" }}>
                          Qty : {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  className="cart-item mt-2"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "rgb(243, 200, 148)",
                    padding: "5px",
                    height: "40px",
                    border: "1px solid gray",
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

                    border: "1px solid gray",
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
                    border: "1px solid gray",
                  }}
                >
                  <p>
                    Grand Total : <strong>₹{grandTotal.toFixed(2)}</strong>{" "}
                  </p>
                </div>
                <button
                  onClick={placeOrder}
                  className="delete-btn mt-2"
                  style={{ width: "100%", fontSize: "20px" }}
                >
                  Pay Now ₹{grandTotal.toFixed(2)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default CheckOut;
