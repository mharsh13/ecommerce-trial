const express = require("express");

const router = express.Router();
const productData = require("./addProducts");


router.get("/editProducts", (req, res) => {
  res.render("editProducts.ejs", {
    path: "/editProducts",
    products: productData.products,
  });
});


router.get("/products/edit/:productId", (req, res) => {
  const prodId = req.params.productId;
  const products = productData.products;
  const product = products.find((p) => p.id === prodId);
  res.render("editProduct.ejs", { path: "/editProducts", product: product });
});


exports.router = router;
