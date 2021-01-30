const express = require("express");

const router = express.Router();
const Product = require("../models/products");

var cartItems = [];
var totalPrice = 0;

router.get("/cart", (req, res) => {
  res.render("cart.ejs", {
    path: "/cart",
    cartItems: cartItems,
    totalPrice: totalPrice,
  });
});

router.post("/cart", function (req, res) {
  const prodId = req.body.productId;
  const products = productData.products;
  const product = products.find((p) => p.id === prodId);
  const existingProduct = cartItems.find((p) => p.id === prodId);
  if (existingProduct) {
    product.quantity += 1;
  } else {
    cartItems.push(product);
  }

  totalPrice = totalPrice + Number(product.price);

  res.redirect("/products");
});

router.post("/remove", function (req, res) {
  const prodId = req.body.productId;
  const products = productData.products;
  const existingProduct = cartItems.find((p) => p.id === prodId);
  totalPrice = totalPrice - existingProduct.price * existingProduct.quantity;
  existingProduct.quantity = 1;
  cartItems.pop(existingProduct);

  res.redirect("/cart");
});


exports.router = router;
