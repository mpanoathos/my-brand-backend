import Joi from 'joi';

// User validations
const userSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

// Blogs validations
const postSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

export {
  userSchema,
  postSchema
};
