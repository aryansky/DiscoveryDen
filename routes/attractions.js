const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const Attraction = require("../models/attractions");
const catchAsync = require("../utils/catchAsync");
const { attractionSchema } = require("../schemas.js");

const validateAttraction = function (req, res, next) {
  const { error } = attractionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  const attractions = await Attraction.find({});
  res.render("attractions/index", {
    attractions,
    pageTitle: "Discover Places",
  });
});

router.get("/new", (req, res) => {
  res.render("attractions/new", { pageTitle: "Create New Spot" });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id).populate("reviews");
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
  validateAttraction,
  catchAsync(async (req, res) => {
    const { newAttraction } = req.body;
    const attraction = new Attraction(newAttraction);
    await attraction.save();
    req.flash("success", "Created a new attration!");
    res.redirect(`/attractions/${attraction._id}`);
  })
);

router.put(
  "/:id",
  validateAttraction,
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findByIdAndDelete(id);
    req.flash("success", `Deleted the ${attraction.name} attraction`);
    res.redirect("/attractions");
  })
);

module.exports = router;
