const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const tranporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

router.get("/signup", (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("signup.ejs", {
    path: "/signup",
    errorMessage: message,
  });
});

router.post("/signup", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("signup.ejs", {
      path: "/signup",
      errorMessage: error.array()[0].msg,
    });
  }
  bcrypt
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
          tranporter.sendMail({
            to: email,
            from: "mharsh13dec@gmail.com",
            subject: "SignUp Succeeded",
            html: "<h1>You successfully signed up!</h1>",
          });
          res.redirect("/products");
        });
      });
    });
});

exports.router = router;
