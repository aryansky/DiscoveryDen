const Attraction = require("../models/attraction.js");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary/index.js");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

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
  //GEO
  const geoData = await maptilerClient.geocoding.forward(
    newAttraction.location,
    { limit: 1 }
  );
  const attraction = new Attraction(newAttraction);
  //GEO
  attraction.geometry = geoData.features[0].geometry;
  attraction.author = req.user._id;
  attraction.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await attraction.save();
  req.flash("success", "Created a new attration!");
  res.redirect(`/attractions/${attraction._id}`);
});

module.exports.updateAttraction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newAttraction } = req.body;
  const geoData = await maptilerClient.geocoding.forward(
    newAttraction.location,
    { limit: 1 }
  );
  const attraction = await Attraction.findByIdAndUpdate(id, newAttraction);
  attraction.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  attraction.images.push(...imgs);
  if (req.body.deleteImages && req.body.deleteImages.length > 0) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await attraction.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await attraction.save();
  req.flash("success", "All changes saved!");
  res.redirect(`/attractions/${id}`);
});

module.exports.deleteAttraction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const attraction = await Attraction.findByIdAndDelete(id);
  for (let image of attraction.images) {
    cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", `Deleted the ${attraction.name} attraction`);
  res.redirect("/attractions");
});
