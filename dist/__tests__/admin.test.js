var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// checkAdmin.test.ts
import request from 'supertest';
import app from '../app.js';
import User from '../models/Post.js';
import Post from '../models/Post.js';
describe('Admin features testing', () => {
    it('should allow access for admin user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have an admin user with a valid token
        const response = yield request(app)
            .get('/users') // Update the route as needed
            .set('Cookie', 'token=valid_admin_token');
        expect(response.status).toBe(200);
        // Add more assertions as needed
    }));
    it('should deny access for non-admin user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a non-admin user with a valid token
        const response = yield request(app)
            .get('/users') // Update the route as needed
            .set('Cookie', 'token=valid_non_admin_token');
        expect(response.status).toBe(401);
        // Add more assertions as needed
    }));
    it('should deny access for requests without a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .get('/users'); // Update the route as needed
        expect(response.status).toBe(401);
        // Add more assertions as needed
    }));
    it('should deny access for requests with an invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .get('/users') // Update the route as needed
            .set('Cookie', 'token=invalid_token');
        expect(response.status).toBe(401);
        // Add more assertions as needed
    }));
    it('should deny access for requests with expired token', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have an expired token
        const response = yield request(app)
            .get('/users') // Update the route as needed
            .set('Cookie', 'token=expired_token');
        expect(response.status).toBe(401);
        // Add more assertions as needed
    }));
    it('should return 400 if invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/login')
            .send({ invalidField: 'invalidValue' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 401 if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/login')
            .send({ email: 'nonexistent@example.com', password: 'password123' });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    }));
    it('should return 401 if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a valid user with known credentials
        const response = yield request(app)
            .post('/users/login')
            .send({ email: 'valid@example.com', password: 'incorrectPassword' });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    }));
    it('should return 200 and a valid token on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a valid user with known credentials
        const response = yield request(app)
            .post('/users/login')
            .send({ email: 'valid@example.com', password: 'validPassword' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Valid Credentials');
        expect(response.headers['set-cookie']).toBeDefined();
    }));
    it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate an internal server error
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('Simulated Internal Server Error');
        });
        const response = yield request(app)
            .post('/users/login')
            .send({ email: 'valid@example.com', password: 'validPassword' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal Server Error');
    }));
    it('should return 400 if invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ invalidField: 'invalidValue' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 400 if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'valid@example.com' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 400 if email or password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'invalid-email', password: 'short' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 409 if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a user with a known email
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'existing@example.com', password: 'validPassword' });
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', 'User already in use');
    }));
    it('should return 201 and create a new user on successful registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'newuser@example.com', password: 'validPassword' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User Created');
        expect(response.body).toHaveProperty('user');
    }));
    it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate an internal server error
        jest.spyOn(User, 'create').mockImplementationOnce(() => {
            throw new Error('Simulated Internal Server Error');
        });
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'newuser@example.com', password: 'validPassword' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal server error');
    }));
    it('should return 400 if invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ invalidField: 'invalidValue' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 400 if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'valid@example.com' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 400 if email or password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'invalid-email', password: 'short' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 409 if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a user with a known email
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'existing@example.com', password: 'validPassword' });
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', 'User already in use');
    }));
    it('should return 201 and create a new user on successful registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'newuser@example.com', password: 'validPassword' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User Created');
        expect(response.body).toHaveProperty('user');
    }));
    it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate an internal server error
        jest.spyOn(User, 'create').mockImplementationOnce(() => {
            throw new Error('Simulated Internal Server Error');
        });
        const response = yield request(app)
            .post('/users/register')
            .send({ email: 'newuser@example.com', password: 'validPassword' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal server error');
    }));
    it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .put('/users/someUserId')
            .send({ email: 'newemail@example.com', password: 'newPassword', userRole: 'admin' });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'You are not allowed to perform this action');
    }));
    it('should return 400 if invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .put('/users/someUserId')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send({ invalidField: 'invalidValue' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    it('should return 404 if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .put('/users/nonexistentUserId')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send({ email: 'newemail@example.com', password: 'newPassword', userRole: 'admin' });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
    }));
    it('should return 200 and update user on successful update', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a valid user with known userId
        const response = yield request(app)
            .put('/users/someUserId')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send({ email: 'newemail@example.com', password: 'newPassword', userRole: 'admin' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User updated successfully');
        expect(response.body).toHaveProperty('user');
    }));
    it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate an internal server error
        jest.spyOn(User, 'findById').mockImplementationOnce(() => {
            throw new Error('Simulated Internal Server Error');
        });
        const response = yield request(app)
            .put('/users/someUserId')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send({ email: 'newemail@example.com', password: 'newPassword', userRole: 'admin' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal Server Error');
    }));
    it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/blogs/somePostId/like')
            .send();
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'You are not allowed to perform this action');
    }));
    it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app)
            .post('/blogs/nonexistentPostId/like')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send();
        expect(response.status).toBe(404);
        expect(response.text).toBe('Post not found');
    }));
    it('should return 200 and updated post data on successful like', () => __awaiter(void 0, void 0, void 0, function* () {
        // Assuming you have a valid post with known postId
        const response = yield request(app)
            .post('/blogs/somePostId/like')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send();
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('likes');
    }));
    it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate an internal server error
        jest.spyOn(Post, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error('Simulated Internal Server Error');
        });
        const response = yield request(app)
            .post('/blogs/somePostId/like')
            .set('Cookie', 'token=validAdminToken') // Add a valid admin token
            .send();
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    }));
    describe('Get Likes for a Post Endpoint', () => {
        it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .get('/blogs/somePostId/likes')
                .send();
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'You are not allowed to perform this action');
        }));
        it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .get('/blogs/nonexistentPostId/likes')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send();
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Post not found');
        }));
        it('should return 200 and likes count for a valid post', () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a valid post with known postId
            const response = yield request(app)
                .get('/blogs/somePostId/likes')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send();
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('likes');
        }));
        it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simulate an internal server error
            jest.spyOn(Post, 'findById').mockImplementationOnce(() => {
                throw new Error('Simulated Internal Server Error');
            });
            const response = yield request(app)
                .get('/blogs/somePostId/likes')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send();
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal Server Error');
        }));
    });
    describe('Comment on a Post Endpoint', () => {
        it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post('/blogs/somePostId/comment')
                .send();
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'You are not allowed to perform this action');
        }));
        it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .post('/blogs/nonexistentPostId/comment')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ commentText: 'Test comment' });
            expect(response.status).toBe(404);
            expect(response.text).toBe('Post not found');
        }));
        it('should return 200 and updated post data on successful comment', () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a valid post with known postId
            const response = yield request(app)
                .post('/blogs/somePostId/comment')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ commentText: 'Test comment' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('comments');
            expect(response.body.data.comments).toHaveLength(1); // Assuming the comment was added successfully
        }));
        it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simulate an internal server error
            jest.spyOn(Post, 'findByIdAndUpdate').mockImplementationOnce(() => {
                throw new Error('Simulated Internal Server Error');
            });
            const response = yield request(app)
                .post('/blogs/somePostId/comment')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ commentText: 'Test comment' });
            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal Server Error');
        }));
    });
    describe('Get Comments for a Post Endpoint', () => {
        it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .get('/blogs/somePostId/comments')
                .send();
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Unauthorized, please Login');
        }));
        it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .get('/blogs/nonexistentPostId/comments')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send();
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Post not found');
        }));
        it('should return 200 and comments array if post found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a valid post with known postId
            const response = yield request(app)
                .get('/blogs/somePostId/comments')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send();
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('comments');
            expect(response.body.comments).toBeInstanceOf(Array);
        }));
        it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simulate an internal server error
            jest.spyOn(Post, 'findById').mockImplementationOnce(() => {
                throw new Error('Simulated Internal Server Error');
            });
            const response = yield request(app)
                .get('/blogs/somePostId/comments')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send();
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal Server Error');
        }));
    });
    describe('Update Post Endpoint', () => {
        it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .put('/blogs/post/somePostId')
                .send({ title: 'Updated Title', body: 'Updated Body' });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Unauthorized, please Login');
        }));
        it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .put('/blogs/post/nonexistentPostId')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ title: 'Updated Title', body: 'Updated Body' });
            expect(response.status).toBe(404);
            expect(response.body).toBe('Post not found');
        }));
        it('should return 400 if title or body are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .put('/blogs/post/somePostId')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ title: 'Updated Title' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Title and body are required fields');
        }));
        it('should return 200 and updated post if successful', () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a valid post with known postId
            const response = yield request(app)
                .put('/blogs/post/somePostId')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ title: 'Updated Title', body: 'Updated Body' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('title', 'Updated Title');
            expect(response.body).toHaveProperty('body', 'Updated Body');
        }));
        it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simulate an internal server error
            jest.spyOn(Post, 'findByIdAndUpdate').mockImplementationOnce(() => {
                throw new Error('Simulated Internal Server Error');
            });
            const response = yield request(app)
                .put('/blogs/post/somePostId')
                .set('Cookie', 'token=validAdminToken') // Add a valid admin token
                .send({ title: 'Updated Title', body: 'Updated Body' });
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        }));
    });
    describe('Delete Post Endpoint', () => {
        it('should return 401 if not authorized as admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .delete('/blogs/post/somePostId')
                .send();
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Unauthorized, please Login');
        }));
        it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app)
                .delete('/blogs/post/nonexistentPostId')
                .set('Cookie', 'token=validAdminToken'); // Add a valid admin token
            expect(response.status).toBe(404);
            expect(response.body).toBe('Post not found');
        }));
        it('should return 200 and deleted post info if successful', () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a valid post with known postId
            const response = yield request(app)
                .delete('/blogs/post/somePostId')
                .set('Cookie', 'token=validAdminToken'); // Add a valid admin token
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('n', 1); // Number of deleted documents
            expect(response.body).toHaveProperty('ok', 1);
            expect(response.body).toHaveProperty('deletedCount', 1);
        }));
        it('should return 500 on internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simulate an internal server error
            jest.spyOn(Post, 'deleteOne').mockImplementationOnce(() => {
                throw new Error('Simulated Internal Server Error');
            });
            const response = yield request(app)
                .delete('/blogs/post/somePostId')
                .set('Cookie', 'token=validAdminToken'); // Add a valid admin token
            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal Server Error');
        }));
    });
});
//# sourceMappingURL=admin.test.js.map