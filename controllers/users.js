const User = require("../models/user.js");
const catchAsync = require("../utils/catchAsync.js");

module.exports.registerPage = (req, res) => {
  res.render("users/register", { pageTitle: "User Registration" });
};

module.exports.loginPage = (req, res) => {
  res.render("users/login", { pageTitle: "Log In" });
};

module.exports.createNewUser = catchAsync(async (req, res, next) => {
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
});

module.exports.loginUser = catchAsync(async (req, res) => {
  req.flash("success", "Welcome Back");
  res.redirect(res.locals.returnTo);
});

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/attractions");
  });
};
