const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
dotenv.config();
const useRouter = require("./Router/ProductRouter");
const CartRouter = require("./Router/CartRouter");
const OrderRouter = require("./Router/OrderRouter");
const PaymentRouter = require("./Router/PaymentRouter");
const authRoutes = require("./Router/authRoutes");
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", useRouter);

app.use("/api/cart", CartRouter);

app.use("/api/orders", OrderRouter);

app.use("/api/razorpay", PaymentRouter);

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongoDb connection successfully !");
  })
  .catch(() => {
    console.log("mongoDb connection faild !");
  });

let HOSTNAME = process.env.HOSTNAME;
let PORT = process.env.PORT;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is listening on port http://${HOSTNAME}:${PORT}`);
});

