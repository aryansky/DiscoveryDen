const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

attractionSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // for (let review of doc.reviews) {
    //   await Review.findByIdAndDelete(review);
    // }
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Attraction", attractionSchema);
