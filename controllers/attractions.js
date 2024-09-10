const Attraction = require("../models/attraction.js");
const catchAsync = require("../utils/catchAsync");

module.exports.index = catchAsync(async (req, res) => {
  const attractions = await Attraction.find({});
  res.render("attractions/index", {
    attractions,
    pageTitle: "Discover Places",
  });
});

module.exports.newForm = (req, res) => {
  res.render("attractions/new", { pageTitle: "Create New Spot" });
};

module.exports.detailsPage = catchAsync(async (req, res) => {
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
});

module.exports.editPage = catchAsync(async (req, res) => {
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
});

module.exports.createAttraction = catchAsync(async (req, res) => {
  const { newAttraction } = req.body;
  const attraction = new Attraction(newAttraction);
  attraction.author = req.user._id;
  await attraction.save();
  req.flash("success", "Created a new attration!");
  res.redirect(`/attractions/${attraction._id}`);
});

module.exports.updateAttraction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newAttraction } = req.body;
  await Attraction.findByIdAndUpdate(id, newAttraction);
  req.flash("success", "All changes saved!");
  res.redirect(`/attractions/${id}`);
});

module.exports.deleteAttraction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const attraction = await Attraction.findByIdAndDelete(id);
  req.flash("success", `Deleted the ${attraction.name} attraction`);
  res.redirect("/attractions");
});
