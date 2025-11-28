const express = require("express");
const router = express.Router();
const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const { route } = require("./ProductRouter");

router.post("/", async (req, res) => {
  const { userId, productId, quantity } = req.body;
 
  try {
     const product = await Product.findById(productId);
  if (!product) {
    res.status(404).json({ message: "Product Not Found" });
  }

    let existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      return res
        .status(200)
        .json({ message: "Item already in Cart ", already: true });
    }

    const newItem = new Cart({
      userId,
      productId,
      name: product.name,
      price: product.price,
      quantity,
    });
    await newItem.save();
    res.status(201).json({ message: "Item added", item: newItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to add/update cart item" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate(
      "productId"
    );

    const formatted = cartItems.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.image,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    res.status(200).json({ items: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

router.delete("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    await Cart.findOneAndDelete({ userId, productId });
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

router.put("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity} = req.body;
  try {
    const updatedItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart Item" });
  }
});
module.exports = router;
