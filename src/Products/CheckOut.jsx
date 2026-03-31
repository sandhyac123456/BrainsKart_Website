import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

      toast.success("Order placed successfully!");
      navigate("/payment");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Order failed. Please try again.");
    }
  };

  useEffect(()=>{
    sessionStorage.removeItem("grandTotal");
  },[])

  return (
  <div className="overflow-y-auto bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc]">
   <ToastContainer position="top-right" theme="colored" autoClose={2000}/>
  
    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
      <h2 className="text-center text-2xl font-bold text-white">
        Checkout Items
      </h2>
    </div>

    {/* MAIN */}
    <div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-3 gap-6 items-start">

      {/* LEFT SIDE (FORM) */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5">

        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Shipping Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username"
            className="border p-2 rounded-md focus:ring-2 focus:ring-[#a86a2b]" />

          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone"
            className="border p-2 rounded-md focus:ring-2 focus:ring-[#a86a2b]" />

          <input value={hno} onChange={(e)=>setHno(e.target.value)} placeholder="House No"
            className="border p-2 rounded-md" />

          <input value={street} onChange={(e)=>setStreet(e.target.value)} placeholder="Street"
            className="border p-2 rounded-md" />

          <input value={landmark} onChange={(e)=>setLandmark(e.target.value)} placeholder="Landmark"
            className="border p-2 rounded-md" />

          <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City"
            className="border p-2 rounded-md" />

          <input value={state} onChange={(e)=>setState(e.target.value)} placeholder="State"
            className="border p-2 rounded-md" />

          <input value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="Country"
            className="border p-2 rounded-md" />

          <input value={pincode} onChange={(e)=>setPincode(e.target.value)} placeholder="Pincode"
            className="border p-2 rounded-md md:col-span-2" />

        </div>

        {/* PAYMENT */}
        <h3 className="text-lg font-semibold mt-6 mb-3 border-b pb-2">
          Payment Method
        </h3>

        <div className="space-y-2">

         <label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="payment"
    value="Cash on Delivery"
    checked={selectedPaymentMethod === "Cash on Delivery"}
    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
  />
  Cash on Delivery
</label>

<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="payment"
    value="Online"
    checked={selectedPaymentMethod === "Online"}
    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
  />
  Credit / Debit Card
</label>

        </div>

      </div>

      {/* RIGHT SIDE (SUMMARY) */}
      <div className="bg-white rounded-2xl shadow-lg p-5 lg:sticky lg:top-5">

        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Order Summary
        </h3>

        {/* ITEMS */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">

          {cartItems.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center border-b pb-2">

              <img src={item.image}
                className="w-14 h-14 object-cover rounded-md border" />

              <div className="flex-1 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>

              <div className="font-semibold text-sm">
                ₹{item.price * item.quantity}
              </div>

            </div>
          ))}

        </div>

        {/* TOTAL */}
        <div className="mt-4 space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={placeOrder}
          className="mt-5 w-full bg-gradient-to-r from-[#a86a2b] to-[#c99b64] text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Pay Now ₹{grandTotal.toFixed(2)}
        </button>

      </div>

    </div>

  </div>
);
}
export default CheckOut;
