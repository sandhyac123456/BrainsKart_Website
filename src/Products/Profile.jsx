import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API = import.meta.env.VITE_API_URL;

function Profile() {
  const [address, setAddress] = useState(null);
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Please login to see your profile.
      </div>
    );
  }

  const fetchAddress = async () => {
    try {
      const res = await axios.get(
        `${API}/api/orders/user-address-email/${encodeURIComponent(user.email)}`
      );
      setAddress(res.data);
    } catch (error) {
      setAddress(null);
    }
  };

  useEffect(() => {
    if (user?.email) fetchAddress();
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#e9e4dc]">

  {/* HEADER (NAVBAR SE CONNECTED) */}
  <div className="bg-gradient-to-r from-[#a86a2b] to-[#c99b64] py-3 shadow-md">
    <h2 className="text-center text-2xl font-bold text-white tracking-wide">
      Your Profile
    </h2>
  </div>

  {/* MAIN */}
  <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-6">

    {/* LEFT CARD */}
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition">

      <img
        src={user.image}
        alt="Profile"
        className="w-36 h-36 rounded-full object-cover border-4 border-[#c99b64] shadow-md"
      />

      <h3 className="mt-4 text-xl font-bold text-gray-800">
        {user.username}
      </h3>

      <p className="text-gray-500 text-sm">{user.email}</p>

      {/* OPTIONAL BUTTON */}
      <button className="mt-4 px-4 py-2 bg-gradient-to-r from-[#a86a2b] to-[#c99b64] text-white rounded-lg text-sm hover:scale-105 transition">
        Edit Profile
      </button>

    </div>

    {/* RIGHT SIDE */}
    <div className="md:col-span-2 flex flex-col gap-6">

      {/* USER INFO */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-[#f3c894] px-4 py-3 font-semibold text-lg">
          Your Information
        </div>

        <div className="divide-y">

          <div className="p-4 flex justify-between">
            <span className="font-medium text-gray-600">Name</span>
            <span className="font-semibold">{user.username}</span>
          </div>

          <div className="p-4 flex justify-between">
            <span className="font-medium text-gray-600">Email</span>
            <span className="font-semibold">{user.email}</span>
          </div>

        </div>
      </div>

      {/* ADDRESS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-[#f3c894] px-4 py-3 font-semibold text-lg">
          Billing Address
        </div>

        {address ? (
          <div className="grid sm:grid-cols-2 gap-4 p-4 text-sm">

            <p><b>House No:</b> {address.hno}</p>
            <p><b>Street:</b> {address.street}</p>
            <p><b>Landmark:</b> {address.landmark}</p>
            <p><b>City:</b> {address.city}</p>
            <p><b>State:</b> {address.state}</p>
            <p><b>Country:</b> {address.country}</p>
            <p><b>Pincode:</b> {address.pincode}</p>
            <p><b>Mobile:</b> {address.mobile}</p>

          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 font-medium">
            No billing address found.
          </div>
        )}

      </div>

    </div>

  </div>
</div>
  );
}

export default Profile;