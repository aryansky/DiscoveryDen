const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.attractionSchema = Joi.object({
  newAttraction: Joi.object({
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  newReview: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().max(5).min(1),
  }).required(),
});
