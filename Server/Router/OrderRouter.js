const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");

router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order Placed Successfully !" });
  } catch (err) {
    res.status(500).json({ error: "Failed to Save order", err });
  }
});

router.get("/user-address-email/:email", async (req, res) => {
  const email = req.params.email;  

  try {
    const Orders = await Order.find({ "address.email": email }).sort({ createdAt: -1 });
    const order = Orders[0];
    if (order) {
      res.json(order.address);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address", error });
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({
    createdAt: 1,
  });
  res.json(orders);
});

router.get("/today", async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const todayOrders = await Order.find({ createdAt: { $gte: start, $lte: end } }).sort({
    createdAt: 1,
  });

  res.json(todayOrders);
});

router.post("/range", async (req, res) => {
  const { startDate, endDate } = req.body;
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });
  res.json(orders);
});

router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const deleteOrder = await Order.findByIdAndDelete(orderId);
    if (!deleteOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order Delete Successfully !" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/latest-order/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

   
    const latestOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestOrder) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(latestOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info", error: err });
  }
});

router.put("/update-payment-status/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment status", error: err.message });
  }
});

module.exports = router;
