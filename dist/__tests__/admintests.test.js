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
import express from 'express';
import router from '../routes/admin.js';
import mongoose from 'mongoose'; // Import mongoose to connect to a test database
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
it('should return a 401 status code if the email or password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request(app)
        .post('/users/login')
        .send({
        email: 'test@test',
        password: 'password',
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
}));
describe('POST /users/register', () => {
    it('should return a status code of 201 and a user object upon successful registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            message: 'User Created',
            user: {
                email: expect.any(String),
                password: expect.any(String),
                userRole: 'user',
            },
        });
    }));
    it('should return a status code of 409 if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        const response = yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            message: 'User already in use',
        });
    }));
    it('should return a status code of 500 if an unexpected error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(User, 'create').mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });
        const response = yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
        });
    }));
});
//   describe('Auth Middleware', () => {
//     let mockReq;
//     let mockRes;
//     let next;
//     beforeEach(() => {
//       mockReq = {
//         headers: {}
//       };
//       mockRes = {
//         status: jest.fn().mockReturnThis(),
//       };
//       next = jest.fn();
//     });
//     it('should return a 401 status code if the authorization header is not present', async () => {
//       await checkAdmin(mockReq, mockRes, next);
//       expect(mockRes.status).toBe(401);
//       expect(next).not.toHaveBeenCalled();
//     });
//     it('should return a 403 status code if the user is not an admin', async () => {
//       mockReq.headers.authorization = 'Bearer abc123';
//       const user = { role: 'user' }; // Changed userRole to role
//       mockReq.user = user;
//       await checkAdmin(mockReq, mockRes, next);
//       expect(mockRes.status).toBe(403);
//       expect(next).not.toHaveBeenCalled();
//     });
//   });
describe('POST /users/register', () => {
    it('should return a status code of 201 and a user object upon successful registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            email: '<EMAIL>',
            userRole: 'user',
        });
    }));
    it('should return a status code of 409 if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        const response = yield request(app)
            .post('/users/register')
            .send({
            email: '<EMAIL>',
            password: 'password',
            userRole: 'user',
        });
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            message: 'User already in use',
        });
    }));
});
//# sourceMappingURL=admintests.test.js.map