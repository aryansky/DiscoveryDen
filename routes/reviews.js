const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError");
const Attraction = require("../models/attraction.js");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schemas.js");

const validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", "Review validation error!");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.newReview);
    const attraction = await Attraction.findById(id);
    attraction.reviews.push(newReview);
    await newReview.save();
    await attraction.save();
    req.flash("success", `New review created!`);
    res.redirect(`/attractions/${attraction._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", `Review has been deleted!`);
    res.redirect(`/attractions/${id}`);
  })
);

module.exports = router;
