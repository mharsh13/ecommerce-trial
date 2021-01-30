const express = require("express");

const router = express.Router();
const Product = require("../models/products");

router.get("/products/:productId", (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    res.render("productDetails.ejs", { path: "/products", product: product });
  });
});

exports.router = router;
