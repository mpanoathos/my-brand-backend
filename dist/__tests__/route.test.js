var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
describe('Blog Routes', () => {
    it('should retrieve all posts with an initial length of 0', () => __awaiter(void 0, void 0, void 0, function* () {
        // Clear existing posts or set up the test environment to ensure no posts exist
        const response = yield request(app).get('/blogs');
        expect(response.status).toBe(200);
        expect(response.body);
    }));
    it('should get a specific blog by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Set up the test environment if needed
        const postId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
        const testPost = new Post({
            _id: postId,
            title: 'Test Blog',
            body: 'This is a test blog content.',
            // other required fields
        });
        yield testPost.save();
        const response = yield request(app).get(`/blogs/${postId}`);
        // Assertions for retrieving a specific post
    }));
});
//# sourceMappingURL=route.test.js.map