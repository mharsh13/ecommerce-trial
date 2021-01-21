const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const home = require("./routes/home");
const products = require("./routes/products");
const addProducts = require("./routes/addProducts");
const editProducts = require("./routes/editProducts");
const orders = require("./routes/orders");
const cart = require("./routes/cart");
const productDetails = require("./routes/productDetails");

app.use(home.router);
app.use(products.router);
app.use(addProducts.router);
app.use(editProducts.router);
app.use(orders.router);
app.use(cart.router);
app.use(productDetails.router);



app.use((req, res, next) => {
  res.status(404).send("404");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
