const express = require("express");

const router = express.Router();
const Product = require("../models/products");

router.get("/products", (req, res) => {
  Product.find().then((products) => {
    res.render("products.ejs", { path: "/products", products: products });
  });
});

exports.router = router;
