const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const tranporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

router.get("/reset", (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("resetPassword.ejs", {
    path: "/reset",
    errorMessage: message,
  });
});

router.post("/reset", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    } else {
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email })
        .then((user) => {
          if (!user) {
            req.flash("error", "User does not exist.");
            res.redirect("/reset");
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then((result) => {
          res.redirect("/");
          tranporter.sendMail({
            to: req.body.email,
            from: "mharsh13dec@gmail.com",
            subject: "Reset Password",
            html: `<h1>You successfully signed up!</h1>
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new Password. </p>
            `,
          });
        });
    }
  });
});

exports.router = router;
