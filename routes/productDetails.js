const express = require("express");

const router = express.Router();
const productData = require("./addProducts");

router.get("/products/:productId", (req, res) => {
  const prodId = req.params.productId;
  const products = productData.products;
  const product=products.find((p) => p.id===prodId);
res.render("productDetails.ejs", { path: "/products", product: product });
});

exports.router = router;
