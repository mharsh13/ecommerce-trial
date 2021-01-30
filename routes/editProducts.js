const express = require("express");

const router = express.Router();
const Product = require("../models/products");

router.get("/editProducts", (req, res) => {
  Product.find().then((products) => {
    res.render("editProducts.ejs", {
      path: "/editProducts",
      products: products,
    });
  });
});

router.get("/products/edit/:productId", (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    res.render("editProduct.ejs", { path: "/editProducts", product: product });
  });
});

router.post("/editProduct", function (req, res) {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedimageUrl = req.body.imageUrl;
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedimageUrl;
      return product.save();
    })
    .then((result) => {
      res.redirect("/products");
    });
});

router.post("/delete", function (req, res) {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId).then((result) => {
    res.redirect("/products");
  });
});

exports.router = router;
