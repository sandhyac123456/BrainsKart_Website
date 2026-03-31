import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = import.meta.env.VITE_API_URL ;

function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Data, setData] = useState({
    name: "",
    image: "",
    price: "",
  });

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${API}/api/products/id/${id}`
      );
      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(" failed to fetch product: ", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // updateImage
  let updateImage = async (event) => {
    let imageFile = event.target.files[0];
    let base64Image = await convertBase64String(imageFile);
    setData({
      ...Data,
      image: base64Image,
    });
  };

  let convertBase64String = (imageFile) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);
      fileReader.addEventListener("load", () => {
        if (fileReader.result) {
          resolve(fileReader.result);
        } else {
          reject("Error Occurred");
        }
      });
    });
  };

  const handleChangeData = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    console.log("data", Data);
    try {
      await axios.put(`${API}/api/products/${id}`, Data);
      toast.success("Product updated successfully!");
      navigate("/cart");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-b from-[#f8f3ec] to-[#f1e4d5]">
 <ToastContainer position="top-right" theme="colored" autoClose={2000}/>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
        <h2 className="text-2xl font-semibold text-white text-center tracking-wide">
          Update Product
        </h2>
    </div>

    {/* CARD */}
    <div className="flex justify-center items-center py-10 px-4">

      <div className="w-full max-w-md rounded-xl overflow-x-hidden shadow-xl">

        {/* TOP BLACK */}
        <div className="bg-gradient-to-r from-[#030F03] via-[#155715] to-[#204620] text-white text-center text-lg font-semibold px-5 py-3">
          Edit Product
        </div>

        {/* BODY */}
        <div className="bg-gradient-to-r from-[#bb742e] to-[#c99b64] px-6 py-6 space-y-4">

          <form onSubmit={handleSubmitForm} className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              value={Data.name}
              name="name"
              onChange={handleChangeData}
              placeholder="Product Name"
              className="w-full px-3 py-2 rounded-md border bg-white outline-none focus:ring-2 focus:ring-black"
            />

            {/* IMAGE BOX */}
            <div className="bg-white border-2 border-dashed border-gray-400 rounded-md p-4 text-center">

              <input
                type="file"
                name="image"
                onChange={updateImage}
                className="text-sm"
              />

              {/* PREVIEW */}
              {Data.image && (
                <img
                  src={Data.image}
                  className="mt-3 w-full h-32 object-cover rounded-md"
                />
              )}

            </div>

            {/* PRICE */}
            <input
              type="number"
              value={Data.price}
              name="price"
              onChange={handleChangeData}
              placeholder="Price"
              className="w-full px-3 py-2 rounded-md border bg-white outline-none focus:ring-2 focus:ring-black"
            />

            {/* BUTTON */}
            <div className="flex gap-3">

  <button
    type="submit"
    className="w-full bg-[#1f3d2b] text-white py-2 rounded-md font-semibold hover:bg-[#2f5f42] transition"
  >
    Update
  </button>

  <button
    type="button"
    onClick={() => navigate("/cart")}
    className="w-full bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500 transition"
  >
    Cancel
  </button>

</div>

          </form>

        </div>

      </div>

    </div>

  </div>
);
}
export default UpdateProduct;
