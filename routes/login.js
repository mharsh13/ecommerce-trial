const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer=require("nodemailer");
const sendgridTransport=require("nodemailer-sendgrid-transport");

const tranporter=nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}));

router.get("/", (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login.ejs", {
    path: "/login",
    errorMessage: message,
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid e-mail or password.");
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
        req.flash("error", "Invalid e-mail or password.");
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("error", "Invalid e-mail or password.");
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
