const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  // console.log("amount received:", amount);

  const amountInPaise = Math.round(amount * 100);
  // console.log("amount sent to Razorpay (in paise):", amountInPaise);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: "receipt_order_" + Math.floor(Math.random() * 10000),
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (err) {
    // console.error("Razorpay order creation failed:", err);
    res.status(500).send("Failed to create Razorpay order");
  }
});

module.exports = router;
