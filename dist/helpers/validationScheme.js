import Joi from 'joi';
// User validations
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    userRole: Joi.string(),
    password: Joi.string().min(8).required(),
});
// Blogs validations
const postSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    image: Joi.string(),
}).options({ allowUnknown: true, stripUnknown: true });
//Message Validations
const messageSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
}).options({ allowUnknown: true, stripUnknown: true });
export { userSchema, postSchema, messageSchema, };
//# sourceMappingURL=validationScheme.js.map