const express = require("express");
const router = express.Router();
const ProductModel = require("../Model/Product.js");
const Cart = require("../Model/Cart.js");


router.post("/products", async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).send({ message: "Product added successfully" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await ProductModel.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ error: "Error fetching products" });
  }
});

router.get("/products/id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({ error: "Error fetching product by ID" });
  }
});

router.put("/products/:id", async (req, res) => {
  const { name, price, image } = req.body;

  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true }
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Cart.updateMany(
      {
        productId: req.params.id,
      },
      { name, price }
    );

    res.status(200).json({message:"Product & Cart Updated",updateProduct});
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

module.exports = router;
