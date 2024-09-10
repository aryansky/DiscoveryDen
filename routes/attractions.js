const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isAuthor,
  validateAttraction,
} = require("../middleware.js");
const attractions = require("../controllers/attractions.js");

router
  .route("/")
  .get(attractions.index)
  .post(isLoggedIn, validateAttraction, attractions.createAttraction);

router.get("/new", isLoggedIn, attractions.newForm);

router
  .route("/:id")
  .get(attractions.detailsPage)
  .put(
    isLoggedIn,
    validateAttraction,
    catchAsync(isAuthor),
    attractions.updateAttraction
  )
  .delete(isLoggedIn, catchAsync(isAuthor), attractions.deleteAttraction);

router.get("/:id/edit", isLoggedIn, catchAsync(isAuthor), attractions.editPage);

module.exports = router;
