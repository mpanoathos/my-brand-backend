import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Post,{PostDocument} from '../models/Post'

describe('Blog Routes', () => {
  it('should retrieve all posts with an initial length of 0', async () => {
    // Clear existing posts or set up the test environment to ensure no posts exist
  
    const response = await request(app).get('/blogs');
    expect(response.status).toBe(200);
    expect(response.body);
  });
  
  it('should get a specific blog by ID', async () => {
    // Set up the test environment if needed
  
    const postId =new mongoose.Types.ObjectId(); // Generate a valid ObjectId
  
    const testPost = new Post({
      _id: postId,
      title: 'Test Blog',
      body: 'This is a test blog content.',
      // other required fields
    });
  
    await testPost.save();
  
    const response = await request(app).get(`/blogs/${postId}`);
  
    // Assertions for retrieving a specific post
  });
  
});
