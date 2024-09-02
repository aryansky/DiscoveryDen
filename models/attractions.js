const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attractionSchema = new Schema({
  name: {
    type: String,
    required: false,
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
