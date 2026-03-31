import React from "react";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc] px-4">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-[#a86a2b] to-[#c99b64] flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-white text-5xl md:text-6xl">✓</span>
          </div>
        </div>

        {/* TEXT */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Order Successful 🎉
        </h2>

        <p className="text-gray-600 text-sm md:text-base mb-6">
          Your order has been placed successfully.  
          Thank you for shopping with us!
        </p>

        {/* BUTTON */}
        <Link to="/">
          <button className="w-full bg-gradient-to-r from-[#a86a2b] to-[#c99b64] text-white py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-md">
            Continue Shopping
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Success;