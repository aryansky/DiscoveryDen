const mongoose = require("mongoose");
const indianCities = require("./indianCities.json");
const { descriptors, places, images } = require("./randomNames.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/discovery-den")
  .then(() => console.log("------- Mongoose Connected -------"))
  .catch((error) => handleError(error));

const Attraction = require("../models/attraction");
const Review = require("../models/review");

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Attraction.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const rndm = Math.floor(Math.random() * 3551);
    const location = new Attraction({
      author: "66dc327021cb7570464dec28",
      location: indianCities[rndm].name,
      name: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: sample(images),
          filename: "sampleFile",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [indianCities[rndm].lng, indianCities[rndm].lat],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro eaque dolor praesentium, tempora facere enim sapiente, vero blanditiis voluptatum aperiam excepturi debitis vitae veritatis perferendis, illum minima rerum placeat fuga.",
    });
    await location.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
