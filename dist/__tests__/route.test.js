"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Assuming your Express app is exported from app.js or app.ts
const Post_1 = __importDefault(require("../models/Post")); // Import the Post model
const http_1 = require("http");
let server;
beforeAll((done) => {
    server = (0, http_1.createServer)(app_1.default);
    server.listen(9000, done);
});
describe('Blog Routes', () => {
    test('GET /blogs should return all blog posts', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/blogs');
        expect(response.status).toBe(200);
        // Add more expectations based on your response
    }));
    test('GET /blogs/:id should return a specific blog post', () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = '65f33e6a5124fd0f1032491b'; // Provide an existing post ID for testing
        const response = yield (0, supertest_1.default)(app_1.default).get(`/blogs/${postId}`);
        expect(response.status).toBe(200);
        // Add more expectations based on your response
    }));
    test('GET /blogs/:id should return 404 if blog post not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentPostId = '65f33e6a5124fd0f1032491z'; // Provide a non-existent post ID for testing
        const response = yield (0, supertest_1.default)(app_1.default).get(`/blogs/${'65f33e6a5124fd0f1032491z'}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe('Blog not found');
        // Add more expectations based on your response
    }));
    // New test case to cover line 10-12
    test('GET /blogs should return 500 if an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking the behavior of Post.find() to throw an error
        jest.spyOn(Post_1.default, 'find').mockImplementationOnce(() => {
            throw new Error('Mocked error');
        });
        const response = yield (0, supertest_1.default)(app_1.default).get('/blogs');
        expect(response.status).toBe(500);
        // Add more expectations based on your response
    }));
    // New test case to cover line 21
    test('GET /blogs/:id should return 500 if an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking the behavior of Post.findById() to throw an error
        jest.spyOn(Post_1.default, 'findById').mockImplementationOnce(() => {
            throw new Error('Mocked error');
        });
        const postId = '65f33e6a5124fd0f1032491b'; // Provide an existing post ID for testing
        const response = yield (0, supertest_1.default)(app_1.default).get(`/blogs/${postId}`);
        expect(response.status).toBe(500);
        // Add more expectations based on your response
    }));
    // Add more test cases for other routes as needed
});
//# sourceMappingURL=route.test.js.map