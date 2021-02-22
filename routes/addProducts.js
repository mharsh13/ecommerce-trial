const express = require("express");

const router = express.Router();
var uniqid = require("uniqid");
const Product = require("../models/products");

router.get("/addProducts", (req, res) => {
  res.render("addProducts.ejs", {
    path: "/addProducts",
  });
});

router.post("/addProducts", function (req, res) {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product.save();

  res.redirect("/addProducts");
});

exports.router = router;
