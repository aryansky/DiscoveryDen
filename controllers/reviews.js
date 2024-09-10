const Review = require("../models/review.js");
const Attraction = require("../models/attraction.js");
const catchAsync = require("../utils/catchAsync");

module.exports.createReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const newReview = new Review(req.body.newReview);
  const attraction = await Attraction.findById(id);
  newReview.author = req.user._id;
  attraction.reviews.push(newReview);
  await newReview.save();
  await attraction.save();
  req.flash("success", `New review created!`);
  res.redirect(`/attractions/${attraction._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Attraction.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", `Review has been deleted!`);
  res.redirect(`/attractions/${id}`);
});
