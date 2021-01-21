const express = require('express');

const router = express.Router();
const productData = require("./addProducts");

var cartItems=[];
var totalPrice=0;

router.get('/cart', (req, res) => {
  res.render('cart.ejs',{path:"/cart",cartItems:cartItems,totalPrice:totalPrice});
});

router.post("/cart",function(req,res){
const prodId=req.body.productId;
const products = productData.products;
const product=products.find((p) => p.id===prodId);
const existingProduct=cartItems.find((p) => p.id===prodId);
if(existingProduct){
  product.quantity +=1;
}else{
  cartItems.push(product);
}

totalPrice=totalPrice+Number(product.price);

res.redirect("/products");

});


router.post("/remove",function(req,res){

const prodId=req.body.productId;
const products = productData.products;
const existingProduct=cartItems.find((p) => p.id===prodId);
totalPrice=totalPrice-(existingProduct.price*existingProduct.quantity);
existingProduct.quantity=1;
cartItems.pop(existingProduct);

res.redirect("/cart");
});



router.post("/editProduct", function (req, res) {
  const prodId = req.body.productId;
  const products = productData.products;
  const prodIndex= products.findIndex((p)=>p.id===prodId);

  var product={
    id: prodId,
    title: req.body.title,
    price: Number(req.body.price),
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    quantity: Number(req.body.quantity),
  };
  
  
  products[prodIndex]=product;

  products.forEach((element)=>element.quantity=1);

  cartItems=[];
  totalPrice=0;


  res.redirect("/products");

});


router.post("/delete", function (req, res) {
  const prodId = req.body.productId;
  const products = productData.products;
  const deleteProduct = products.find((p) => p.id === prodId);
  products.forEach((element)=>element.quantity=1);
  
  products.pop(deleteProduct);
  cartItems=[];
  totalPrice=0;
  res.redirect("/products");
});

exports.router = router;

