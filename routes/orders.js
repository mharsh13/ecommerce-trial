const express = require("express");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const router = express.Router();
const Order = require("../models/order");

router.get("/orders", (req, res) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("orders.ejs", {
      path: "/orders",
      orders: orders,
    });
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
      var totalPrice = 0;
      user.cart.items.forEach((element) => {
        totalPrice = totalPrice + element.productId.price * element.quantity;
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: cartItems,
        totalPrice: totalPrice,
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

router.get("/orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then((order) => {
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoice", invoiceName);
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text("Invoice", {
      underline: true,
    });
    pdfDoc.text("-----------------------------------");
    var totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice = totalPrice + prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(
        prod.product.title +
          " - " +
          prod.quantity +
          " x " +
          " $ " +
          prod.product.price
      );
    });

    pdfDoc.text("-----------------------------------");
    pdfDoc.fontSize(22).text("Total Price:  " + totalPrice,{
      
    });
    pdfDoc.end();
  });
});

exports.router = router;
