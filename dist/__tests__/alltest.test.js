var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
User;
import request from 'supertest';
import express from 'express';
import router from '../routes/route.js';
import mongoose from 'mongoose'; // Import mongoose to connect to a test database
import bcrypt from 'bcrypt';
import User from '../models/User.js';
const app = express();
app.use(express.json());
app.use('/', router);
jest.mock('jsonwebtoken');
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connect('mongodb+srv://athos:barera0009@cluster0.myuobr9.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');
}));
// Clear the test database after all tests are done
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connection.close();
}));
describe('GET /blogs', () => {
    test('should get all blogs', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get('/blogs');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    test('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the Post.find method to simulate an error
        jest.spyOn(router, 'find').mockImplementationOnce(() => {
            throw new Error('Some error');
        });
        const response = yield request(app).get('/blogs');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    }));
});
describe('GET /blogs/:id', () => {
    test('should get a single blog by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a valid ID in your database
        const postId = 'valid-post-id';
        const response = yield request(app).get(`/blogs/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', postId);
    }));
    test('should handle not found case', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have an invalid ID in your database
        const invalidPostId = 'invalid-post-id';
        const response = yield request(app).get(`/blogs/${invalidPostId}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe('Blog not found');
    }));
    test('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the Post.findById method to simulate an error
        jest.spyOn(router, 'findById').mockImplementationOnce(() => {
            throw new Error('Some error');
        });
        const response = yield request(app).get('/blogs/some-id');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    }));
});
// Helper function to create a user for testing
const createTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield bcrypt.hash('testpassword', 10);
    return User.create({ email: 'test@example.com', password, userRole: 'admin' });
});
describe('POST /users/login', () => {
    test('should log in a user and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createTestUser();
        const response = yield request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'testpassword' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    }));
    test('should handle invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/login')
            .send({ email: 'nonexistent@example.com', password: 'invalidpassword' });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    }));
});
const PORT = 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
}
export default app;
//# sourceMappingURL=alltest.test.js.map