const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { attractionSchema, reviewSchema } = require("./schemas.js");
const mongoose = require("mongoose");
const Attraction = require("./models/attractions");
const Review = require("./models/reviews.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

mongoose
  .connect("mongodb://127.0.0.1:27017/discovery-den")
  .then(() => console.log("------- Mongoose Connected -------"))
  .catch((error) => handleError(error));

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateAttraction = function (req, res, next) {
  const { error } = attractionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home", { pageTitle: "DiscoveryDen Home" });
});

app.get("/attractions", async (req, res) => {
  const attractions = await Attraction.find({});
  res.render("attractions/index", {
    attractions,
    pageTitle: "Discover Places",
  });
});

app.get("/attractions/new", (req, res) => {
  res.render("attractions/new", { pageTitle: "Create New Spot" });
});

app.get(
  "/error",
  catchAsync(async (req, res, next) => {
    throw new Error("WOHOOHOHOHOOOOOOOOOOOOOOOOOOOOOOOOOOOO ERRROR");
  })
);

app.get(
  "/attractions/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id).populate("reviews");
    res.render("attractions/details", {
      attraction,
      pageTitle: `Details of ${attraction.name}`,
    });
  })
);

app.get(
  "/attractions/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id);
    res.render("attractions/edit", {
      attraction,
      pageTitle: `Edit ${attraction.name}`,
    });
  })
);

app.post(
  "/attractions",
  validateAttraction,
  catchAsync(async (req, res) => {
    const { newAttraction } = req.body;
    const attraction = new Attraction(newAttraction);
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`);
  })
);

app.put(
  "/attractions/:id",
  validateAttraction,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { newAttraction } = req.body;
    await Attraction.findByIdAndUpdate(id, newAttraction);
    res.redirect(`/attractions/${id}`);
  })
);

app.delete(
  "/attractions/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Attraction.findByIdAndDelete(id);
    res.redirect("/attractions");
  })
);

app.post(
  "/attractions/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.newReview);
    const attraction = await Attraction.findById(id);
    attraction.reviews.push(newReview);
    await newReview.save();
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`);
  })
);

app.delete(
  "/attractions/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/attractions/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong";
  res.status(statusCode).render("error", { err, pageTitle: "Error Page" });
});

app.listen(3000, () => {
  console.log("---------- Server started on port 3000 ----------");
});
