const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Attraction = require("../models/attraction.js");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isReviewAuthor,
  validateReview,
} = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.newReview);
    const attraction = await Attraction.findById(id);
    newReview.author = req.user._id;
    attraction.reviews.push(newReview);
    await newReview.save();
    await attraction.save();
    req.flash("success", `New review created!`);
    res.redirect(`/attractions/${attraction._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", `Review has been deleted!`);
    res.redirect(`/attractions/${id}`);
  })
);

module.exports = router;
