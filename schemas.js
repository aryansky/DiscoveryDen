const Joi = require("joi");

module.exports.attractionSchema = Joi.object({
  newAttraction: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    // image: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  newReview: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().max(5).min(1),
  }).required(),
});
