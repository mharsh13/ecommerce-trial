const express = require('express');

const router = express.Router();
const productData = require('./addProducts');

router.get('/products', (req, res) => {
  res.render('products.ejs',{path:"/products",products:productData.products});
});

exports.router = router;