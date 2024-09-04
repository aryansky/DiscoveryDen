const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attractionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    default: ".....",
  },
  location: {
    type: String,
  },
});

module.exports = mongoose.model("Attraction", attractionSchema);
