import React, { useEffect, useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API_URL ;

function KidsCollection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let url = `${API}/api/products/category/Kids`;
    axios
      .get(url)
      .then((res) => {
        console.log();
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="head">
        <div className="text">
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            Kid's Collection
          </span>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row">
          {items.length > 0 ? (
            items.map((item) => {
              return (
                <div key={item._id} className="col-md-3">
                  <div className="card product-card">
                    <img
                      src={item.image}
                      className="card-img"
                      alt={item.name}
                    />
                    <div className="card-body">
                      <div className="product-info">
                        <div className="info-box">Name : {item.name} </div>
                        <div className="info-box">Price : <i className="fa-solid fa-indian-rupee-sign"></i>{item.price} </div>
                        <div className="info-box">
                          <button className="create-btn13">
                            <Link
                              className="nav-link text-white"
                              to={`/item/${item._id}`}
                            >
                              ADD TO CART
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>Item not found</h1>
          )}
        </div>
      </div>
    </>
  );
}
export default KidsCollection;
