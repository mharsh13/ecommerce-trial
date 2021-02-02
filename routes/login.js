const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("login.ejs", {
    path: "/login",
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      return res.redirect("/");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            res.redirect("/products");
          });
        }

        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

exports.router = router;
