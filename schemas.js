const Joi = require("joi");

module.exports.spotSchema = Joi.object({
  newSite: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string(),
  }).required(),
});
