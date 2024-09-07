const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const catchAsync = require("../utils/catchAsync.js");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register", { pageTitle: "User Registration" });
});

router.get("/login", (req, res) => {
  res.render("users/login", { pageTitle: "Log In" });
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const newUser = await User.register(user, password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to DiscoveryDen!");
        res.redirect("/attractions");
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/register");
    }
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res) => {
    req.flash("success", "Welcome Back");
    res.redirect("/attractions");
  })
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/attractions");
  });
});

module.exports = router;
