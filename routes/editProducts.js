const express = require('express');

const router = express.Router();


router.get('/editProducts', (req, res) => {
  res.render('editProducts.ejs',{path:"/editProducts"});
});

exports.router = router;