import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = import.meta.env.VITE_API_URL;

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
      const res = await axios.get(`${API}/api/cart/${userId}`);
      setCartItems(res.data.items);
      setCartCount(res.data.items.length);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?")
    if(!confirmDelete)
      return;
    try{
    await axios.delete(`${API}/api/cart/${userId}/${productId}`);
    setCartItems((prev) =>
      prev.filter((i) => i.productId !== productId)
    );

    toast.success("Product deleted from cart");
  }
  catch(err)
  {
    toast.error("Failed to delete product")
  }
  };

  const updateQtyOnly = async (productId, quantity) => {
    await axios.put(`${API}/api/cart/${userId}/${productId}`, {
      productId,
      quantity,
    });
  };

  // instant UI update
  const incQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    const item = cartItems.find((i) => i.productId === id);
    if (item) updateQtyOnly(id, item.quantity + 1);
  };

  const decQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    const item = cartItems.find((i) => i.productId === id);
    if (item && item.quantity > 1) {
      updateQtyOnly(id, item.quantity - 1);
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  useEffect(() => {
    const t = cartItems.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );
    const tx = t * 0.05;
    setTotal(t);
    setTax(tx);
    setGrandTotal(t + tx);
  }, [cartItems]);

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#f5f3f0] to-[#e9e4dc]">
     <ToastContainer position="top-right"  theme="colored" autoClose={2000}/>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
        <h2 className="text-center text-2xl font-bold text-white tracking-wide">
          Your Cart
        </h2>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 ">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-x-hidden">

          <div className="bg-[#f3c894] px-4 py-3 font-semibold text-lg">
            Cart Items
          </div>

          {loading ? (
            <p className="p-4 font-semibold text-2xl text-red-500">Loading...</p>
          ) : cartItems.length === 0 ? (
            <p className="p-4 font-semibold text-2xl text-red-500">Cart is empty</p>
          ) : (

            <div>

              {/* HEADER */}
              <div className="grid grid-cols-5 hidden md:grid bg-[#f8e2c2] px-4 py-2 text-sm font-semibold text-gray-700">
                <span>Image</span>
                <span>Name</span>
                <span className="text-center">Qty</span>
                <span>Price</span>
                <span className="text-center">Action</span>
              </div>

              {/* ITEMS */}
              {cartItems.map((item) => (
  <div
    key={item.productId}
    className="border-b hover:bg-gray-50 transition"
  >

    {/* DESKTOP VIEW */}
    <div className="hidden md:grid grid-cols-5 items-center px-4 py-3">

      <img src={item.image} className="w-14 h-14 rounded-md object-cover border" />

      <div>
        <p className="font-medium text-gray-800">{item.name}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={() => decQty(item.productId)} className="w-7 h-7 rounded-full bg-gray-200">-</button>
        <span className="font-semibold">{item.quantity}</span>
        <button onClick={() => incQty(item.productId)} className="w-7 h-7 rounded-full bg-gray-200">+</button>
      </div>

      <div className="font-medium text-gray-700">
        ₹{item.price * item.quantity}
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={() => navigate(`/update/${item.productId}`)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Update</button>
        <button onClick={() => handleDelete(item.productId)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
      </div>

    </div>

    {/* MOBILE VIEW */}
    <div className="md:hidden flex gap-3 p-4">

      {/* IMAGE */}
      <img src={item.image} className="w-16 h-16 rounded-md object-cover border" />

      {/* DETAILS */}
      <div className="flex-1">

        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-sm text-gray-500">₹{item.price}</p>

        {/* QTY */}
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => decQty(item.productId)} className="w-7 h-7 rounded-full bg-gray-200">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => incQty(item.productId)} className="w-7 h-7 rounded-full bg-gray-200">+</button>
        </div>

        {/* ACTION */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => navigate(`/update/${item.productId}`)} className="flex-1 bg-blue-500 text-white py-1 rounded text-sm">Update</button>
          <button onClick={() => handleDelete(item.productId)} className="flex-1 bg-red-500 text-white py-1 rounded text-sm">Delete</button>
        </div>

      </div>

    </div>

  </div>
))}

            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-xl shadow-md p-5 h-fit lg:sticky lg:top-5">

          <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">

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

          <div className="mt-6 flex flex-col gap-3">

            <Link to="/checkout">
              <button className="w-full bg-gradient-to-r from-black to-purple-700 text-white py-2 rounded-lg hover:scale-105 transition">
                Checkout
              </button>
            </Link>
         <Link to="/">
            <button className="w-full bg-gradient-to-r from-[#155715] to-[#29a829] text-white py-2 rounded-lg hover:scale-105 transition">
              Shop More
            </button>
</Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AllCart;