const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const login = require("./routes/login");
const signUp = require("./routes/signup");
const products = require("./routes/products");
const addProducts = require("./routes/addProducts");
const editProducts = require("./routes/editProducts");
const orders = require("./routes/orders");
const cart = require("./routes/cart");
const productDetails = require("./routes/productDetails");
const resetPassword = require("./routes/resetPassword");
const updatePassword = require("./routes/updatePassword");
const User = require("./models/user");
const isAuth = require("./middleware/is-auth");
const { check, body } = require("express-validator");

const MONGODB_URI =
  "mongodb+srv://harsh:drGTuQ2yUEBlM11p@cluster0.rctq1.mongodb.net/shop";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(login.router);
app.use(
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User already exists");
          }
        });
      }),
    body(
      "password",
      "Please enter a password with atleast 6 characters and only text and numbers"
    )
      .isLength({ min: 6 })
      .isAlphanumeric(),
  ],
  signUp.router
);
app.use(resetPassword.router);
app.use(updatePassword.router);
app.use(isAuth, products.router);
app.use(isAuth, addProducts.router);
app.use(isAuth, editProducts.router);
app.use(isAuth, orders.router);
app.use(isAuth, cart.router);
app.use(isAuth, productDetails.router);

app.use((req, res, next) => {
  res.status(404).send("404");
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000, function () {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
