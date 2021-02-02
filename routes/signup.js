const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("signup.ejs", {
    path: "/signup",
  });
});

router.post("/signup", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect("/");
    }
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          cart: { item: [] },
        });
        return user.save();
      })
      .then((result) => {
        User.findOne({ email: email }).then((user) => {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            res.redirect("/products");
          });
        });
      });
  });
});

exports.router = router;
