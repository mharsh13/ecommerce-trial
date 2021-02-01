const express = require("express");

const router = express.Router();
const Order = require("../models/order");

router.get("/orders", (req, res) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("orders.ejs", { path: "/orders", orders: orders});
  });
});

router.post("/orders", (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const cartItems = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: cartItems,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    });
});

exports.router = router;
