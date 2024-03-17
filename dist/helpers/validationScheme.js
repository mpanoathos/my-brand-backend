"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = exports.postSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// User validations
const userSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    userRole: joi_1.default.string(),
    password: joi_1.default.string().min(8).required(),
});
exports.userSchema = userSchema;
// Blogs validations
const postSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    body: joi_1.default.string().required(),
    image: joi_1.default.string(),
}).options({ allowUnknown: true, stripUnknown: true });
exports.postSchema = postSchema;
//Message Validations
const messageSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    message: joi_1.default.string().required(),
}).options({ allowUnknown: true, stripUnknown: true });
exports.messageSchema = messageSchema;
//# sourceMappingURL=validationScheme.js.map