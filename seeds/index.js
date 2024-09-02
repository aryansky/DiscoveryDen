const mongoose = require("mongoose");
const indianCities = require("./indianCities.json");
const { descriptors, places } = require("./randomNames.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/discovery-den")
  .then(() => console.log("------- Mongoose Connected -------"))
  .catch((error) => handleError(error));

const Attraction = require("../models/attractions");

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Attraction.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rndm = Math.floor(Math.random() * 3551);
    const location = new Attraction({
      location: indianCities[rndm].name,
      name: `${sample(descriptors)} ${sample(places)}`,
      image: "https://picsum.photos/700/400",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro eaque dolor praesentium, tempora facere enim sapiente, vero blanditiis voluptatum aperiam excepturi debitis vitae veritatis perferendis, illum minima rerum placeat fuga.",
    });
    await location.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
