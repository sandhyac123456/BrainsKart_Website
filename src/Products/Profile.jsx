import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
 const API = import.meta.env.VITE_API_URL ;

function Profile() {
  const [address, setAddress] = useState(null);

 const user = useSelector((state) => state.auth.user);
  //  console.log("user is", user); 

  //  console.log("User image is", user?.image);

  
    if (!user) {
      return <p>Please login to see your profile.</p>;
    }  
  const fetchAddress = async () => {
    try {
      // console.log("user")

      const res = await axios.get(
        `${API}/api/orders/user-address-email/${user.email}`
      );
   
      setAddress(res.data);
    } catch (error) {
      console.error(
        "Error fetching address:",
        error.res?.data || error.message || error
      );
    }
  };
  useEffect(() => {
   

    if (user?.email) {
      fetchAddress();
    }
  }, [user?.email]);

  return (
    <>
      <div className="head">
        <div className="text">
          <i className="fa-solid fa-circle-user"></i>
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
            Your Profile
          </span>
        </div>
      </div>

      <div
        className="profile-container"
        style={{ display: "flex", gap: "20px", padding: "20px" }}
      >
        <div
          className="left-section"
          style={{ flex: 1, marginLeft: "70px", marginTop: "20px" }}
        >
          <div>
            <img
             src={`${API}/uploads/${user.image}`}
              alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid black",
              }}
            />
          </div>
        </div>

        <div
          className="right-section"
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            marginRight: "100px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background:
                "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
            }}
          >
            <h3 style={{ color: "rgb(243, 200, 148)" }}> Your Information</h3>
          </div>
          <div style={{ background: "rgb(243, 200, 148)", padding: "20px" }}>
            <div
              style={{
                background: "white",
                padding: "10px",
                borderBottom: "1px solid gray",
              }}
            >
              <strong>Name : </strong>
              {user.username}
            </div>
            <div
              style={{
                background: "white",
                padding: "10px",
                borderBottom: "1px solid gray",
              }}
            >
              <strong>Email : </strong>
              {user.email}
            </div>
          </div>

          <div className="billing-section" style={{ marginTop: "20px" }}>
            <div className="billing-section" style={{ marginTop: "20px" }}>
              <div
                style={{
                  padding: "20px",
                  background:
                    "linear-gradient(to right, #030F03 0%, #155715 50%,rgb(32, 70, 32) 100%)",
                }}
              >
                <h3 style={{ color: "rgb(243, 200, 148)" }}>Billing Address</h3>
              </div>

              {address ? (
                <div
                  style={{ background: "rgb(243, 200, 148)", padding: "20px" }}
                >
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>House No:</strong> {address.hno}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>Street:</strong> {address.street}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>Landmark:</strong> {address.landmark}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>City:</strong> {address.city}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>State:</strong> {address.state}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>Country:</strong> {address.country}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>Pincode:</strong> {address.pincode}
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <strong>Mobile:</strong> {address.mobile}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgb(243, 200, 148)",
                    padding: "20px",
                    color: "black",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  No billing address found. Please complete your first order to
                  see address details here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;




