import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function WomensCollection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = `${API}/api/products/category/Women`;
    setLoading(true);

    axios
      .get(url)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Heading */}
      <div className="bg-gradient-to-r from-[#bb742e] to-[#c99b64] py-3 shadow-md">
        <h2 className="text-xl md:text-2xl font-bold text-white text-center tracking-wide">
          Women's Collection
        </h2>
      </div>

      {/* Container */}
      <div className="px-4 py-8 pb-16 bg-gray-50 min-h-screen">
        {loading ? (
          <p className="text-red-500 text-3xl text-center">Loading...</p>
        ) : items.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-hidden transition duration-300 hover:scale-[1.03] hover:shadow-lg"
              >
                {/* Image */}
                <div className="w-full h-52 sm:h-64 min-h-72 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain "
                  />
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3">
                  <p className="font-semibold text-center text-gray-800 text-sm sm:text-base">
                    Name: {item.name}
                  </p>

                  <p className="font-medium text-gray-700 text-sm sm:text-base">
                    Price: ₹ {item.price}
                  </p>

                  <Link
                    to={`/item/${item._id}`}
                    className="w-full text-center bg-[#bb742e] text-white py-2 rounded-md font-semibold hover:bg-[#c99b64] transition"
                  >
                    ADD TO CART
                  </Link>
                </div>
              </div>
            ))}

          </div>

        ) : (
          <h1 className="text-center text-xl font-semibold">
            Item not found
          </h1>
        )}
      </div>
    </>
  );
}

export default WomensCollection;