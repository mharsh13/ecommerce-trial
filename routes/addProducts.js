const express = require("express");

const router = express.Router();
var uniqid = require('uniqid');

const products = [];

router.get("/addProducts", (req, res) => {
  res.render("addProducts.ejs", { path: "/addProducts" });
});

router.post("/addProducts", function (req, res) {
  
var product = {
    id: uniqid(),
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    quantity: 1,
};

products.push(product);

res.redirect("/products");


});

exports.router = router;
exports.products = products;
