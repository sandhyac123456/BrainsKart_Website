import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Register.css";
import axios from "axios";
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
      alert("Product updated successfully!");
      navigate("/cart");
    } catch (error) {
      alert("Failed to update product");
      console.error(error);
    }
  };

  return (
    <>
      <div className="head">
        <div className="text">
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            update Product
          </span>
        </div>
      </div>{" "}
      <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
        <div className="container">
          <div className="row" style={{ width: "500px" }}>
            <h4 className="heading">New Product</h4>
            <form className="dot" onSubmit={handleSubmitForm}>
              <div className="form-group mt-3">
                <input
                  type="text"
                  value={Data.name}
                  name="name"
                  onChange={handleChangeData}
                  className="form-control"
                  placeholder="Product Name"
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
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <input
                  type="number"
                  value={Data.price}
                  name="price"
                  onChange={handleChangeData}
                  className="form-control"
                  placeholder="Price"
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
export default UpdateProduct;
