const express = require("express");
const router = express.Router();
const Attraction = require("../models/attraction.js");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isAuthor,
  validateAttraction,
} = require("../middleware.js");

router.get("/", async (req, res) => {
  const attractions = await Attraction.find({});
  res.render("attractions/index", {
    attractions,
    pageTitle: "Discover Places",
  });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("attractions/new", { pageTitle: "Create New Spot" });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!attraction) {
      req.flash("error", "We could not find that attraction!");
      res.redirect("/attractions");
    } else {
      res.render("attractions/details", {
        attraction,
        pageTitle: `Details of ${attraction.name}`,
      });
    }
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(isAuthor),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id);
    if (!attraction) {
      req.flash("error", "We could not find that attraction!");
      res.redirect("/attractions");
    } else {
      res.render("attractions/edit", {
        attraction,
        pageTitle: `Edit ${attraction.name}`,
      });
    }
  })
);

router.post(
  "/",
  isLoggedIn,
  validateAttraction,
  catchAsync(async (req, res) => {
    const { newAttraction } = req.body;
    const attraction = new Attraction(newAttraction);
    attraction.author = req.user._id;
    await attraction.save();
    req.flash("success", "Created a new attration!");
    res.redirect(`/attractions/${attraction._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateAttraction,
  catchAsync(isAuthor),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { newAttraction } = req.body;
    await Attraction.findByIdAndUpdate(id, newAttraction);
    req.flash("success", "All changes saved!");
    res.redirect(`/attractions/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(isAuthor),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findByIdAndDelete(id);
    req.flash("success", `Deleted the ${attraction.name} attraction`);
    res.redirect("/attractions");
  })
);

module.exports = router;
