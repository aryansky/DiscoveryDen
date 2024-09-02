const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Attraction = require("./models/attractions");

mongoose
  .connect("mongodb://127.0.0.1:27017/discovery-den")
  .then(() => console.log("------- Mongoose Connected -------"))
  .catch((error) => handleError(error));

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Welcome");
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

app.get("/attractions/:id", async (req, res) => {
  const { id } = req.params;
  const site = await Attraction.findById(id);
  res.render("attractions/details", {
    site,
    pageTitle: `Details of ${site.name}`,
  });
});

app.get("/attractions/:id/edit", async (req, res) => {
  const { id } = req.params;
  const site = await Attraction.findById(id);
  res.render("attractions/edit", {
    site,
    pageTitle: `Edit ${site.name}`,
  });
});

app.post("/attractions", async (req, res) => {
  const { newSite } = req.body;
  const spot = new Attraction(newSite);
  await spot.save();
  res.redirect(`/attractions/${spot._id}`);
});

app.put("/attractions/:id", async (req, res) => {
  const { id } = req.params;
  const { newSite } = req.body;
  await Attraction.findByIdAndUpdate(id, newSite);
  res.redirect(`/attractions/${id}`);
});

app.delete("/attractions/:id", async (req, res) => {
  const { id } = req.params;
  await Attraction.findByIdAndDelete(id);
  res.redirect("/attractions");
});

app.listen(3000, () => {
  console.log("---------- Server started on port 3000 ----------");
});
