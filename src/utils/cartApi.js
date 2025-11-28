import axios from "axios";
const API = import.meta.env.VITE_API_URL ;

export const addToCart = async (userId, item) => {
  try {
    const res = await axios.post(`${API}/api/cart`, {
      userId,
      product:item,
    });
    return res.data;
  } catch (error) {
    console.log("Add to cart error", error);
  }
};

export const getCart = async (userId) => {
  try {
    const res = await axios.get(`${API}/${userId}`);
    return res.data;
  } catch (error) {
    console.log("Get cart error", error);
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const res = await axios.delete(
      `${API}/api/cart/remove/${userId}/${productId}`
    );
    return res.data;
  } catch (error) {
    console.log("Remove from cart error", error);
  }
};

export const updateQuantity = async (userId, productId, quantity) => {
  try {
    const res = await axios.put(`${API}/api/cart/update/${userId}`, {
      productId,
      quantity,
    });
    return res.data;
  } catch (error) {
    console.log("Update quantity error", error);
  }
};