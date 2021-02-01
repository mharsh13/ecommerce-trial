const express = require("express");

const router = express.Router();
const Product = require("../models/products");

router.get("/cart", (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const cartItems = user.cart.items;
      var totalPrice = 0;
      cartItems.forEach((element) => {
        totalPrice = totalPrice + element.productId.price * element.quantity;
      });
      res.render("cart.ejs", {
        path: "/cart",
        cartItems: cartItems,
        totalPrice: totalPrice,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/cart", function (req, res) {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/products");
    });
});

router.post("/remove", function (req, res) {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then((result) => {
    res.redirect("/cart");
  });
});

exports.router = router;
