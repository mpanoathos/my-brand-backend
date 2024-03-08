var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// const adminLayout = '../views/layout/admin';
const jwtSecret = process.env.JWT_SECRET;
import { userSchema, postSchema } from '../helpers/validationScheme.js';
const router = express.Router();
// interface AuthRequest extends Request {
//   userId?: string;
// }
// // Check Login
// const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   const token = req.cookies.token;
//   if (!token) {
//     res.status(401).json({ message: 'Unauthorized' });
//   } else {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
//       req.userId = decoded.userId;
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   }
// };
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        console.log('Received Token:', token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, please Login" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
        console.log('Decoded Token:', decodedToken);
        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = yield User.findById(decodedToken.userId);
        if ((user === null || user === void 0 ? void 0 : user.userRole) === "admin") {
            req.user = user;
            next();
        }
        else {
            return res
                .status(401)
                .json({ message: "You are not allowed to perform this action" });
        }
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        else {
            return res.status(401).json({ message: "Unauthorized, please Login" });
        }
    }
});
// POST Admin-Check-Login Page
router.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        const validation = userSchema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: validation.error.details[0].message });
        }
        const user = yield User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Valid Credentials' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//Register users
router.post('/users/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input using Joi
        const validation = userSchema.validate({ email, password });
        if (validation.error) {
            return res.status(400).json({ message: validation.error.details[0].message });
        }
        console.log(validation.error);
        const hashedPassword = yield bcrypt.hash(password, 10);
        const user = yield User.create({ email, password: hashedPassword });
        res.status(201).json({ message: 'User Created', user });
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(409).json({ message: 'User already in use' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}));
// Get all Users
router.get('/users', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        res.json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// Update User by ID
router.put('/users/:userId', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { email, password, userRole } = req.body;
        const user = yield User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user fields
        user.email = email || user.email;
        user.password = password ? yield bcrypt.hash(password, 10) : user.password; // Hash the new password if provided
        user.userRole = userRole || user.userRole;
        // Save the updated user
        yield user.save();
        res.json({ message: 'User updated successfully', user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// Like a post
router.post('/blogs/:id/like', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
        if (post) {
            res.send({ data: post });
        }
        else {
            res.status(404).send('Post not found');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}));
// Get Likes for a Post
router.get('/blogs/:id/likes', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        // Retrieve the post by ID
        const post = yield Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Retrieve and send the like count for the post
        const likes = post.likes || 0; // Assuming likes property exists on the post schema
        res.json({ likes });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// Comment on a post
router.post('/blogs/:id/comment', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const { commentText } = req.body;
        const post = yield Post.findByIdAndUpdate(postId, { $push: { comments: { text: commentText } } }, { new: true });
        if (post) {
            res.json({ data: post });
        }
        else {
            res.status(404).send('Post not found');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}));
// Get Comments for a Post
router.get('/blogs/:id/comments', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        // Retrieve the post by ID
        const post = yield Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Retrieve and send the comments for the post
        const comments = post.comments || [];
        res.json({ comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//Create new Post
router.post('/blogs/post', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
            });
            const validationPost = postSchema.validate(newPost);
            if (validationPost.error) {
                return res.status(400).json({ message: validationPost.error.details[0].message });
            }
            yield Post.create(newPost);
            res.json(newPost);
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// Update Post Page
router.put('/blogs/post/:id', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required fields' });
        }
        const updatedPost = yield Post.findByIdAndUpdate(req.params.id, {
            title,
            body,
            updatedAt: Date.now(),
        });
        if (updatedPost) {
            res.json(updatedPost);
        }
        else {
            res.status(404).send('Post not found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// DELETE
router.delete('/blogs/post/:id', checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPost = yield Post.deleteOne({ _id: req.params.id });
        res.json(deletedPost);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}));
export default router;
//# sourceMappingURL=admin.js.map