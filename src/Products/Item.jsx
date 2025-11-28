import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { useCart } from "../context/CartContext.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API_URL ;

function Item() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedQtyd, setSelectedQty] = useState(1);
  const { setCartCount } = useCart();
const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);



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
        alert("Please login first!"); 
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
        alert("Product added to cart!");
        navigate("/cart"); 
        setCartCount((prev) => prev + 1); 
      }
    } catch (err) {
      console.error("Failed to add to cart:", err.response.data || err.message);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <div className="head">
        <div className="text">
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            Your Selected Product
          </span>
        </div>
      </div>
      <div className="d-flex p-4">
        {product ? (
          <div style={{ display: "flex", gap: "80px" }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "400px" }}
            />
            <div>
              <h2>Name : {product.name}</h2>
              <h3>
                Price : <span style={{ color: "red" }}>₹{product.price}</span>
              </h3>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid gray",
                  width: "200px",
                }}
              >
                <label
                  htmlFor="qty"
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "8px",
                  }}
                >
                  Select Qty :
                </label>
                <select
                  id="qty"
                  value={selectedQtyd}
                  onChange={handleQtyChange}
                  style={{
                    padding: "4px",
                    fontSize: "16px",
                    border: "none",
                    outline: "none",
                  }}
                >
                  {[...Array(100).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: "15px" }}>
                <button
                  className="create-btn16"
                  onClick={handleAddToCart}
                  disabled={!product}
                >
                  Add to Cart
                </button>
              </div>

              <p style={{ marginTop: "20px", width: "600px" }}>
                Care instructios : Machine Wash Fit Type : Slim Fit 100% Cotton
                Slim Fit Long Sleeve Cutaway Machine Wash.
              </p>
            </div>
          </div>
        ) : (
          <h2 className="p-4">Loading Product...</h2>
        )}
      </div>
    </>
  );
}

export default Item;
