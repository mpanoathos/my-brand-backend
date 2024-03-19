// Import necessary modules for testing
import request from 'supertest';
import app from '../app'; // Assuming your Express app instance is exported as 'app'
import User from '../models/User';
import Post from '../models/Post'; 
import Message from '../models/Messages'
import {createServer,Server} from 'http'
import jwt from 'jsonwebtoken';
let server:Server
const jwtSecret = process.env.JWT_SECRET as string;
beforeAll((done) => {
  server = createServer(app);
  server.listen(7000, done);
});

afterAll((done) => {
  server.close(done);
});
// Use Jest's describe() function to group tests for a specific endpoint or feature
describe('checkAdmin Middleware', () => {
  it('should deny access for non-admin user with valid token', async () => {
    const regularUser = {
      _id: 'regularUserId',
      userRole: 'regular'
    };

    const token = jwt.sign({ userId: regularUser._id }, jwtSecret);

    await request(app)
      .get('/protected-route') // Assuming this route is protected by checkAdmin middleware
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('should allow access for admin user with valid token', async () => {
    const adminUser = {
      _id: 'adminUserId',
      userRole: 'admin'
    };

    const token = jwt.sign({ userId: adminUser._id }, jwtSecret);

    const response = await request(app)
      .get('/protected-route') // Assuming this route is protected by checkAdmin middleware
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Add assertions for the response as needed
  });

  
  it('should return 401 for requests without authorization header', async () => {
    await request(app)
      .get('/protected-route') // Assuming this route is protected by checkAdmin middleware
      .expect(401);
  });

  it('should return 401 for requests with invalid token format', async () => {
    await request(app)
      .get('/protected-route') // Assuming this route is protected by checkAdmin middleware
      .set('Authorization', 'InvalidTokenFormat')
      .expect(401);
  });

  // Add more test cases to cover other scenarios like expired tokens, invalid tokens, etc.
});

describe('POST /users/login', () => {
  it('should return a JWT token if login credentials are valid', async () => {
    const userData = {
      email: 'example@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/users/login')
      .send(userData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('isAdmin', false); // Assuming userRole is not admin by default
  });

  it('should return 400 if invalid credentials are provided', async () => {
    const invalidData = {
      email: 'example@example.com'
      // No password provided intentionally to make it invalid
    };

    await request(app)
      .post('/users/login')
      .send(invalidData)
      .expect(400);
  });

  it('should return 401 if user does not exist', async () => {
    const nonExistentUser = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };

    await request(app)
      .post('/users/login')
      .send(nonExistentUser)
      .expect(401);
  });

  it('should return 401 if invalid password is provided', async () => {
    const incorrectPassword = {
      email: 'example@example.com',
      password: 'incorrectpassword'
    };

    await request(app)
      .post('/users/login')
      .send(incorrectPassword)
      .expect(401);
  });
});
describe('POST /users/register', () => {
    it('should register a new user and return a JWT token', async () => {
      // Make a POST request to the register endpoint with valid user data
      const response = await request(app)
        .post('/users/register')
        .send({ email: 'test@example.com', password: 'testpassword', userRole: 'user' });
  
      // Check if the response status code is 201
      expect(response.status).toBe(201);
      // Check if the response contains a JWT token
      expect(response.body).toHaveProperty('token');
      // Check if the response contains a message indicating successful user creation
      expect(response.body.message).toBe('User Created');
      // Check if the response contains user data
      expect(response.body).toHaveProperty('user');
    });
  
    it('should return a 400 error for invalid input data', async () => {
      // Make a POST request to the register endpoint with invalid user data
      const response = await request(app)
        .post('/users/register')
        .send({ email: 'invalidemail', password: '123', userRole: 'invalidrole' });
  
      // Check if the response status code is 400
      expect(response.status).toBe(400);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message');
    });
  
    it('should return a 409 error if the user already exists', async () => {
      // Make a POST request to the register endpoint with an existing email
      const response = await request(app)
        .post('/users/register')
        .send({ email: 'test@example.com', password: 'testpassword', userRole: 'user' });
  
      // Check if the response status code is 409
      expect(response.status).toBe(409);
      // Check if the response contains an error message
      expect(response.body.message).toBe('User already in use');
    });
    it('should return a 500 error for the internal server error', async () =>{
      const response =await request(app)
      .post('users/register')
      .send({ email: 'test@example.com', password: 'testpassword' ,userRole: 'user'})
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    })
  });
  describe('GET /users', () => {
    it('should get all users', async () => {
      // Make a GET request to the users endpoint
      const response = await request(app).get('/users');
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains an array of users
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the User.find() method to force an error
      jest.spyOn(User, 'find').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a GET request to the users endpoint
      const response = await request(app).get('/users');
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });

describe('PUT /users/:userId', () => {
  it('should update a user successfully', async () => {
    // Create a new user for testing
    const newUser = await User.create({
      email: 'test@example.com',
      password: 'testpassword',
      userRole: 'user'
    });

    // Make a PUT request to update the user with new data
    const response = await request(app)
      .put(`/users/${newUser._id}`)
      .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
      .send({ email: 'newemail@example.com', password: 'newpassword', userRole: 'admin' });

    // Check if the response status code is 200
    expect(response.status).toBe(200);
    // Check if the response contains a message indicating successful user update
    expect(response.body).toHaveProperty('message', 'User updated successfully');
    // Check if the response contains the updated user data
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('newemail@example.com');
    expect(response.body.user.userRole).toBe('admin');
  });

  it('should return a 404 error if user is not found', async () => {
    // Make a PUT request with an invalid user ID
    const response = await request(app)
      .put('/users/invaliduserid')
      .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
      .send({ email: 'newemail@example.com', password: 'newpassword', userRole: 'admin' });

    // Check if the response status code is 404
    expect(response.status).toBe(404);
    // Check if the response contains an error message
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should handle internal server errors gracefully', async () => {
    // Stubbing the User.findById() method to force an error
    jest.spyOn(User, 'findById').mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    // Make a PUT request to update a user
    const response = await request(app)
      .put('/users/validuserid')
      .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
      .send({ email: 'newemail@example.com', password: 'newpassword', userRole: 'admin' });

    // Check if the response status code is 500
    expect(response.status).toBe(500);
    // Check if the response contains an error message
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});
describe('POST /blogs/:id/like', () => {
  it('should increment the like count of a post', async () => {
    // Create a new post for testing
    const newPost = await Post.create({
      title: 'Test Post',
      body: 'Lorem ipsum dolor sit amet',
      likes: 0 // Start with 0 likes
    });

    // Make a POST request to like the post
    const response = await request(app)
      .post(`/blogs/${newPost._id}/like`)
      .set('Authorization', 'Bearer validToken'); // Set the Authorization header with a valid token

    // Check if the response status code is 200
    expect(response.status).toBe(200);
    // Check if the response contains the updated post data
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.likes).toBe(newPost.likes + 1);
  });

  it('should return a 404 error if the post is not found', async () => {
    // Make a POST request with an invalid post ID
    const response = await request(app)
      .post('/blogs/invalidpostid/like')
      .set('Authorization', 'Bearer validToken'); // Set the Authorization header with a valid token

    // Check if the response status code is 404
    expect(response.status).toBe(404);
    // Check if the response contains an error message
    expect(response.text).toBe('Post not found');
  });

  it('should handle internal server errors gracefully', async () => {
    // Stubbing the Post.findByIdAndUpdate() method to force an error
    jest.spyOn(Post, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    // Make a POST request to like a post
    const response = await request(app)
      .post('/blogs/validpostid/like')
      .set('Authorization', 'Bearer validToken'); // Set the Authorization header with a valid token

    // Check if the response status code is 500
    expect(response.status).toBe(500);
    // Check if the response contains an error message
    expect(response.text).toBe('Internal Server Error');
  });
});
describe('POST /blogs/:id/comment', () => {
    it('should add a comment to a post', async () => {
      // Create a new post for testing
      const newPost = await Post.create({
        title: 'Test Post',
        body: 'Lorem ipsum dolor sit amet',
        comments: [] // Start with an empty array of comments
      });
  
      // Make a POST request to add a comment to the post
      const response = await request(app)
        .post(`/blogs/${newPost._id}/comment`)
        .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
        .send({ commentText: 'This is a test comment' });
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains the updated post data with the added comment
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.comments.length).toBe(1);
      expect(response.body.data.comments[0].text).toBe('This is a test comment');
    });
  
    it('should return a 404 error if the post is not found', async () => {
      // Make a POST request with an invalid post ID
      const response = await request(app)
        .post('/blogs/invalidpostid/comment')
        .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
        .send({ commentText: 'This is a test comment' });
  
      // Check if the response status code is 404
      expect(response.status).toBe(404);
      // Check if the response contains an error message
      expect(response.text).toBe('Post not found');
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the Post.findByIdAndUpdate() method to force an error
      jest.spyOn(Post, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a POST request to add a comment to a post
      const response = await request(app)
        .post('/blogs/validpostid/comment')
        .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
        .send({ commentText: 'This is a test comment' });
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.text).toBe('Internal Server Error');
    });
  });
  describe('GET /blogs/:id/comments', () => {
    it('should get comments for a post', async () => {
      // Create a new post with comments for testing
      const newPost = await Post.create({
        title: 'Test Post',
        body: 'Lorem ipsum dolor sit amet',
        comments: [{ text: 'Comment 1' }, { text: 'Comment 2' }]
      });
  
      // Make a GET request to retrieve comments for the post
      const response = await request(app)
        .get(`/blogs/${newPost._id}/comments`)
        .set('Authorization', 'Bearer validToken'); // Set the Authorization header with a valid token
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains an array of comments
      expect(response.body).toHaveProperty('comments');
      expect(Array.isArray(response.body.comments)).toBe(true);
      // Check if the comments retrieved match the comments added to the post
      expect(response.body.comments.length).toBe(2);
      expect(response.body.comments[0].text).toBe('Comment 1');
      expect(response.body.comments[1].text).toBe('Comment 2');
    });
  
    it('should return a 404 error if the post is not found', async () => {
      // Make a GET request with an invalid post ID
      const response = await request(app)
        .get('/blogs/invalidpostid/comments')
        .set('Authorization', 'Bearer validToken'); // Set the Authorization header with a valid token
  
      // Check if the response status code is 404
      expect(response.status).toBe(404);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message', 'Post not found');
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the Post.findById() method to force an error
      jest.spyOn(Post, 'findById').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a GET request to retrieve comments for a post
      const response = await request(app)
        .get('/blogs/validpostid/comments')
        .set('Authorization', 'Bearer validToken'); // Set the Authorization header with a valid token
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });
  
describe('POST /blogs/post', () => {
    it('should create a new post', async () => {
      // Make a POST request to create a new post
      const response = await request(app)
        .post('/blogs/post')
        .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
        .send({ title: 'New Post', body: 'This is the body of the new post' });
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains the newly created post
      expect(response.body).toHaveProperty('title', 'New Post');
      expect(response.body).toHaveProperty('body', 'This is the body of the new post');
    });
  
    it('should return a 400 error if validation fails', async () => {
      // Make a POST request with invalid data (missing title)
      const response = await request(app)
        .post('/blogs/post')
        .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
        .send({ body: 'This is the body of the new post' });
  
      // Check if the response status code is 400
      expect(response.status).toBe(400);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message');
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the Post.create() method to force an error
      jest.spyOn(Post, 'create').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a POST request to create a new post
      const response = await request(app)
        .post('/blogs/post')
        .set('Authorization', 'Bearer validToken') // Set the Authorization header with a valid token
        .send({ title: 'New Post', body: 'This is the body of the new post' });
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });
  describe('POST /messages', () => {
    it('should create a new message', async () => {
      // Make a POST request to create a new message
      const response = await request(app)
        .post('/messages')
        .send({ name: 'John Doe', email: 'john@example.com', message: 'Test message' });
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains the newly created message
      expect(response.body).toHaveProperty('name', 'John Doe');
      expect(response.body).toHaveProperty('email', 'john@example.com');
      expect(response.body).toHaveProperty('message', 'Test message');
    });
  
    it('should return a 400 error if validation fails', async () => {
      // Make a POST request with invalid data (missing name)
      const response = await request(app)
        .post('/messages')
        .send({ email: 'john@example.com', message: 'Test message' });
  
      // Check if the response status code is 400
      expect(response.status).toBe(400);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message');
    });
  });
  
  describe('GET /messages', () => {
    it('should retrieve all messages', async () => {
      // Make a GET request to retrieve all messages
      const response = await request(app).get('/messages');
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains an array of messages
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the Message.find() method to force an error
      jest.spyOn(Message, 'find').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a GET request to retrieve all messages
      const response = await request(app).get('/messages');
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });
  describe('PUT /blogs/post/:id', () => {
    it('should update a post', async () => {
      // Create a new post to update
      const newPost = await Post.create({ title: 'Old Title', body: 'Old Body' });
  
      // Make a PUT request to update the post
      const response = await request(app)
        .put(`/blogs/post/${newPost._id}`)
        .send({ title: 'New Title', body: 'New Body' });
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains the updated post
      expect(response.body).toHaveProperty('title', 'New Title');
      expect(response.body).toHaveProperty('body', 'New Body');
    });
  
    it('should return a 404 error if the post is not found', async () => {
      // Make a PUT request with an invalid post ID
      const response = await request(app)
        .put('/blogs/post/invalidpostid')
        .send({ title: 'New Title', body: 'New Body' });
  
      // Check if the response status code is 404
      expect(response.status).toBe(404);
      // Check if the response contains an error message
      expect(response.text).toBe('Post not found');
    });
  
    it('should return a 400 error if title or body is missing', async () => {
      // Create a new post to update
      const newPost = await Post.create({ title: 'Old Title', body: 'Old Body' });
  
      // Make a PUT request with missing title
      let response = await request(app)
        .put(`/blogs/post/${newPost._id}`)
        .send({ body: 'New Body' });
  
      // Check if the response status code is 400
      expect(response.status).toBe(400);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('error');
  
      // Make a PUT request with missing body
      response = await request(app)
        .put(`/blogs/post/${newPost._id}`)
        .send({ title: 'New Title' });
  
      // Check if the response status code is 400
      expect(response.status).toBe(400);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('error');
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the Post.findByIdAndUpdate() method to force an error
      jest.spyOn(Post, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a PUT request to update a post
      const response = await request(app)
        .put('/blogs/post/validpostid')
        .send({ title: 'New Title', body: 'New Body' });
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
  describe('DELETE /blogs/post/:id', () => {
    it('should delete a post', async () => {
      // Create a new post to delete
      const newPost = await Post.create({ title: 'Test Post', body: 'Test Body' });
  
      // Make a DELETE request to delete the post
      const response = await request(app).delete(`/blogs/post/${newPost._id}`);
  
      // Check if the response status code is 200
      expect(response.status).toBe(200);
      // Check if the response contains the deleted post information
      expect(response.body).toHaveProperty('ok', 1); // MongoDB returns { ok: 1 } if the deletion is successful
    });
  
    it('should return a 404 error if the post is not found', async () => {
      // Make a DELETE request with an invalid post ID
      const response = await request(app).delete('/blogs/post/invalidpostid');
  
      // Check if the response status code is 404
      expect(response.status).toBe(404);
      // Check if the response contains an error message
      expect(response.text).toBe('Post not found');
    });
  
    it('should handle internal server errors gracefully', async () => {
      // Stubbing the Post.deleteOne() method to force an error
      jest.spyOn(Post, 'deleteOne').mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
  
      // Make a DELETE request to delete a post
      const response = await request(app).delete('/blogs/post/validpostid');
  
      // Check if the response status code is 500
      expect(response.status).toBe(500);
      // Check if the response contains an error message
      expect(response.text).toBe('Internal Server Error');
    });
  });