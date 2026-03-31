import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API = import.meta.env.VITE_API_URL;

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    category: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    if (category) {
      const cap =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      setFormData((prev) => ({ ...prev, category: cap }));
    }
  }, [category]);

  //  Convert image
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Error");
    });
  };

  //  File select
  const handleFile = async (file) => {
    const base64 = await convertBase64(file);
    setFormData({ ...formData, image: base64 });
    setPreview(base64);
  };

  const updateImage = async (e) => {
    handleFile(e.target.files[0]);
  };

  //  Drag & Drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔥 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/api/products`, formData);

      setToast(true);
      setTimeout(() => setToast(false), 3000);

      const lower = formData.category.toLowerCase();
      if (lower === "men") navigate("/mens");
      else if (lower === "women") navigate("/womens");
      else if (lower === "kids") navigate("/kids");
    } catch (err) {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-b from-[#f8f3ec] to-[#f1e4d5]">
 <ToastContainer position="top-right" theme="colored" autoClose={2000}/>
         {/* HEADER */}
         <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
           <h2 className="text-2xl font-semibold text-white text-center tracking-wide">
           Create Product
           </h2>
      </div>
      {/* TOAST */}
      {toast && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          ✅ Product Added Successfully!
        </div>
      )}
      {/* FORM */}
      <div className="flex justify-center items-start bg-gray-50 px-4 pt-6 pb-10 min-h-screen">
        <div className="w-full max-w-md rounded-xl overflow-x-hidden shadow-lg">

          {/* TOP */}
          <div className="bg-gradient-to-r from-[#030F03] via-[#155715] to-[#204620] text-white text-lg font-semibold px-4 py-3">
            Add New Product
          </div>

          {/* BODY */}
          <div className="bg-gradient-to-r from-[#bb742e] to-[#c99b64] p-5 flex flex-col gap-4">

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* CATEGORY */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-md p-2 border"
              >
                <option value="">-- Select Category --</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full rounded-md p-2 border"
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-400 rounded-md p-4 text-center bg-white cursor-pointer"
              >
                <p className="text-sm text-gray-600">
                  Drag & Drop Image OR Click Below
                </p>

                <input
                  type="file"
                  onChange={updateImage}
                  className="mt-2"
                  required
                />
              </div>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-40 object-contain rounded-md bg-white"
                />
              )}

              {/* PRICE */}
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full rounded-md p-2 border"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#030F03] via-[#155715] to-[#204620] text-white py-2 rounded-md font-semibold hover:bg-black transition"
              >
                {loading ? "Adding..." : "Submit"}
              </button>

            </form>
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default CreateProduct;