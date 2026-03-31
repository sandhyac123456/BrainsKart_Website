import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API = import.meta.env.VITE_API_URL ;

function Item() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedQtyd, setSelectedQty] = useState(1);
  const { setCartCount } = useCart();
const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/products/id/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
      });
  }, [id]);

  const handleQtyChange = (e) => {
    setSelectedQty(Number(e.target.value));
  };

  const handleAddToCart = async () => {
    try {
      if (!user || !user._id) {
        toast.error("Please login first!"); 
        return;
      }

      const cartData = {
        userId: user._id,
        productId: product._id,
        name:product.name,
        price:product.price,
        quantity: selectedQtyd,
      };
      const res = await axios.post(`${API}/api/cart`, cartData);
      if (res.data.already) {
        alert("Product already in cart");
        navigate("/cart"); 
      } else if (res.status === 200 || res.status === 201) {
        toast.success("Product added to cart!");
        setTimeout(()=>{
        navigate("/cart"); 
        },1500)
        setCartCount((prev) => prev + 1); 
      }
    } catch (err) {
      console.error("Failed to add to cart:", err.response.data || err.message);
      toast.error("Something went wrong!");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc]">
 <ToastContainer position="top-right" theme="colored" autoClose={2000}/>
    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
      <h2 className="text-center text-2xl font-bold text-white">
        Your Selected Product
      </h2>
    </div>

    {/* MAIN */}
    <div className="max-w-6xl mx-auto p-4">

      {product ? (
        <div className="grid md:grid-cols-2 gap-2 bg-white rounded-xl shadow-lg p-4">

          {/* IMAGE */}
          <div className="flex justify-center items-center p-3 ">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[400px] object-contain rounded-xl hover:scale-105 transition duration-300"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center space-y-4">

            <h2 className="text-2xl font-bold text-gray-800">
             Name : {product.name}
            </h2>

            <h3 className="text-xl font-semibold text-gray-800">
              Price : <span className="text-red-500"> ₹{product.price}</span>
            </h3>

            {/* QTY */}
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-gray-800">Quantity:</span>

              <select
                value={selectedQtyd}
                onChange={handleQtyChange}
                className="border rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-[#a86a2b]"
              >
                {[...Array(10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-3">

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#a86a2b] to-[#c99b64] text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
              >
                Cancel
              </button>

            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              Care instructions: Machine Wash <br />
              Fit Type: Slim Fit <br />
              100% Cotton Slim Fit Long Sleeve Cutaway Machine Wash.
            </p>

          </div>

        </div>
      ) : (
        <h2 className="text-center text-2xl font-semibold text-red-600 mt-10">
          Loading Product...
        </h2>
      )}

    </div>
  </div>
);
}

export default Item;
