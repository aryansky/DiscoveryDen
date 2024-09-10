const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users.js");
const { storeReturnTo } = require("../middleware.js");

router.route("/register").get(users.registerPage).post(users.createNewUser);

router
  .route("/login")
  .get(users.loginPage)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.logoutUser);

module.exports = router;
