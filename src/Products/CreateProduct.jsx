import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Register.css";
const API = import.meta.env.VITE_API_URL ;

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    category: "",
  });

  let updateImage = async (event) => {
    let imageFile = event.target.files[0];
    let base64Image = await convertBase64String(imageFile);
    setFormData({
      ...formData,
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
  const navigate = useNavigate();
  const { category } = useParams(); 

  useEffect(() => {
    if (category) {
      const capitalized =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      setFormData((prev) => ({ ...prev, category: capitalized }));
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/api/products`, formData);
      alert("Product added successfully!");

      const lower = formData.category.toLowerCase();
      if (lower === "men") navigate("/mens");
      else if (lower === "women") navigate("/womens");
      else if (lower === "kids") navigate("/kids");
    } catch (error) {
      alert("Failed to add product");
      console.error(error);
    }
  };

  return (
    <>
      <div className="head">
        <div className="text">
          <span style={{ marginLeft: "8px",fontWeight:"bold" }}>Create Product</span>
        </div>
      </div>

      <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
        <div className="container">
          <div className="row" style={{ width: "500px" }}>
            <h4 className="heading">New Product</h4>
            <form className="dot" onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <select style={{boxShadow:"none"}}
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">-- Select Category --</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
              </div>
              
              <div className="form-group mt-3">
                <input
                  type="text"
                  value={formData.name}
                  name="name"
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Product Name"
                  required
                />
              </div>
              <div className="form-group mt-3">
                <div className="custom-file">
                  <input
                    type="file"
                    name="image"
                    onChange={updateImage}
                    className="custom-file-input form-control"
                    id="inputGroupFile01"
                    required
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <input
                  type="number"
                  value={formData.price}
                  name="price"
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Price"
                  required
                />
              </div>
              
              <div className="form-group mt-3">
                <input type="submit" value="submit" className="create-btn1" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProduct;
