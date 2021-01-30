const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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
const User = require("./models/user");

app.use((req, res, next) => {
  User.findById("6015645af5dce816c08950b6").then((user) => {
    req.user = user;
    next();
  });
});

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

mongoose
  .connect(
    "mongodb+srv://harsh:drGTuQ2yUEBlM11p@cluster0.rctq1.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Harsh",
          email: "harsh@test.com",
          cart: [
            {
              items: [],
            },
          ],
        });
        user.save();
      }
    });
    app.listen(3000, function () {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
