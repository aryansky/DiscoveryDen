const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { spotSchema } = require("./schemas.js");
const mongoose = require("mongoose");
const Attraction = require("./models/attractions");
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

const validateSpot = function (req, res, next) {
  const { error } = spotSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.send(
    "Home page, jisko thoda sa edit kiya hai aur usme ye nayi line daali hai"
  );
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
    const site = await Attraction.findById(id);
    res.render("attractions/details", {
      site,
      pageTitle: `Details of ${site.name}`,
    });
  })
);

app.get(
  "/attractions/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Attraction.findById(id);
    res.render("attractions/edit", {
      site,
      pageTitle: `Edit ${site.name}`,
    });
  })
);

app.post(
  "/attractions",
  validateSpot,
  catchAsync(async (req, res) => {
    const { newSite } = req.body;
    const spot = new Attraction(newSite);
    await spot.save();
    res.redirect(`/attractions/${spot._id}`);
  })
);

app.put(
  "/attractions/:id",
  validateSpot,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { newSite } = req.body;
    await Attraction.findByIdAndUpdate(id, newSite);
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
