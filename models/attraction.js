const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// https://res.cloudinary.com/detypqg62/image/upload/h_180/v1726127891/DiscoveryDen/cvulrvfjugd6qrzema0r.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const AttractionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  images: [ImageSchema],
  description: {
    type: String,
    default: ".....",
  },
  location: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/h_180");
});

AttractionSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Attraction", AttractionSchema);
