const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  isAuthor,
  validateAttraction,
} = require("../middleware.js");
const attractions = require("../controllers/attractions.js");
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
const upload = multer({ storage });

router
  .route("/")
  .get(attractions.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateAttraction,
    attractions.createAttraction
  );

router.get("/new", isLoggedIn, attractions.newForm);

router
  .route("/:id")
  .get(attractions.detailsPage)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateAttraction,
    attractions.updateAttraction
  )
  .delete(isLoggedIn, isAuthor, attractions.deleteAttraction);

router.get("/:id/edit", isLoggedIn, isAuthor, attractions.editPage);

module.exports = router;
