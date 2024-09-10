const Attraction = require("./models/attraction.js");
const Review = require("./models/review.js");
const { attractionSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  } else {
    res.locals.returnTo = "/attractions";
  }
  next();
};

module.exports.validateAttraction = function (req, res, next) {
  const { error } = attractionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const foundAttraction = await Attraction.findById(id);
  if (!foundAttraction.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this");
    return res.redirect("/attractions");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const foundReview = await Review.findById(reviewId);
  if (!foundReview.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this");
    return res.redirect(`/attractions/${id}`);
  }
  next();
};

module.exports.validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", "Review validation error!");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
